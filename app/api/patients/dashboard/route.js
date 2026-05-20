import { NextResponse } from "next/server";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get patient info - FIXED: use doc() with userId as document ID
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : null;

    // Get upcoming appointments (bookings)
    const today = new Date().toISOString().split('T')[0];
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("patientID", "==", userId),
      where("date", ">=", today),
      orderBy("date", "asc"),
      limit(5)
    );
    const bookingsSnapshot = await getDocs(bookingsQuery);
    const upcomingBookings = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get past bookings count
    const pastBookingsQuery = query(
      collection(db, "bookings"),
      where("patientID", "==", userId),
      where("date", "<", today)
    );
    const pastBookingsSnapshot = await getDocs(pastBookingsQuery);

    // Get recent notifications from subcollection
    const notificationsQuery = query(
      collection(db, "notifications", userId, "items"),
      orderBy("createdAt", "desc"),
      limit(4)
    );
    const notificationsSnapshot = await getDocs(notificationsQuery);
    const recentNotifications = notificationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const stats = {
      totalBookings: bookingsSnapshot.size + pastBookingsSnapshot.size,
      upcomingBookings: bookingsSnapshot.size,
      completedBookings: pastBookingsSnapshot.size,
      unreadNotifications: recentNotifications.filter(n => !n.read).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        upcomingBookings,
        recentNotifications,
        stats,
      },
    });
  } catch (err) {
    console.error("GET /api/patients/dashboard error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

export async function GET() {
  try {
    // Fetch all bookings
    const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const bookingsSnapshot = await getDocs(bookingsQuery);
    
    const bookings = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch all clinics from users collection
    const clinicsQuery = query(collection(db, 'users'), where('role', '==', 'clinic'));
    const clinicsSnapshot = await getDocs(clinicsQuery);
    
    // Create a map of clinic ID to clinic data
    const clinicsMap = new Map();
    clinicsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      clinicsMap.set(doc.id, {
        name: data.clinicName || data.name || "Unknown Clinic",
        city: data.city || "",
        phone: data.phone || data.contact || "",
      });
    });
    
    // Attach clinic name to each booking
    const enrichedBookings = bookings.map((booking) => ({
      ...booking,
      clinicName: clinicsMap.get(booking.clinicID)?.name || "Unknown Clinic",
      clinicCity: clinicsMap.get(booking.clinicID)?.city || "",
    }));
    
    return NextResponse.json({ success: true, data: enrichedBookings });
  } catch (err) {
    console.error('GET /api/bookings/getAllBookings error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
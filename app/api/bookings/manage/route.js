// for pending requests in client side

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  orderBy 
} from 'firebase/firestore';

// GET: Fetch all pending bookings for a specific clinic
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicID = searchParams.get('clinicID');

    if (!clinicID) return NextResponse.json({ error: "Clinic ID required" }, { status: 400 });

    const q = query(
        collection(db, "bookings"),
        where("clinicID", "==", clinicID),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc") 
        );

    const snapshot = await getDocs(q);
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data: requests });
  } catch (err) {
    console.error("GET manage bookings error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Update the status of a booking
export async function POST(req) {
  try {
    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Missing bookingId or status" }, { status: 400 });
    }

    const docRef = doc(db, "bookings", bookingId);
    await updateDoc(docRef, { 
        status: status, // 'confirmed' or 'rejected'
        processedAt: new Date().toISOString() 
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
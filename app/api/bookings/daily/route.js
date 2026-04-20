//daily schedule client side
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicID = searchParams.get('clinicID');
    const date = searchParams.get('date');

    if (!clinicID || !date) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    // This query now matches your second index EXACTLY
    const q = query(
      collection(db, "bookings"),
      where("clinicID", "==", clinicID),
      where("date", "==", date),
      where("status", "!=", "pending"), // This works now because status is in the index
      orderBy("status"), 
      orderBy("time", "asc")
    );

    const snapshot = await getDocs(q);
    const schedule = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ success: true, data: schedule });
  } catch (err) {
    console.error("API ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST remains the same for updating status
export async function POST(req) {
  try {
    const { bookingId, status } = await req.json();
    await updateDoc(doc(db, "bookings", bookingId), { 
      status: status,
      updatedAt: new Date().toISOString() 
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
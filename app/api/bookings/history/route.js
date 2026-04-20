//booking history

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicID = searchParams.get('clinicID');

    if (!clinicID) {
      return NextResponse.json({ error: "clinicID is required" }, { status: 400 });
    }

    // This query matches your "Index 1" (clinicID, status, createdAt)
    const q = query(
      collection(db, "bookings"),
      where("clinicID", "==", clinicID),
      where("status", "!=", "pending"), 
      orderBy("status"),
      orderBy("createdAt", "desc")    
    );

    const snapshot = await getDocs(q);
    
    // This will now include patientName and doctorName 
    // because they were saved into the document by our updated Booking API
    const history = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    return NextResponse.json({ success: true, data: history });
  } catch (err) {
    console.error("HISTORY API GET ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { bookingId, status } = await req.json();
    
    if (!bookingId || !status) {
      return NextResponse.json({ error: "Missing bookingId or status" }, { status: 400 });
    }

    const docRef = doc(db, "bookings", bookingId);
    await updateDoc(docRef, { 
      status: status, // Update to 'Completed' or 'Cancelled'
      updatedAt: new Date().toISOString() 
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("HISTORY API POST ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
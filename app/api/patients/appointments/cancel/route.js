import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function POST(req) {
  try {
    const { bookingId, patientID } = await req.json();

    if (!bookingId || !patientID) {
      return NextResponse.json({ error: 'Missing bookingId or patientID' }, { status: 400 });
    }

    const bookingSnap = await getDoc(doc(db, 'bookings', bookingId));
    if (!bookingSnap.exists()) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingSnap.data();
    if (booking.patientID !== patientID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Already cancelled' }, { status: 400 });
    }

    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/patient/appointments/cancel error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

// ── GET: Fetch all bookings for a specific patient ───────────────
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const patientID = searchParams.get('patientID');

    if (!patientID) {
      return NextResponse.json({ error: 'patientID is required' }, { status: 400 });
    }

    const q = query(
      collection(db, 'bookings'),
      where('patientID', '==', patientID),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // Enrich with clinic name (same pattern as getAllBookings)
    const clinicIDs = [...new Set(bookings.map(b => b.clinicID).filter(Boolean))];
    const clinicMap = new Map();

    await Promise.all(
      clinicIDs.map(async (clinicID) => {
        try {
          const clinicSnap = await getDoc(doc(db, 'users', clinicID));
          if (clinicSnap.exists()) {
            const data = clinicSnap.data();
            clinicMap.set(clinicID, {
              name: data.clinicName || data.name || 'Unknown Clinic',
              city: data.city || '',
              phone: data.phone || data.contact || '',
            });
          }
        } catch (_) {}
      })
    );

    const enriched = bookings.map(b => ({
      ...b,
      clinicName: clinicMap.get(b.clinicID)?.name || b.clinicName || 'Unknown Clinic',
      clinicCity: clinicMap.get(b.clinicID)?.city || '',
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (err) {
    console.error('GET /api/patients/appointments error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST: Patient cancels their own appointment ──────────────────
export async function POST(req) {
  try {
    const { bookingId, patientID } = await req.json();

    if (!bookingId || !patientID) {
      return NextResponse.json({ error: 'Missing bookingId or patientID' }, { status: 400 });
    }

    // Verify the booking belongs to this patient before allowing cancellation
    const bookingSnap = await getDoc(doc(db, 'bookings', bookingId));
    if (!bookingSnap.exists()) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingSnap.data();
    if (booking.patientID !== patientID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Booking is already cancelled' }, { status: 400 });
    }

    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/patients/appointments/cancel error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
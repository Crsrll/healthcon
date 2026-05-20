// app/api/clinic/bookings/pending/route.js  (your "pending requests" API)
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {collection, getDocs, query, where, doc, updateDoc, orderBy, getDoc } from 'firebase/firestore';
import { createNotification } from '@/lib/createNotification';

// ── GET: Fetch all pending bookings for a clinic ─────────────────
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicID = searchParams.get('clinicID');

    if (!clinicID) return NextResponse.json({ error: "Clinic ID required" }, { status: 400 });

    const q = query(
      collection(db, "bookings"),
      where("clinicID", "==", clinicID),
      where("status",   "==", "pending"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const requests = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ success: true, data: requests });
  } catch (err) {
    console.error("GET pending bookings error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST: Confirm or reject a booking → notify the patient ───────
export async function POST(req) {
  try {
    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Missing bookingId or status" }, { status: 400 });
    }

    // 1. Fetch the booking so we have patientID, date, time, service, clinicID
    const bookingSnap = await getDoc(doc(db, "bookings", bookingId));
    if (!bookingSnap.exists()) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    const booking = bookingSnap.data();

    // 2. Fetch clinic name for a friendlier notification message
    let clinicName = "the clinic";
    try {
      const clinicSnap = await getDoc(doc(db, "clinics", booking.clinicID));
      if (clinicSnap.exists()) clinicName = clinicSnap.data().clinicName ?? clinicName;
    } catch (_) {}

    // 3. Update booking status
    await updateDoc(doc(db, "bookings", bookingId), {
      status,
      processedAt: new Date().toISOString(),
    });

    // 4. ── Notify the PATIENT of the outcome ──
    const isConfirmed = status === "confirmed";
    await createNotification({
      recipientID: booking.patientID,
      type:   isConfirmed ? 'booking_confirmed' : 'booking_rejected',
      title:  isConfirmed ? 'Appointment Confirmed ✓' : 'Appointment Not Approved',
      body:   isConfirmed
        ? `Your appointment at ${clinicName} on ${booking.date} at ${booking.time} has been confirmed.`
        : `Your appointment request at ${clinicName} on ${booking.date} at ${booking.time} was not approved.`,
      linkTo: '/patient/appointments',
      meta:   {
        bookingID: bookingId,
        clinicName,
        date:    booking.date,
        time:    booking.time,
        service: booking.service,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST pending bookings error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
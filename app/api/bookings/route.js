// app/api/bookings/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { timeToMinutes } from '@/lib/timeUtils';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clinicID = searchParams.get('clinicID');
  const doctorID = searchParams.get('doctorID');
  const date     = searchParams.get('date');

  if (!clinicID || !doctorID || !date) {
    return NextResponse.json({ bookedTimes: [] });
  }

  try {
    const q = query(
      collection(db, 'bookings'),
      where('clinicID', '==', clinicID),
      where('doctorID', '==', doctorID),
      where('date',     '==', date),
      where('status',   'in', ['pending', 'confirmed'])
    );

    const snap = await getDocs(q);
    const bookedTimes = snap.docs.map(doc => doc.data().time);

    return NextResponse.json({ bookedTimes });
  } catch (err) {
    console.error('GET /api/bookings error:', err);
    return NextResponse.json({ bookedTimes: [] }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { clinicID, doctorID, patientID, service, day, time, date, notes } = body;

    if (!clinicID || !doctorID || !patientID || !service || !day || !time || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
	
	const doctorRef = doc(db, 'doctors', doctorID);
const doctorSnap = await getDoc(doctorRef);

if (!doctorSnap.exists()) {
  return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
}

const doctor = doctorSnap.data();
const availability = doctor.availability;

const dayMap = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
  Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};

const normalizedDay = dayMap[day] ?? day; // handles both formats

if (!availability.days.includes(normalizedDay)) {
  return NextResponse.json(
    { error: 'Doctor unavailable on selected day' },
    { status: 400 }
  );
}

const selectedMinutes = timeToMinutes(time);                  // "9:00 AM"
const startMinutes    = timeToMinutes(availability.startTime); // "09:00"
const endMinutes      = timeToMinutes(availability.endTime);   // "17:00"


if (selectedMinutes < startMinutes || selectedMinutes >= endMinutes) {
  return NextResponse.json(
    { error: 'Selected time outside doctor schedule' },
    { status: 400 }
  );
}

    const ref = await addDoc(collection(db, 'bookings'), {
      clinicID,
      doctorID,
      patientID,
      service,
      day,
      time,
      date,
      notes: notes ?? '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: ref.id });
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
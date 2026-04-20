import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { timeToMinutes } from '@/lib/timeUtils';

// ── GET: FETCH BOOKED SLOTS ──────────────────────────────────────
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

// ── POST: CREATE NEW BOOKING ─────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const { clinicID, doctorID, patientID, service, day, time, date } = body;

    // 1. Basic Validation
    if (!clinicID || !doctorID || !patientID || !service || !day || !time || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. FETCH PATIENT DATA (THE ADJUSTMENT)
    // We look up the patient in the "users" collection to get their real name
    const userRef = doc(db, 'users', patientID);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'Patient profile not found.' }, { status: 404 });
    }

    const userData = userSnap.data();
    // Format name: "First M. Last" (handles optional Middle Initial)
    const mi = userData.middleInitial ? `${userData.middleInitial} ` : "";
    const fullName = `${userData.firstName} ${mi}${userData.lastName}`.replace(/\s+/g, ' ').trim();

    // 3. DOCTOR AVAILABILITY CHECK
    const doctorRef = doc(db, 'doctors', doctorID);
    const doctorSnap = await getDoc(doctorRef);

    if (!doctorSnap.exists()) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const doctor = doctorSnap.data();
    const availability = doctor.availability;
    const actualDoctorName = doctor.name;

    // Map UI short names to DB full names
    const dayMap = {
      Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
      Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
    };
    const normalizedDay = dayMap[day] ?? day;

    // Validate Day
    if (!availability.days.includes(normalizedDay)) {
      return NextResponse.json({ error: 'Doctor unavailable on selected day' }, { status: 400 });
    }

    // Validate Time
    const selectedMinutes = timeToMinutes(time);
    const startMinutes    = timeToMinutes(availability.startTime);
    const endMinutes      = timeToMinutes(availability.endTime);

    if (selectedMinutes < startMinutes || selectedMinutes >= endMinutes) {
      return NextResponse.json({ error: 'Selected time outside doctor schedule' }, { status: 400 });
    }

    // 4. SAVE FINAL BOOKING
    const ref = await addDoc(collection(db, 'bookings'), {
      clinicID,
      doctorID,
      doctorName: `Dr. ${actualDoctorName}`,
      patientID,
      patientName: fullName,
      service,
      day,
      time,
      date,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: ref.id });
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
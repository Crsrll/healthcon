// app/api/clinic/stats/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicID = searchParams.get('clinicID');
    const today = new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD"

    if (!clinicID) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const bookingsRef = collection(db, "bookings");
    const inquiriesRef = collection(db, "inquiries");

    // 1. Fetch Today's Total (Everything today that isn't pending)
    const qToday = query(bookingsRef, where("clinicID", "==", clinicID), where("date", "==", today));
    const snapToday = await getDocs(qToday);
    const allToday = snapToday.docs.map(d => d.data());
    
    const todayTotal = allToday.filter(b => b.status !== 'pending').length;
    const completedToday = allToday.filter(b => b.status === 'Completed').length;

    // 2. Fetch ALL Pending Requests (regardless of date)
    const qPending = query(bookingsRef, where("clinicID", "==", clinicID), where("status", "==", "pending"));
    const snapPending = await getDocs(qPending);
    const pendingCount = snapPending.size;

    // 3. Fetch Unread Inquiries
    const qInquiries = query(inquiriesRef, where("clinicID", "==", clinicID), where("unreadByClinic", "==", true));
    const snapInquiries = await getDocs(qInquiries);
    const unreadInquiries = snapInquiries.size;

    return NextResponse.json({
      success: true,
      stats: {
        todayTotal,
        pendingCount,
        unreadInquiries,
        completedToday
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
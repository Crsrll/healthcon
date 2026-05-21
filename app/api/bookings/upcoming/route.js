// app/api/bookings/upcoming/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicID = searchParams.get('clinicID');

    if (!clinicID) {
      return NextResponse.json({ error: "clinicID is required" }, { status: 400 });
    }

    // Get today's date in YYYY-MM-DD format (client timezone safe)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`; // "2026-05-22"

    // Query: All confirmed bookings for this clinic
    const q = query(
      collection(db, "bookings"),
      where("clinicID", "==", clinicID),
      where("status", "==", "confirmed")
    );

    const snapshot = await getDocs(q);
    const allConfirmedBookings = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    // Filter: Only future dates (excluding today)
    const upcomingBookings = allConfirmedBookings.filter(booking => {
      const bookingDateStr = booking.date;
      return bookingDateStr > todayStr; // Only future dates
    });

    // Sort by date (earliest first)
    upcomingBookings.sort((a, b) => {
      return a.date.localeCompare(b.date);
    });

    // Format the date to "Month Day, Year"
    const formattedBookings = upcomingBookings.map(booking => {
      const dateObj = new Date(booking.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      const shortDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      return {
        ...booking,
        formattedDate: formattedDate,
        shortDate: shortDate,
        dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      };
    });

    // Add cache control headers to prevent caching
    return NextResponse.json({ 
      success: true, 
      data: formattedBookings,
      count: formattedBookings.length
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (err) {
    console.error("GET /api/bookings/upcoming error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
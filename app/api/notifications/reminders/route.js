// app/api/notifications/reminders/route.js
// ─────────────────────────────────────────────────────────────
// Call this endpoint from a cron job (e.g. Vercel Cron, GitHub
// Actions, or any scheduler) once per day.
//
// It finds all bookings whose date is tomorrow (status = confirmed)
// and sends an "appointment_reminder" notification to each patient.
//
// Protect with a shared CRON_SECRET so only your scheduler can call it:
//   Authorization: Bearer <CRON_SECRET>
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { createNotification } from "@/lib/createNotification";

export async function POST(req) {
  // ── Auth guard ──────────────────────────────────────────────
  const auth = req.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Calculate tomorrow's date string (YYYY-MM-DD) ───────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  try {
    const q = query(
      collection(db, "bookings"),
      where("date", "==", tomorrowStr),
      where("status", "==", "confirmed"),
    );
    const snap = await getDocs(q);

    let count = 0;
    await Promise.all(
      snap.docs.map(async (d) => {
        const b = d.data();
        await createNotification({
          recipientID: b.patientID,
          type: "appointment_reminder",
          title: "Appointment Tomorrow 🗓",
          body: `Reminder: you have an appointment tomorrow (${b.date}) at ${b.time}. Please arrive on time.`,
          linkTo: "/patient/bookings",
          meta: {
            bookingID: d.id,
            date: b.date,
            time: b.time,
            service: b.service,
          },
        });
        count++;
      }),
    );

    return NextResponse.json({ success: true, reminders_sent: count });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 },
    );
  }
}

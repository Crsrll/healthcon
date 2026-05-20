// app/api/ratings/route.js
// When a patient submits a rating, the clinic gets notified.

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection, addDoc, serverTimestamp,
  doc, getDoc, updateDoc, increment
} from "firebase/firestore";
import { createNotification } from "@/lib/createNotification";

export async function POST(req) {
  try {
    const { clinicID, patientID, patientName, rating, comment } = await req.json();

    if (!clinicID || !patientID || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Save rating
    await addDoc(collection(db, "ratings"), {
      clinicID,
      patientID,
      patientName: patientName ?? "",
      rating,        // number 1–5
      comment: comment ?? "",
      createdAt: serverTimestamp(),
    });

    // 2. Update clinic aggregate (optional but handy)
    try {
      await updateDoc(doc(db, "clinics", clinicID), {
        ratingTotal: increment(rating),
        ratingCount: increment(1),
      });
    } catch (_) {}

    // 3. Notify the CLINIC
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    await createNotification({
      recipientID: clinicID,
      type: "new_rating",
      title: "New Patient Review",
      body: `${patientName ?? "A patient"} left a ${rating}-star review${comment ? `: "${comment.slice(0, 60)}${comment.length > 60 ? "…" : ""}"` : "."}`,
      linkTo: "/clinic/reviews",
      meta: { clinicID, patientID, rating, stars },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
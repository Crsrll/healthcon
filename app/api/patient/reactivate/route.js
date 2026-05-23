// app/api/patient/reactivate/route.js
// PATCH /api/patient/reactivate

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function PATCH(request) {
  try {
    const { patientId } = await request.json();

    if (!patientId) {
      return NextResponse.json({ message: "patientId is required." }, { status: 400 });
    }

    const patientRef = db.collection("users").doc(patientId);
    const patientSnap = await patientRef.get();

    if (!patientSnap.exists) {
      return NextResponse.json({ message: "Patient not found." }, { status: 404 });
    }

    await patientRef.update({
      status: "active",
      reactivatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Account reactivated successfully." }, { status: 200 });
  } catch (error) {
    console.error("[API] /api/patient/reactivate error:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
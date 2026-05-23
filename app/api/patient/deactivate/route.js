// app/api/patient/deactivate/route.js
// PATCH /api/patient/deactivate

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
      status: "inactive",
      deactivatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Account deactivated successfully." }, { status: 200 });
  } catch (error) {
    console.error("[API] /api/patient/deactivate error:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
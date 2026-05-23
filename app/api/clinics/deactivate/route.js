// app/api/clinics/deactivate/route.js
// PATCH /api/clinics/deactivate
// Sets clinic status to "inactive" — hides it from patient listings.

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function PATCH(request) {
  try {
    const { clinicId } = await request.json();

    if (!clinicId) {
      return NextResponse.json({ message: "clinicId is required." }, { status: 400 });
    }

    const clinicRef = db.collection("users").doc(clinicId);
    const clinicSnap = await clinicRef.get();

    if (!clinicSnap.exists) {
      return NextResponse.json({ message: "Clinic not found." }, { status: 404 });
    }

    await clinicRef.update({
      status: "inactive",
      deactivatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Clinic deactivated successfully." }, { status: 200 });
  } catch (error) {
    console.error("[API] /api/clinics/deactivate error:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
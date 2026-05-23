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
      status: "active",
      reactivatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Clinic reactivated successfully." }, { status: 200 });
  } catch (error) {
    console.error("[API] /api/clinic/reactivate error:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
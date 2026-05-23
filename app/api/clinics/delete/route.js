import { NextResponse } from "next/server";
import { db, adminAuth } from "@/lib/firebase-admin";

export async function DELETE(request) {
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

    const batch = db.batch();

    const appts = await db.collection("appointments").where("clinicId", "==", clinicId).get();
    appts.forEach((doc) => batch.delete(doc.ref));

    const doctors = await db.collection("doctors").where("clinicId", "==", clinicId).get();
    doctors.forEach((doc) => batch.delete(doc.ref));

    const reviews = await db.collection("reviews").where("clinicId", "==", clinicId).get();
    reviews.forEach((doc) => batch.delete(doc.ref));

    batch.update(clinicRef, {
      status: "deleted",
      deletedAt: new Date().toISOString(),
    });

    await batch.commit();

    try {
      await adminAuth.deleteUser(clinicId);
    } catch (authErr) {
      console.warn("[API] Could not delete Firebase Auth user:", authErr.message);
    }

    return NextResponse.json({ message: "Clinic deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("[API] /api/clinics/delete error:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
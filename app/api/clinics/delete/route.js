// app/api/clinic/delete/route.js
// DELETE /api/clinic/delete
//
// Strategy:
// 1. Mark the clinic doc as status: "deleted" (soft delete — keeps the document)
// 2. Clear the email field on the Firestore doc so it can be reused
// 3. Update the Firebase Auth email to a placeholder so the original email is freed
// 4. Anonymize related records (appointments, reviews, etc.) instead of deleting them
//    — patients still need their booking/review history
// 5. Do NOT delete the Firebase Auth account (preserves UID linkage for audit trail)

import { NextResponse } from "next/server";
import { db, adminAuth } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function DELETE(request) {
  try {
    const { clinicId } = await request.json();

    if (!clinicId) {
      return NextResponse.json({ message: "clinicId is required." }, { status: 400 });
    }

    const clinicRef  = db.collection("users").doc(clinicId);
    const clinicSnap = await clinicRef.get();

    if (!clinicSnap.exists) {
      return NextResponse.json({ message: "Clinic not found." }, { status: 404 });
    }

    const deletedAt = new Date().toISOString();

    // ── 1. Free up the email in Firebase Auth ─────────────────────────────────
    // Change the Auth email to a placeholder so the original email can be
    // registered again. We do NOT delete the Auth account — the UID must stay
    // intact so existing Firestore records can still reference it for audit.
    try {
      await adminAuth.updateUser(clinicId, {
        email:       `deleted_${clinicId}@deleted.invalid`,
        displayName: "Deleted Clinic",
        photoURL:    null,
        disabled:    true, // prevent login
      });
    } catch (authErr) {
      console.warn("[API] Could not update Firebase Auth user:", authErr.message);
      // Non-fatal — proceed with Firestore soft delete
    }

    // ── 2. Anonymize related records (batch write) ────────────────────────────
    const batch = db.batch();

    // Appointments — keep for patients' history, anonymize clinic fields
    const appointments = await db
      .collection("appointments")
      .where("clinicId", "==", clinicId)
      .get();
    appointments.forEach((doc) => {
      batch.update(doc.ref, {
        clinicName:    "Deleted Clinic",
        clinicEmail:   FieldValue.delete(),
        clinicPhone:   FieldValue.delete(),
        clinicAddress: FieldValue.delete(),
        clinicImage:   FieldValue.delete(),
        anonymized:    true,
      });
    });

    // Reviews — keep for platform integrity, anonymize clinic reference
    const reviews = await db
      .collection("reviews")
      .where("clinicId", "==", clinicId)
      .get();
    reviews.forEach((doc) => {
      batch.update(doc.ref, {
        clinicName:  "Deleted Clinic",
        clinicImage: FieldValue.delete(),
        anonymized:  true,
      });
    });

    // Doctors under this clinic — mark as unaffiliated
    const doctors = await db
      .collection("doctors")
      .where("clinicId", "==", clinicId)
      .get();
    doctors.forEach((doc) => {
      batch.update(doc.ref, {
        clinicId:   FieldValue.delete(),
        clinicName: FieldValue.delete(),
        status:     "unaffiliated",
      });
    });

    // Reports filed against this clinic — safe to delete (clinic-originated context gone)
    const reports = await db
      .collection("clinicReports")
      .where("clinicId", "==", clinicId)
      .get();
    reports.forEach((doc) => batch.delete(doc.ref));

    // Notifications for this clinic — personal, safe to delete
    const notifications = await db
      .collection("notifications")
      .doc(clinicId)
      .collection("items")
      .get();
    notifications.forEach((doc) => batch.delete(doc.ref));

    // ── 3. Soft-delete the clinic document ───────────────────────────────────
    // Clear PII/sensitive fields but keep the document so UID references don't break.
    batch.update(clinicRef, {
      status:      "deleted",
      deletedAt,
      // Clear sensitive info
      email:       FieldValue.delete(),
      phone:       FieldValue.delete(),
      address:     FieldValue.delete(),
      image:       FieldValue.delete(),
      about:       FieldValue.delete(),
      contact:     FieldValue.delete(),
      clinicName:  "Deleted Clinic",
      approved:    false,
    });

    await batch.commit();

    return NextResponse.json(
      { message: "Clinic deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] /api/clinic/delete error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
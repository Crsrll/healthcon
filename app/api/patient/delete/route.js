// app/api/patient/delete/route.js
// DELETE /api/patient/delete
//
// Strategy:
// 1. Mark the user doc as status: "deleted" (soft delete — keeps the document)
// 2. Clear the email field on the Firestore doc so it can be reused
// 3. Update the Firebase Auth email to a placeholder so the original email is freed
// 4. Anonymize related records (appointments, reviews, etc.) instead of deleting them
//    — other parties (clinics) still need their booking/review history
// 5. Do NOT delete the Firebase Auth account (preserves UID linkage for audit trail)

import { NextResponse } from "next/server";
import { db, adminAuth } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function DELETE(request) {
  try {
    const { patientId } = await request.json();

    if (!patientId) {
      return NextResponse.json({ message: "patientId is required." }, { status: 400 });
    }

    const patientRef  = db.collection("users").doc(patientId);
    const patientSnap = await patientRef.get();

    if (!patientSnap.exists) {
      return NextResponse.json({ message: "Patient not found." }, { status: 404 });
    }

    const deletedAt = new Date().toISOString();

    // ── 1. Free up the email in Firebase Auth ─────────────────────────────────
    // Change the Auth email to a placeholder so the original email can be
    // registered again. We do NOT delete the Auth account — the UID must stay
    // intact so existing Firestore records can still reference it for audit.
    try {
      await adminAuth.updateUser(patientId, {
        email:         `deleted_${patientId}@deleted.invalid`,
        displayName:   "Deleted User",
        photoURL:      null,
        disabled:      true, // prevent login
      });
    } catch (authErr) {
      console.warn("[API] Could not update Firebase Auth user:", authErr.message);
      // Non-fatal — proceed with Firestore soft delete
    }

    // ── 2. Anonymize related records (batch write) ────────────────────────────
    // We keep the documents so clinics retain their history, but strip all
    // patient-identifying information from each record.
    const batch = db.batch();

    // Appointments — keep for clinic's history, anonymize patient fields
    const appointments = await db
      .collection("appointments")
      .where("patientId", "==", patientId)
      .get();
    appointments.forEach((doc) => {
      batch.update(doc.ref, {
        patientName:   "Deleted User",
        patientEmail:  FieldValue.delete(),
        patientPhone:  FieldValue.delete(),
        patientAvatar: FieldValue.delete(),
        anonymized:    true,
      });
    });

    // Reviews — keep for platform integrity, anonymize author
    const reviews = await db
      .collection("reviews")
      .where("patientId", "==", patientId)
      .get();
    reviews.forEach((doc) => {
      batch.update(doc.ref, {
        patientName:   "Deleted User",
        patientAvatar: FieldValue.delete(),
        patientEmail:  FieldValue.delete(),
        anonymized:    true,
      });
    });

    // Prescriptions — anonymize patient info, keep for clinic records
    const prescriptions = await db
      .collection("prescriptions")
      .where("patientId", "==", patientId)
      .get();
    prescriptions.forEach((doc) => {
      batch.update(doc.ref, {
        patientName:  "Deleted User",
        patientEmail: FieldValue.delete(),
        anonymized:   true,
      });
    });

    // Clinic reports — these are submitted by the patient so safe to delete
    const reports = await db
      .collection("clinicReports")
      .where("reporterID", "==", patientId)
      .get();
    reports.forEach((doc) => batch.delete(doc.ref));

    // Clinic replies — also patient-originated, safe to delete
    const replies = await db
      .collection("clinicReplies")
      .where("patientID", "==", patientId)
      .get();
    replies.forEach((doc) => batch.delete(doc.ref));

    // Notifications — personal to this user, safe to delete
    const notifications = await db
      .collection("notifications")
      .doc(patientId)
      .collection("items")
      .get();
    notifications.forEach((doc) => batch.delete(doc.ref));

    // ── 3. Soft-delete the user document ─────────────────────────────────────
    // Clear PII fields but keep the document so UID references don't break.
    batch.update(patientRef, {
      status:      "deleted",
      deletedAt,
      // Clear personal info
      email:       FieldValue.delete(),
      phone:       FieldValue.delete(),
      avatar:      FieldValue.delete(),
      address:     FieldValue.delete(),
      dateOfBirth: FieldValue.delete(),
      firstName:   "Deleted",
      lastName:    "User",
      displayName: "Deleted User",
    });

    await batch.commit();

    return NextResponse.json(
      { message: "Account deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] /api/patient/delete error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
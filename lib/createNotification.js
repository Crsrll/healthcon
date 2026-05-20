// lib/createNotification.js
// ─────────────────────────────────────────────────────────────
// Central helper — call this from any API route to create a
// notification document in Firestore.
//
// Notification types:
//   "booking_requested"   → clinic receives this
//   "booking_confirmed"   → patient receives this
//   "booking_rejected"    → patient receives this
//   "appointment_reminder"→ patient receives this
//   "new_rating"          → clinic receives this
//
// Each notification document lives at:
//   /notifications/{recipientUID}/items/{auto-id}
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * @param {object} opts
 * @param {string} opts.recipientID   - UID of the user who receives it
 * @param {"booking_requested"|"booking_confirmed"|"booking_rejected"|"appointment_reminder"|"new_rating"} opts.type
 * @param {string} opts.title         - Short heading
 * @param {string} opts.body          - One-line description
 * @param {string} [opts.linkTo]      - Optional client-side route to navigate to on click
 * @param {object} [opts.meta]        - Any extra fields (bookingID, clinicID, etc.)
 */
export async function createNotification({ recipientID, type, title, body, linkTo = null, meta = {} }) {
  if (!recipientID) throw new Error("createNotification: recipientID is required");

  await addDoc(collection(db, "notifications", recipientID, "items"), {
    type,
    title,
    body,
    linkTo,
    meta,
    read: false,
    createdAt: serverTimestamp(),
  });
}
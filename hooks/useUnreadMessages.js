// hooks/useUnreadMessages.js
// Listens in real-time to unread inquiry counts for the logged-in user.
// Works for both patients (unreadByPatient) and clinics (unreadByClinic).

"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function useUnreadMessages(uid, role) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!uid || !role) return;

    const field      = role === "clinic" ? "clinicID" : "patientID";
    const unreadFlag = role === "clinic" ? "unreadByClinic" : "unreadByPatient";

    const q = query(
      collection(db, "inquiries"),
      where(field,      "==", uid),
      where(unreadFlag, "==", true)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setUnreadCount(snap.size);
    });

    return () => unsubscribe();
  }, [uid, role]);

  return unreadCount;
}
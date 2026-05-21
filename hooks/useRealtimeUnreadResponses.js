import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useRealtimeUnreadResponses(patientId) {
  const [unreadReportIds, setUnreadReportIds] = useState(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    // Query all clinicReplies where patientID matches and unreadByPatient is true
    const q = query(
      collection(db, "clinicReplies"),
      where("patientID", "==", patientId),
      where("unreadByPatient", "==", true)
    );

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const unreadIds = new Set();
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.reportId) {
            unreadIds.add(data.reportId);
          }
        });
        setUnreadReportIds(unreadIds);
        setUnreadCount(unreadIds.size);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching unread responses:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [patientId]);

  return { unreadReportIds, unreadCount, loading };
}
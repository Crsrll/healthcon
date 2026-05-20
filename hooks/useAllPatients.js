import { useState, useEffect, useCallback } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createSystemLog, LOG_ACTIONS } from "@/lib/logHelper";

export function useAllPatients(user) {  // Add user parameter
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // Real-time listener for patients only
    const q = query(collection(db, "users"), where("role", "==", "patient"));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const patients = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(patients);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, []);

  const updatePatientStatus = useCallback(async (userId, action, userName) => {
    try {
      const res = await fetch("/api/patients/getAllPatients", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, action }),
      });

      const json = await res.json();

      if (res.ok) {
        // Create system log based on action
        if (action === "suspend") {
          await createSystemLog(
            user,
            LOG_ACTIONS.SUSPEND_USER,
            "user",
            userId,
            `Suspended patient: ${userName || userId}`
          );
        } else if (action === "reinstate") {
          await createSystemLog(
            user,
            LOG_ACTIONS.REINSTATE_USER,
            "user",
            userId,
            `Reinstated patient: ${userName || userId}`
          );
        }
        
        return { success: true, message: json.message };
      } else {
        return { success: false, error: json.error };
      }
    } catch (err) {
      console.error("Error updating patient status:", err);
      return { success: false, error: err.message };
    }
  }, [user]);

  const suspendUser = useCallback(
    (userId, userName) => updatePatientStatus(userId, "suspend", userName),
    [updatePatientStatus]
  );

  const reinstateUser = useCallback(
    (userId, userName) => updatePatientStatus(userId, "reinstate", userName),
    [updatePatientStatus]
  );

  return {
    users,
    loading,
    error,
    suspendUser,
    reinstateUser,
  };
}
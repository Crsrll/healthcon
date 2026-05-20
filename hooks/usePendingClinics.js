import { useState, useEffect, useCallback } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createSystemLog, LOG_ACTIONS } from "@/lib/logHelper";

export function usePendingClinics(user) {  // Add user parameter
  const [pendingClinics, setPendingClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time snapshot listener
  useEffect(() => {
    setLoading(true);

    const q = query(collection(db, "users"), where("role", "==", "clinic"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allClinics = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter for pending clinics (not approved and not suspended)
        const pending = allClinics.filter((c) => c.approved === false);
        setPendingClinics(pending);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      },
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const updateClinicStatus = useCallback(async (clinicId, action, clinicName) => {
    try {
      const res = await fetch("/api/clinics/updateClinicStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clinicId, action }),
      });

      const json = await res.json();

      if (res.ok) {
        // Create system log based on action
        if (action === "approve") {
          await createSystemLog(
            user,
            LOG_ACTIONS.APPROVE_CLINIC,
            "clinic",
            clinicId,
            `Approved clinic: ${clinicName || clinicId}`
          );
        } else if (action === "reject") {
          await createSystemLog(
            user,
            LOG_ACTIONS.REJECT_CLINIC,
            "clinic",
            clinicId,
            `Rejected clinic: ${clinicName || clinicId}`
          );
        } else if (action === "suspend") {
          await createSystemLog(
            user,
            LOG_ACTIONS.SUSPEND_CLINIC,
            "clinic",
            clinicId,
            `Suspended clinic: ${clinicName || clinicId}`
          );
        } else if (action === "reinstate") {
          await createSystemLog(
            user,
            LOG_ACTIONS.REINSTATE_CLINIC,
            "clinic",
            clinicId,
            `Reinstated clinic: ${clinicName || clinicId}`
          );
        }
        
        return { success: true, message: json.message };
      } else {
        return { success: false, error: json.error };
      }
    } catch (err) {
      console.error("Error updating clinic status:", err);
      return { success: false, error: err.message };
    }
  }, [user]);

  const approveClinic = useCallback(
    (clinicId, clinicName) => {
      return updateClinicStatus(clinicId, "approve", clinicName);
    },
    [updateClinicStatus],
  );

  const rejectClinic = useCallback(
    (clinicId, clinicName) => {
      return updateClinicStatus(clinicId, "reject", clinicName);
    },
    [updateClinicStatus],
  );

  const suspendClinic = useCallback(
    (clinicId, clinicName) => {
      return updateClinicStatus(clinicId, "suspend", clinicName);
    },
    [updateClinicStatus],
  );

  const reinstateClinic = useCallback(
    (clinicId, clinicName) => {
      return updateClinicStatus(clinicId, "reinstate", clinicName);
    },
    [updateClinicStatus],
  );

  return {
    pendingClinics,
    loading,
    error,
    approveClinic,
    rejectClinic,
    suspendClinic,
    reinstateClinic,
  };
}
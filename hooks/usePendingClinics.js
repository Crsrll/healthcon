import { useState, useEffect, useCallback } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function usePendingClinics() {
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

  const updateClinicStatus = useCallback(async (clinicId, action) => {
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
        // No need to manually filter - onSnapshot will update automatically
        return { success: true, message: json.message };
      } else {
        return { success: false, error: json.error };
      }
    } catch (err) {
      console.error("Error updating clinic status:", err);
      return { success: false, error: err.message };
    }
  }, []);

  const approveClinic = useCallback(
    (clinicId) => {
      return updateClinicStatus(clinicId, "approve");
    },
    [updateClinicStatus],
  );

  const rejectClinic = useCallback(
    (clinicId) => {
      return updateClinicStatus(clinicId, "reject");
    },
    [updateClinicStatus],
  );

  const suspendClinic = useCallback(
    (clinicId) => {
      return updateClinicStatus(clinicId, "suspend");
    },
    [updateClinicStatus],
  );

  const reinstateClinic = useCallback(
    (clinicId) => {
      return updateClinicStatus(clinicId, "reinstate");
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

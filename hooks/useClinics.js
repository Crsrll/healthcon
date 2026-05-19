import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useClinics(filter = "all") {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const q = query(collection(db, "users"), where("role", "==", "clinic"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let allClinics = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Apply filter
        if (filter === "approved") {
          allClinics = allClinics.filter(
            (c) => c.approved === true && c.suspended !== true,
          );
        } else if (filter === "pending") {
          allClinics = allClinics.filter((c) => c.approved === false);
        } else if (filter === "suspended") {
          allClinics = allClinics.filter((c) => c.suspended === true);
        }

        setClinics(allClinics);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [filter]);

  return { clinics, loading, error };
}

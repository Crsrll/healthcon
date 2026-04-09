import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export function useClinics() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "clinic"),
          where("approved", "==", true)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClinics(data);
      } catch (err) {
        console.error("Error fetching clinics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  return { clinics, loading };
}
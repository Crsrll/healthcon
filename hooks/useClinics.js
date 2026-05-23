// hooks/useClinics.js
// Fetches all clinics from the "users" collection with role === "clinic".
// Filters out inactive and deleted clinics from patient-facing views.

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useClinics(filter = "all") {
  const [clinics, setClinics]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

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

        if (filter === "approved") {
          // Patient-facing: hide inactive AND deleted clinics
          allClinics = allClinics.filter(
            (c) =>
              c.approved === true &&
              c.suspended !== true &&
              c.status !== "inactive" &&
              c.status !== "deleted",
          );
        } else if (filter === "pending") {
          allClinics = allClinics.filter((c) => c.approved === false);
        } else if (filter === "suspended") {
          allClinics = allClinics.filter((c) => c.suspended === true);
        }
        // "all" → no status filter (used by admin dashboard to see everything)

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


// ─────────────────────────────────────────────────────────────────────────────
// hooks/useClinic.js
// Fetches a single clinic by ID and exposes status flags for the UI.
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CLINIC = {
  clinicName: "",
  city:       "",
  address:    "",
  specialty:  [],
  image:      "",
  about:      "",
  hours:      [],
  contact:    "",
  email:      "",
  services:   [],
  amenities:  [],
  status:     "active",
};

export function useClinic(clinicID) {
  const [clinic, setClinic]   = useState(DEFAULT_CLINIC);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clinicID) return;

    const fetchClinic = async () => {
      try {
        setLoading(true);

        const res  = await fetch(`/api/clinics/${clinicID}`);
        const json = await res.json();

        if (!res.ok) {
          setClinic(null);
          return;
        }

        const data = json.data;

        setClinic({
          ...DEFAULT_CLINIC,
          ...data,

          // Arrays — always default to []
          specialty: data.specialty ?? [],
          services:  data.services  ?? [],
          amenities: data.amenities ?? [],

          // Strings — fallback to "To be added"
          clinicName: data.clinicName || "To be added",
          city:       data.city       || "To be added",
          address:    data.address    || "To be added",
          about:      data.about      || "To be added",
          hours:      data.hours      || [],
          contact:    data.contact    || "To be added",
          email:      data.email      || "To be added",

          // Status — used by UI to show unavailable / deleted screens
          status: data.status || "active",
        });
      } catch (err) {
        console.error(err);
        setClinic(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClinic();
  }, [clinicID]);

  // Convenience flags consumed by the clinic profile page
  const isInactive = clinic?.status === "inactive";
  const isDeleted  = clinic?.status === "deleted";
  const isUnavailable = isInactive || isDeleted;

  return { clinic, loading, isInactive, isDeleted, isUnavailable };
}
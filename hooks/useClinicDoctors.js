import { useState, useEffect, useCallback } from "react";

export function useClinicDoctors(clinicID) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = useCallback(async () => {
    if (!clinicID) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/doctors?clinicID=${clinicID}`);
      const json = await res.json();
      if (json.success) {
        setDoctors(json.data);
      } else {
        setError(json.error || "Failed to fetch doctors");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clinicID]);

  const saveDoctor = useCallback(
    async (payload) => {
      try {
        const res = await fetch("/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, clinicID }),
        });
        if (res.ok) {
          await fetchDoctors();
          return { success: true };
        }
        const json = await res.json();
        return { success: false, error: json.error };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [clinicID, fetchDoctors]
  );

  // ✅ Wrapped in useCallback to match the rest of the hook
  const deleteDoctor = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/doctors?id=${id}`, { method: "DELETE" });
        const json = await res.json();
        if (!res.ok) return { success: false, error: json.error };
        setDoctors((prev) => prev.filter((d) => d.id !== id));
        return { success: true };
      } catch (err) {
        console.error("Delete error:", err);
        return { success: false, error: err.message };
      }
    },
    [] // no dependencies — only uses setDoctors which is stable
  );

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return { doctors, loading, error, refreshDoctors: fetchDoctors, saveDoctor, deleteDoctor };
}
import { useState, useEffect } from "react";

export function useClinics() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await fetch("/api/clinics/getClinics");
        const json = await res.json();

        if (res.ok) {
          setClinics(json.data);
        } else {
          console.error("Failed to fetch clinics:", json.error);
        }
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
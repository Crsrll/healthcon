import { useState, useEffect } from "react";

export function useClinics(filter = "all") {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await fetch("/api/clinics/getClinics");
        const json = await res.json();

        if (res.ok) {
          let data = json.data;

          if (filter === "approved") {
            data = data.filter((c) => c.approved === true);
          } else if (filter === "pending") {
            data = data.filter((c) => c.approved === false);
          }

          setClinics(data);
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
  }, [filter]);

  return { clinics, loading };
}

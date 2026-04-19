import { useState, useEffect } from "react";

export function useDoctors(clinicID = null) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
       if (!clinicID) {
      setLoading(false);
      return; 
    }
    
    const fetchDoctors = async () => {
      setLoading(true);

      let url = "/api/doctors/getDoctors";

      if (clinicID) {
        url += `?clinicID=${clinicID}`;
      }

      try {
        const res = await fetch(url);
        const json = await res.json();

        if (!res.ok) {
          console.error("Request failed:", json);
          setDoctors([]);
          return;
        }

        console.log('doctors API raw response:', JSON.stringify(json));

        setDoctors(json.data || json || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors(); 

  }, [clinicID]);

  return { doctors, loading };
}
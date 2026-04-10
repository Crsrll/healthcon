import { useState, useEffect } from "react";

export function useDoctors(clinicID) {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (!clinicID) return;

    const fetchDoctors = async () => {
      const res = await fetch(`/api/doctors/getDoctors?clinicID=${clinicID}`);
      const json = await res.json();

      if (res.ok) {
        setDoctors(json.data);
      }
    };

    fetchDoctors();
  }, [clinicID]);

  return doctors;
}
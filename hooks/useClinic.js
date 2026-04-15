import { useState, useEffect } from "react";

const DEFAULT_CLINIC = {
  clinicclinicName: "",
  city: "",
  address: "",
  specialty: [],
  image: "",
  about: "",
  hours: "",
  contact: "",
  email: "",
  services: [],
  amenities: [],
};

export function useClinic(clinicID) {
  const [clinic, setClinic] = useState(DEFAULT_CLINIC);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clinicID) return;

    const fetchClinic = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/clinics/${clinicID}`);
        const json = await res.json();

        if (!res.ok) {
          setClinic(null);
          return;
        }

        const data = json.data;

        // FIX: normalize missing Firestore fields
        setClinic({
          ...DEFAULT_CLINIC,
          ...data,
        
          // Arrays
          specialty: data.specialty ?? [],
          services: data.services ?? [],
          amenities: data.amenities ?? [],
        
          // Strings (fallback to "To be added")
          clinicName: data.clinicName || "To be added",
          city: data.city || "To be added",
          address: data.address || "To be added",
          about: data.about || "To be added",
          hours: data.hours || [],
          contact: data.contact || "To be added",
          email: data.email || "To be added",
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

  return { clinic, loading };
}
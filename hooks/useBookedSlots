// hooks/useBookedSlots.js
import { useEffect, useState } from 'react';

export function useBookedSlots(clinicID, doctorID, date) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clinicID || !doctorID || !date) return;

    setLoading(true);
    setBookedSlots([]);

    fetch(`/api/bookings?clinicID=${clinicID}&doctorID=${doctorID}&date=${date}`)
      .then(res => res.json())
      .then(data => {
        setBookedSlots(data.bookedTimes ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [clinicID, doctorID, date]);

  return { bookedSlots, loading };
}
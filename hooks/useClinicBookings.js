import { useState, useEffect, useCallback } from "react";

export function useClinicBookings(clinicID) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!clinicID) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/history?clinicID=${clinicID}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
      } else {
        setError(json.error || "Failed to fetch bookings");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clinicID]);

  const updateBookingStatus = useCallback(
    async (bookingId, status) => {
      try {
        const res = await fetch("/api/bookings/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, status }),
        });
        if (res.ok) {
          setBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
          );
          return { success: true };
        }
        return { success: false };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    []
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refreshBookings: fetchBookings, updateBookingStatus };
}

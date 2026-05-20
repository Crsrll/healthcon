import { useState, useEffect, useCallback } from "react";

export function useAllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings/getAllBookings");
      const json = await res.json();

      if (res.ok) {
        setBookings(json.data);
        setError(null);
      } else {
        setError(json.error || "Failed to fetch bookings");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refreshBookings: fetchBookings };
}
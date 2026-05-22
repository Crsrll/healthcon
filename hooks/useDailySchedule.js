import { useState, useEffect, useCallback } from "react";

export function useDailySchedule(clinicID) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toLocaleDateString("en-CA");

  const fetchSchedule = useCallback(async () => {
    if (!clinicID) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/bookings/daily?clinicID=${clinicID}&date=${today}`
      );
      const json = await res.json();
      if (json.success) {
        setSchedule(json.data);
      } else {
        setError(json.error || "Failed to fetch schedule");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clinicID, today]);

  const updateStatus = useCallback(async (bookingId, newStatus) => {
    try {
      const res = await fetch("/api/bookings/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      if (res.ok) {
        setSchedule((prev) =>
          prev.map((item) =>
            item.id === bookingId ? { ...item, status: newStatus } : item
          )
        );
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return { schedule, loading, error, refreshSchedule: fetchSchedule, updateStatus };
}

import { useState, useEffect, useCallback } from "react";

export function usePendingRequests(clinicID) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    if (!clinicID) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/manage?clinicID=${clinicID}`);
      const json = await res.json();
      if (json.success) {
        setRequests(json.data);
      } else {
        setError(json.error || "Failed to load requests");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clinicID]);

  const handleAction = useCallback(async (bookingId, action) => {
    const newStatus = action === "approve" ? "confirmed" : "rejected";
    try {
      const res = await fetch("/api/bookings/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((req) => req.id !== bookingId));
        return { success: true, status: newStatus };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, refreshRequests: fetchRequests, handleAction };
}

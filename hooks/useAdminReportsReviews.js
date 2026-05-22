import { useState, useEffect, useCallback } from "react";

export function useAdminReportsReviews() {
  const [reports, setReports] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reports-reviews");
      const json = await res.json();
      if (res.ok) {
        setReports(json.reports || []);
        setReviews(json.reviews || []);
        setError(null);
      } else {
        setError(json.error || "Failed to fetch");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (id, collectionName, status, adminNotes = "") => {
      try {
        const res = await fetch("/api/admin/reports-reviews", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, collectionName, status, adminNotes }),
        });
        const json = await res.json();
        if (res.ok) {
          await fetchAll();
          return { success: true };
        }
        return { success: false, error: json.error };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [fetchAll]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { reports, reviews, loading, error, fetchAll, updateStatus };
}

import { useState, useEffect, useCallback } from "react";

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async (status = "All") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reports?status=${status}`);
      const json = await res.json();
      
      if (res.ok) {
        setReports(json.data);
        setError(null);
      } else {
        setError(json.error || "Failed to fetch reports");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateReportStatus = useCallback(async (reportId, status, reviewedNotes = "") => {
    try {
      const res = await fetch("/api/reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status, reviewedNotes }),
      });
      const json = await res.json();
      
      if (res.ok) {
        await fetchReports();
        return { success: true };
      }
      return { success: false, error: json.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchReports]);
  
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);
  
  return { reports, loading, error, fetchReports, updateReportStatus };
}
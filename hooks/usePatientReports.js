import { useState, useEffect, useCallback } from "react";

export function usePatientReports(patientID) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    if (!patientID) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports/to-clinic?reporterID=${patientID}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.reports || []);
      } else {
        setError(data.error || "Failed to fetch reports");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientID]);

  const fetchMessages = useCallback(async (replyId) => {
    try {
      const res = await fetch(`/api/clinic-replies?replyId=${replyId}`);
      const data = await res.json();
      return data.success ? data.messages || [] : [];
    } catch {
      return [];
    }
  }, []);

  const getReplyThread = useCallback(async (reportId) => {
    try {
      const res = await fetch(`/api/clinic-replies?reportId=${reportId}`);
      const data = await res.json();
      return data.success ? data : null;
    } catch {
      return null;
    }
  }, []);

  const sendReply = useCallback(async ({ replyId, text, sender }) => {
    try {
      const res = await fetch("/api/clinic-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId, text, sender }),
      });
      return { success: res.ok };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const markAsRead = useCallback(async (replyId) => {
    try {
      await fetch("/api/clinic-replies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId }),
      });
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    refreshReports: fetchReports,
    fetchMessages,
    getReplyThread,
    sendReply,
    markAsRead,
  };
}

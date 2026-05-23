import { useState, useEffect, useCallback } from "react";

export function usePatientReports(patientID) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial load — sets loading:true so the page spinner shows
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

  // Silent refresh — never touches loading, so open modals stay open
  const refreshReports = useCallback(async () => {
    if (!patientID) return;
    try {
      const res = await fetch(`/api/reports/to-clinic?reporterID=${patientID}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error("Silent refresh failed:", err);
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

  const sendReply = useCallback(async ({
  replyId,
  text,
  sender,
  senderName,
  reportId,
  report,
}) => {
  try {
    let body;

    if (replyId) {
      body = {
        action: "message",
        replyId,
        text,
        sender,
        senderName,
      };
    } else {
      body = {
        action: "create",
        clinicID: report?.clinicID || report?.clinicId,
        clinicName: report?.clinicName,
        patientID: report?.reporterID,
        patientName: report?.reporterName,
        reportId: reportId || report?.id,
        firstMessage: text,
      };
    }

    const res = await fetch("/api/clinic-replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    // Always return replyId from response — used by page to skip getReplyThread
    return { success: res.ok && data.success, data, replyId: data.replyId };
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
    refreshReports,
    fetchMessages,
    getReplyThread,
    sendReply,
    markAsRead,
  };
}
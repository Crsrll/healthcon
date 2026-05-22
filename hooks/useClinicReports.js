import { useState, useEffect, useCallback } from "react";

export function useClinicReports(clinicID) {
  const [reports, setReports] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    if (!clinicID) return;
    try {
      const res = await fetch(`/api/reports/to-clinic?clinicID=${clinicID}`);
      const data = await res.json();
      if (data.success) setReports(data.reports || []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  }, [clinicID]);

  const fetchReviews = useCallback(async () => {
    if (!clinicID) return;
    try {
      // Fetch all reviews for the clinic (pending + approved + rejected)
      const res = await fetch(`/api/reviews?clinicID=${clinicID}&status=all`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  }, [clinicID]);

  const fetchAll = useCallback(async () => {
    if (!clinicID) return;
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchReports(), fetchReviews()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clinicID, fetchReports, fetchReviews]);

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

  const resolveReport = useCallback(
    async (reportId) => {
      try {
        const res = await fetch("/api/reports/to-clinic", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportId, status: "resolved" }),
        });
        const data = await res.json();
        if (data.success) await fetchReports();
        return { success: data.success };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [fetchReports]
  );

  const sendReply = useCallback(
    async ({ reportId, replyId, text, sender, senderName }) => {
      try {
        const res = await fetch("/api/clinic-replies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: replyId ? "message" : "create",
            replyId: replyId || undefined,
            reportId: reportId || undefined,
            text,
            sender,
            senderName,
            // For new thread creation, include clinicID from the report
            clinicID: replyId ? undefined : clinicID,
            firstMessage: replyId ? undefined : text,
          }),
        });
        return { success: res.ok };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [clinicID]
  );

  const moderateReview = useCallback(
    async (reviewId, status) => {
      try {
        const res = await fetch("/api/reviews", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewId, status }),
        });
        const data = await res.json();
        if (data.success) await fetchReviews();
        return { success: data.success };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [fetchReviews]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    reports,
    reviews,
    loading,
    error,
    refreshAll: fetchAll,
    fetchMessages,
    getReplyThread,
    resolveReport,
    sendReply,
    moderateReview,
  };
}

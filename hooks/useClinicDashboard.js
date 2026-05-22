import { useState, useEffect, useCallback } from "react";

export function useClinicDashboard(clinicID) {
  const [stats, setStats] = useState({
    todayTotal: 0,
    pendingCount: 0,
    unreadInquiries: 0,
    completedToday: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const todayDate = new Date().toLocaleDateString("en-CA");

  const fetchDashboardData = useCallback(async () => {
    if (!clinicID) return;
    setLoading(true);
    setError(null);
    try {
      const [sRes, qRes, iRes, uRes] = await Promise.all([
        fetch(`/api/clinics/stats?clinicID=${clinicID}`),
        fetch(`/api/bookings/daily?clinicID=${clinicID}&date=${todayDate}`),
        fetch(`/api/inquiries?clinicID=${clinicID}`),
        fetch(`/api/bookings/upcoming?clinicID=${clinicID}`),
      ]);

      const [sJson, qJson, iJson, uJson] = await Promise.all([
        sRes.json(),
        qRes.json(),
        iRes.json(),
        uRes.json(),
      ]);

      if (sJson.success) setStats(sJson.stats);
      if (qJson.success) setTodayAppointments(qJson.data.slice(0, 10));
      if (iJson.success) setInquiries(iJson.data.slice(0, 3));
      if (uJson.success) setUpcomingAppointments(uJson.data.slice(0, 4));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clinicID, todayDate]);

  const sendInquiryReply = useCallback(
    async ({ inquiryId, text, sender }) => {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, text, sender, clinicID }),
      });
      if (res.ok) await fetchDashboardData();
      return res.ok;
    },
    [clinicID, fetchDashboardData]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    todayAppointments,
    inquiries,
    upcomingAppointments,
    loading,
    error,
    refresh: fetchDashboardData,
    sendInquiryReply,
  };
}

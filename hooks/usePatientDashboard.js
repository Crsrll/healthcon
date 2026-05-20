import { useState, useEffect, useCallback } from "react";

export function usePatientDashboard(userId) {
  const [dashboard, setDashboard] = useState({
    user: null,
    upcomingBookings: [],
    recentNotifications: [],
    stats: {
      totalBookings: 0,
      upcomingBookings: 0,
      completedBookings: 0,
      unreadNotifications: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/patients/dashboard?userId=${userId}`);
      const json = await res.json();

      if (res.ok) {
        setDashboard(json.data);
        setError(null);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refresh: fetchDashboard };
}
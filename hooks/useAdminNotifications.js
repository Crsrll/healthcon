import { useState, useEffect, useCallback } from "react";

export function useAdminNotifications(adminId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!adminId) return;
    
    try {
      const res = await fetch(`/api/admin-notifications?adminId=${adminId}`);
      const json = await res.json();
      
      if (res.ok) {
        setNotifications(json.data);
        setUnreadCount(json.data.filter((n) => !n.read).length);
        setError(null);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  // ONLY FETCH ONCE when component mounts - NO POLLING
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const res = await fetch("/api/admin-notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      
      if (res.ok) {
        // Refresh after marking as read
        await fetchNotifications();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to mark as read:", err);
      return false;
    }
  }, [fetchNotifications]);

  return { notifications, unreadCount, loading, error, markAsRead, refresh: fetchNotifications };
}
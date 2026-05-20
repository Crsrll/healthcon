// hooks/useNotifications.js
// ─────────────────────────────────────────────────────────────
// Polls /api/notifications every 15 seconds.
// Returns:
//   notifications  - array of notification objects
//   unreadCount    - number of unread items
//   markOne(id)    - mark a single notification as read
//   markAll()      - mark all as read
//   loading        - boolean
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

export function useNotifications(uid) {
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!uid) return;
    try {
      const res  = await fetch(`/api/notifications?uid=${uid}`);
      const json = await res.json();
      if (json.success) setNotifications(json.data);
    } catch (e) {
      console.error("useNotifications:", e);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Poll every 15 s
  useEffect(() => {
    if (!uid) return;
    const id = setInterval(fetchNotifications, 10_000);
    return () => clearInterval(id);
  }, [uid, fetchNotifications]);

  const markOne = useCallback(async (notificationId) => {
    // Optimistic
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    await fetch("/api/notifications", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ uid, action: "read_one", notificationId }),
    });
  }, [uid]);

  const markAll = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await fetch("/api/notifications", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ uid, action: "read_all" }),
    });
  }, [uid]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, markOne, markAll, loading };
}
import { useState, useEffect, useCallback } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useAdminNotifications(adminId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) {
      setLoading(false);
      return;
    }

    // Real-time listener for admin notifications
    const q = query(
      collection(db, "adminNotifications"),
      where("adminId", "in", [adminId, "all"]),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.read).length);
        setLoading(false);
      },
      (error) => {
        console.error("Admin notifications listener error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [adminId]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await fetch("/api/admin-notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      return true;
    } catch (err) {
      console.error("Failed to mark as read:", err);
      return false;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch("/api/admin-notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      return true;
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      return false;
    }
  }, []);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
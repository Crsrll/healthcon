import { useCallback } from "react";

export function useInquiryActions() {
  const markAsRead = useCallback(async (inquiryId, role) => {
    try {
      await fetch("/api/inquiries/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, role }),
      });
    } catch (e) {
      console.error("Failed to mark inquiry as read:", e);
    }
  }, []);

  const sendMessage = useCallback(async (action, data) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send message");
      return { success: true, data: json };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, []);

  return { markAsRead, sendMessage };
}

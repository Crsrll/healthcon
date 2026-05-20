export async function createAdminNotification(notification) {
  try {
    const res = await fetch("/api/admin-notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    });
    return await res.json();
  } catch (err) {
    console.error("Failed to create admin notification:", err);
    return { success: false, error: err.message };
  }
}

// Pre-defined notification types for admins
export const ADMIN_NOTIFICATION_TYPES = {
  PENDING_CLINIC: "pending_clinic",
  NEW_REPORT: "new_report",
  ADMIN_ACTION: "admin_action",
  REPORT_RESOLVED: "report_resolved",
  CLINIC_APPROVED: "clinic_approved",
  CLINIC_REJECTED: "clinic_rejected",
  USER_SUSPENDED: "user_suspended",
  USER_REINSTATED: "user_reinstated",
};
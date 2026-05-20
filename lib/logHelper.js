/**
 * Create a system log entry
 * @param {Object} user - The user performing the action
 * @param {string} action - Action type (e.g., "APPROVE_CLINIC", "SUSPEND_USER")
 * @param {string} targetType - Type of target (e.g., "clinic", "user", "doctor", "booking")
 * @param {string} targetId - ID of the target
 * @param {string} details - Human readable description of the action
 * @returns {Promise<Object>} - Result of the log creation
 */
export async function createSystemLog(user, action, targetType, targetId, details) {
  try {
    const res = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.id || "system",
        userEmail: user?.email || "system@healthcon.com",
        userRole: user?.role || "system",
        action,
        targetType,
        targetId,
        details,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("Failed to create system log:", err);
    return { success: false, error: err.message };
  }
}

// Pre-defined action types for consistency
export const LOG_ACTIONS = {
  // Clinic related
  APPROVE_CLINIC: "APPROVE_CLINIC",
  REJECT_CLINIC: "REJECT_CLINIC",
  SUSPEND_CLINIC: "SUSPEND_CLINIC",
  REINSTATE_CLINIC: "REINSTATE_CLINIC",
  
  // User/Patient related
  SUSPEND_USER: "SUSPEND_USER",
  REINSTATE_USER: "REINSTATE_USER",
  
  // Doctor related
  APPROVE_DOCTOR: "APPROVE_DOCTOR",
  SUSPEND_DOCTOR: "SUSPEND_DOCTOR",
  FLAG_DOCTOR: "FLAG_DOCTOR",
  
  // Booking related
  CREATE_BOOKING: "CREATE_BOOKING",
  CONFIRM_BOOKING: "CONFIRM_BOOKING",
  CANCEL_BOOKING: "CANCEL_BOOKING",
  COMPLETE_BOOKING: "COMPLETE_BOOKING",
  
  // Auth related
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  
  // System related
  SYSTEM_SETTINGS_UPDATE: "SYSTEM_SETTINGS_UPDATE",
  DATABASE_BACKUP: "DATABASE_BACKUP",
  SYSTEM_ALERT: "SYSTEM_ALERT",
};
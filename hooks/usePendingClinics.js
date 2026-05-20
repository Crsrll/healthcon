import { useState, useEffect, useCallback } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createSystemLog, LOG_ACTIONS } from "@/lib/logHelper";
import { createAdminNotification, ADMIN_NOTIFICATION_TYPES } from "@/lib/adminNotificationHelper";

export function usePendingClinics(user) {
  const [pendingClinics, setPendingClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time snapshot listener
  useEffect(() => {
    setLoading(true);

    const q = query(collection(db, "users"), where("role", "==", "clinic"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allClinics = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter for pending clinics (not approved and not suspended)
        const pending = allClinics.filter((c) => c.approved === false);
        setPendingClinics(pending);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Check for new pending clinics and send notification (run when pendingClinics changes)
  useEffect(() => {
    if (pendingClinics.length > 0) {
      // Get the most recent pending clinic
      const latestPending = pendingClinics[0];
      if (latestPending && latestPending.createdAt) {
        const createdAt = new Date(latestPending.createdAt);
        const now = new Date();
        const hoursAgo = (now - createdAt) / (1000 * 60 * 60);
        
        // Only send notification if clinic was created in the last hour (new)
        if (hoursAgo < 1) {
          createAdminNotification({
            adminId: "all",
            type: ADMIN_NOTIFICATION_TYPES.PENDING_CLINIC,
            title: "New Clinic Registration",
            body: `${latestPending.clinicName || latestPending.name || "A clinic"} has registered and needs approval`,
            linkTo: "/admin/pending-clinics",
            targetId: latestPending.id,
            targetType: "clinic",
          });
        }
      }
    }
  }, [pendingClinics]);

  const updateClinicStatus = useCallback(async (clinicId, action, clinicName) => {
    try {
      const res = await fetch("/api/clinics/updateClinicStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clinicId, action }),
      });

      const json = await res.json();

      if (res.ok) {
        // Create system log based on action
        if (action === "approve") {
          await createSystemLog(
            user,
            LOG_ACTIONS.APPROVE_CLINIC,
            "clinic",
            clinicId,
            `Approved clinic: ${clinicName || clinicId}`
          );
          // Send admin notification
          await createAdminNotification({
            adminId: "all",
            type: ADMIN_NOTIFICATION_TYPES.CLINIC_APPROVED,
            title: "Clinic Approved",
            body: `${clinicName || clinicId} has been approved and is now live`,
            linkTo: "/admin/clinics",
            targetId: clinicId,
            targetType: "clinic",
          });
        } else if (action === "reject") {
          await createSystemLog(
            user,
            LOG_ACTIONS.REJECT_CLINIC,
            "clinic",
            clinicId,
            `Rejected clinic: ${clinicName || clinicId}`
          );
          await createAdminNotification({
            adminId: "all",
            type: ADMIN_NOTIFICATION_TYPES.CLINIC_REJECTED,
            title: "Clinic Rejected",
            body: `${clinicName || clinicId} has been rejected`,
            linkTo: "/admin/pending-clinics",
            targetId: clinicId,
            targetType: "clinic",
          });
        } else if (action === "suspend") {
          await createSystemLog(
            user,
            LOG_ACTIONS.SUSPEND_CLINIC,
            "clinic",
            clinicId,
            `Suspended clinic: ${clinicName || clinicId}`
          );
          await createAdminNotification({
            adminId: "all",
            type: ADMIN_NOTIFICATION_TYPES.ADMIN_ACTION,
            title: "Clinic Suspended",
            body: `${clinicName || clinicId} has been suspended by ${user?.email?.split('@')[0] || "Admin"}`,
            linkTo: "/admin/clinics",
            targetId: clinicId,
            targetType: "clinic",
          });
        } else if (action === "reinstate") {
          await createSystemLog(
            user,
            LOG_ACTIONS.REINSTATE_CLINIC,
            "clinic",
            clinicId,
            `Reinstated clinic: ${clinicName || clinicId}`
          );
          await createAdminNotification({
            adminId: "all",
            type: ADMIN_NOTIFICATION_TYPES.CLINIC_APPROVED,
            title: "Clinic Reinstated",
            body: `${clinicName || clinicId} has been reinstated`,
            linkTo: "/admin/clinics",
            targetId: clinicId,
            targetType: "clinic",
          });
        }
        
        return { success: true, message: json.message };
      } else {
        return { success: false, error: json.error };
      }
    } catch (err) {
      console.error("Error updating clinic status:", err);
      return { success: false, error: err.message };
    }
  }, [user]);

  const approveClinic = useCallback(
    (clinicId, clinicName) => {
      return updateClinicStatus(clinicId, "approve", clinicName);
    },
    [updateClinicStatus],
  );

  const rejectClinic = useCallback(
    (clinicId, clinicName) => {
      return updateClinicStatus(clinicId, "reject", clinicName);
    },
    [updateClinicStatus],
  );

  const suspendClinic = useCallback(
    (clinicId, clinicName) => {
      return updateClinicStatus(clinicId, "suspend", clinicName);
    },
    [updateClinicStatus],
  );

  const reinstateClinic = useCallback(
    (clinicId, clinicName) => {
      return updateClinicStatus(clinicId, "reinstate", clinicName);
    },
    [updateClinicStatus],
  );

  return {
    pendingClinics,
    loading,
    error,
    approveClinic,
    rejectClinic,
    suspendClinic,
    reinstateClinic,
  };
}
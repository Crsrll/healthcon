import { useState, useEffect, useCallback } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createSystemLog, LOG_ACTIONS } from "@/lib/logHelper";
import { createAdminNotification, ADMIN_NOTIFICATION_TYPES } from "@/lib/adminNotificationHelper";

export function useAllPatients(user) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    const q = query(collection(db, "users"), where("role", "==", "patient"));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const patients = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(patients);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, []);

  const updatePatientStatus = useCallback(async (userId, action, userName) => {
    try {
      const res = await fetch("/api/patients/getAllPatients", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, action }),
      });

      const json = await res.json();

      if (res.ok) {
        if (action === "suspend") {
          await createSystemLog(
            user,
            LOG_ACTIONS.SUSPEND_USER,
            "user",
            userId,
            `Suspended patient: ${userName || userId}`
          );
          await createAdminNotification({
            adminId: "all",
            type: ADMIN_NOTIFICATION_TYPES.USER_SUSPENDED,
            title: "User Suspended",
            body: `${userName || userId} has been suspended by ${user?.email?.split('@')[0] || "Admin"}`,
            linkTo: "/admin/users",
            targetId: userId,
            targetType: "user",
          });
        } else if (action === "reinstate") {
          await createSystemLog(
            user,
            LOG_ACTIONS.REINSTATE_USER,
            "user",
            userId,
            `Reinstated patient: ${userName || userId}`
          );
          await createAdminNotification({
            adminId: "all",
            type: ADMIN_NOTIFICATION_TYPES.USER_REINSTATED,
            title: "User Reinstated",
            body: `${userName || userId} has been reinstated by ${user?.email?.split('@')[0] || "Admin"}`,
            linkTo: "/admin/users",
            targetId: userId,
            targetType: "user",
          });
        }
        
        return { success: true, message: json.message };
      } else {
        return { success: false, error: json.error };
      }
    } catch (err) {
      console.error("Error updating patient status:", err);
      return { success: false, error: err.message };
    }
  }, [user]);

  const suspendUser = useCallback(
    (userId, userName) => updatePatientStatus(userId, "suspend", userName),
    [updatePatientStatus]
  );

  const reinstateUser = useCallback(
    (userId, userName) => updatePatientStatus(userId, "reinstate", userName),
    [updatePatientStatus]
  );

  return {
    users,
    loading,
    error,
    suspendUser,
    reinstateUser,
  };
}
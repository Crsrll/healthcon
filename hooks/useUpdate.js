import { useState } from "react";
import { useAuth } from "@/context/authContext";

export function useUser() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const updateUser = async (data) => {
    try {
      setSaving(true);

      const res = await fetch("/api/user/updateUser", {
        method: "PATCH", // ✅ correct method
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ uid: user.uid, ...data }),
      });

      if (!res.ok) throw new Error("Failed to save");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return { updateUser, saving, error };
}
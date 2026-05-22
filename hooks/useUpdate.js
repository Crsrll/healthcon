// hooks/useUpdate.js
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import Cookies from "js-cookie";

export function useUser() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { user, setUser } = useAuth(); // Make sure setUser is exposed

  const updateUser = async (data) => {
    if (!user?.uid) {
      setError("No user logged in");
      return;
    }
    
    try {
      setSaving(true);
      setError(null);

      const res = await fetch("/api/user/updateUser", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, ...data }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }
      
      // ✅ CRITICAL: Update the user in context and storage
      const updatedUser = { ...user, ...data };
      
      // Update context state
      if (setUser) {
        setUser(updatedUser);
      }
      
      // Update localStorage and cookies
      localStorage.setItem("hc_user", JSON.stringify(updatedUser));
      Cookies.set("hc_user", JSON.stringify(updatedUser));
      
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { updateUser, saving, error };
}
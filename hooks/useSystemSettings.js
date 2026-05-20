import { useState, useEffect, useCallback } from "react";

export function useSystemSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      const json = await res.json();
      
      if (res.ok) {
        setSettings(json.data);
        setError(null);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      
      const json = await res.json();
      
      if (res.ok) {
        setSettings(newSettings);
        return { success: true };
      }
      return { success: false, error: json.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const resetSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings", { method: "DELETE" });
      const json = await res.json();
      
      if (res.ok) {
        setSettings(json.data);
        return { success: true };
      }
      return { success: false, error: json.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { 
    settings, 
    loading, 
    error, 
    updateSettings, 
    resetSettings, 
    refreshSettings: fetchSettings 
  };
}
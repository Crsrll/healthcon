import { useState, useEffect, useCallback } from "react";

export function useSystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      let url = "/api/logs";
      const params = new URLSearchParams();

      if (filters.limit) params.append("limit", filters.limit);
      if (filters.action) params.append("action", filters.action);
      if (filters.userId) params.append("userId", filters.userId);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (res.ok) {
        setLogs(json.data);
        setError(null);
      } else {
        setError(json.error || "Failed to fetch logs");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createLog = useCallback(async (logData) => {
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      });
      const json = await res.json();

      if (res.ok) {
        return { success: true, data: json.data };
      } else {
        return { success: false, error: json.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const clearOldLogs = useCallback(async (days = 30) => {
    try {
      const res = await fetch(`/api/logs?days=${days}`, { method: "DELETE" });
      const json = await res.json();
      
      if (res.ok) {
        await fetchLogs(); // Refresh logs
        return { success: true, message: json.message };
      } else {
        return { success: false, error: json.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchLogs]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { 
    logs, 
    loading, 
    error, 
    fetchLogs, 
    createLog, 
    clearOldLogs 
  };
}
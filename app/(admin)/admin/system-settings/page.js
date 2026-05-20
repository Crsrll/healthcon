"use client";
import { useState, useEffect } from "react";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useAuth } from "@/context/authContext";
import { createSystemLog, LOG_ACTIONS } from "@/lib/logHelper";

function Toggle({ value, onChange }) {
  return (
    <button 
      onClick={() => onChange(!value)}
      type="button"
      className={`w-11 h-6 rounded-full relative transition-colors shrink-0
                  ${value ? 'bg-teal-500' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow
                       transition-all ${value ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

export default function SystemSettingsPage() {
  const { user } = useAuth();
  const { settings, loading, updateSettings, resetSettings } = useSystemSettings();
  
  // Local state for form values
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [maxBookings, setMaxBookings] = useState("20");
  const [commissionPct, setCommission] = useState("5");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync local state with settings from hook
  useEffect(() => {
    if (settings) {
      setEmailNotifs(settings.emailNotifs ?? true);
      setAutoApprove(settings.autoApprove ?? false);
      setMaintenance(settings.maintenance ?? false);
      setMaxBookings(settings.maxBookings?.toString() ?? "20");
      setCommission(settings.commissionPct?.toString() ?? "5");
    }
  }, [settings]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const handleSaveSettings = async () => {
    setSaving(true);
    
    const newSettings = {
      emailNotifs,
      autoApprove,
      maintenance,
      maxBookings: parseInt(maxBookings),
      commissionPct: parseFloat(commissionPct),
      updatedAt: new Date().toISOString(),
      updatedBy: user?.email || "admin",
    };

    const result = await updateSettings(newSettings);
    
    if (result.success) {
      // Create system log
      await createSystemLog(
        user,
        LOG_ACTIONS.SYSTEM_SETTINGS_UPDATE,
        "settings",
        "platform",
        `Updated system settings: Email Notifs=${emailNotifs}, Auto Approve=${autoApprove}, Maintenance=${maintenance}, Max Bookings=${maxBookings}, Commission=${commissionPct}%`
      );
      setSaved(true);
    } else {
      alert(`Failed to save settings: ${result.error}`);
    }
    
    setSaving(false);
  };

  const handleClearLogs = async () => {
    if (confirm("Are you sure you want to clear all audit logs? This action cannot be undone.")) {
      try {
        const res = await fetch("/api/logs", { method: "DELETE", body: JSON.stringify({ days: 0 }) });
        if (res.ok) {
          await createSystemLog(
            user,
            LOG_ACTIONS.SYSTEM_SETTINGS_UPDATE,
            "logs",
            "all",
            "Cleared all audit logs"
          );
          alert("Audit logs cleared successfully");
        } else {
          alert("Failed to clear logs");
        }
      } catch (err) {
        console.error("Clear logs error:", err);
        alert("Failed to clear logs");
      }
    }
  };

  const handleResetData = async () => {
    if (confirm("WARNING: This will reset all platform data. This action cannot be undone. Click OK to reset to default settings.")) {
      const result = await resetSettings();
      
      if (result.success) {
        await createSystemLog(
          user,
          LOG_ACTIONS.SYSTEM_SETTINGS_UPDATE,
          "platform",
          "all",
          "Reset platform settings to default"
        );
        alert("Settings reset to default successfully");
      } else {
        alert(`Failed to reset: ${result.error}`);
      }
    }
  };

  if (loading) {
    return (
      <main className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-slate-500 mt-3">Loading settings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6 max-w-full">
      <div>
        <h2 className="text-lg font-bold text-slate-800">System Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">Platform-wide configuration</p>
      </div>

      {/* Success message */}
      {saved && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-center">
          <p className="text-sm text-teal-700 font-semibold">Settings saved successfully!</p>
        </div>
      )}

      {/* General */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          General
        </h3>
        {[
          { label: "Email Notifications", sub: "Send system emails to clinic admins", val: emailNotifs, set: setEmailNotifs },
          { label: "Auto-approve Clinics", sub: "Skip manual review for new registrations — not recommended", val: autoApprove, set: setAutoApprove },
          { label: "Maintenance Mode", sub: "Take platform offline for all users", val: maintenance, set: setMaintenance },
        ].map(item => (
          <div key={item.label}
            className="flex items-center justify-between py-3 border-b border-slate-50
                       last:border-0"
          >
            <div>
              <p className="text-sm font-semibold text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
            </div>
            <Toggle value={item.val} onChange={item.set} />
          </div>
        ))}
      </section>

      {/* Platform config */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Platform Configuration
        </h3>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
            Max Bookings Per Doctor Per Day
          </label>
          <input 
            type="number" 
            value={maxBookings}
            onChange={e => setMaxBookings(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-32
                       outline-none focus:border-teal-400 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
            Platform Commission (%)
          </label>
          <input 
            type="number" 
            value={commissionPct}
            onChange={e => setCommission(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-32
                       outline-none focus:border-teal-400 transition-colors"
            step="0.5"
          />
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">
          Danger Zone
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-red-50">
            <div>
              <p className="text-sm font-semibold text-slate-700">Clear All Audit Logs</p>
              <p className="text-xs text-slate-400">Permanently deletes system logs</p>
            </div>
            <button 
              onClick={handleClearLogs}
              className="text-xs font-bold text-red-500 border border-red-200
                         hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
              Clear Logs
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Reset to Default Settings</p>
              <p className="text-xs text-slate-400">Restore all platform settings to default values</p>
            </div>
            <button 
              onClick={handleResetData}
              className="text-xs font-bold text-red-500 border border-red-200
                         hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
              Reset Settings
            </button>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button 
          onClick={handleSaveSettings}
          disabled={saving}
          className="bg-healthcon-blue hover:bg-blue-900 text-white font-semibold
                     text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50
                     disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </button>
      </div>
    </main>
  );
}
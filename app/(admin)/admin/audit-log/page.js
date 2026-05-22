"use client"
import { Suspense } from "react";;
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, RefreshCw, Loader2 } from "lucide-react";
import { useSystemLogs } from "@/hooks/useSystemLogs";

// Map action to dot color
const getDotColor = (action) => {
  if (action?.includes("CLINIC") || action?.includes("BOOKING")) return "bg-teal-400";
  if (action?.includes("USER") || action?.includes("PATIENT") || action?.includes("LOGIN")) return "bg-blue-400";
  if (action?.includes("ALERT") || action?.includes("ERROR")) return "bg-red-400";
  if (action?.includes("FLAG") || action?.includes("REVIEW")) return "bg-amber-400";
  return "bg-slate-400";
};

// Format action for display
const formatAction = (action) => {
  if (!action) return "Unknown Action";
  return action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

function AuditLogPageInner() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const { logs, loading, error, fetchLogs } = useSystemLogs();
  const [search, setSearch] = useState(urlQuery);
  const [filterAction, setFilterAction] = useState("");

  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    fetchLogs({ action: filterAction });
  }, [fetchLogs, filterAction]);

  // Filter by search
  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.details?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.userEmail?.toLowerCase().includes(q) ||
      log.targetType?.toLowerCase().includes(q)
    );
  });

  // Get unique actions for filter dropdown
  const uniqueActions = [...new Set(logs.map((log) => log.action).filter(Boolean))];

  // Format date
  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Unknown";
    }
  };

  if (loading && logs.length === 0) {
    return (
      <main className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-teal-500 mx-auto mb-3" />
          <p className="text-slate-500">Loading audit logs...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">Audit Log</h2>
          <p className="text-xs text-slate-400 mt-0.5">Recent system activities and changes</p>
        </div>

        {/* Activity Legends */}
        <div className="flex flex-col items-start md:items-end">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Activity Legends
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Clinics & Bookings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">User Activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">System Alerts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Review/Flagged</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">General</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, user, or details..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-teal-400 transition-all"
          />
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setFilterAction("")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all uppercase tracking-tighter
              ${filterAction === "" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            All
          </button>
          {uniqueActions.slice(0, 5).map((action) => (
            <button
              key={action}
              onClick={() => setFilterAction(action)}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all uppercase tracking-tighter
                ${filterAction === action ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              {action.split("_")[0]}
            </button>
          ))}
        </div>
        <button
          onClick={() => fetchLogs({ action: filterAction })}
          className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Table Section */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-10">
                  Status
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Activity / Action
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  User
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Time
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  Target
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className={`w-2 h-2 rounded-full ${getDotColor(log.action)} shadow-sm`}></div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-slate-800">
                        {formatAction(log.action)}
                      </p>
                      {log.details && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{log.details}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {log.userEmail?.split("@")[0] || "System"}
                        </p>
                        <p className="text-[9px] text-slate-400 uppercase">{log.userRole}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500 italic">
                      {formatTime(log.timestamp)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {log.targetType && (
                        <div>
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 uppercase">
                            {log.targetType}
                          </span>
                          {log.targetId && (
                            <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                              {log.targetId.slice(0, 8)}...
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-slate-400 italic text-sm">
                    No audit logs found matching your search.
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-50/50 px-5 py-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
            Showing {filtered.length} of {logs.length} system events
          </p>
        </div>
      </section>
    </main>
  );
}
export default function AuditLogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuditLogPageInner />
    </Suspense>
  );
}

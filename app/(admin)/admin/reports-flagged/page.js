"use client"
import { Suspense } from "react";;
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Flag, AlertTriangle, TrendingUp, Search, Loader2, Eye, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useReports } from "@/hooks/useReports";

const SEV_STYLE = {
  high: "bg-red-50 text-red-600 border border-red-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  low: "bg-slate-100 text-slate-500 border border-slate-200",
};

const TYPE_STYLE = {
  clinic: "bg-blue-50 text-blue-600",
  doctor: "bg-indigo-50 text-indigo-600",
  user: "bg-slate-100 text-slate-600",
};

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-700",
  reviewed: "bg-blue-50 text-blue-600",
  dismissed: "bg-red-50 text-red-600",
  resolved: "bg-green-50 text-green-600",
};

function ReportsFlaggedPageInner() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  
  const { reports, loading, error, updateReportStatus } = useReports();
  const [search, setSearch] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  
  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);
  
  const handleAction = async (reportId, action) => {
    setActionLoading(reportId);
    let status = action;
    let notes = "";
    
    if (action === "review") {
      notes = prompt("Add review notes (optional):");
    }
    
    const result = await updateReportStatus(reportId, action, notes);
    setActionLoading(null);
    
    if (result.success) {
      setSelectedReport(null);
    } else {
      alert(`Failed to ${action}: ${result.error}`);
    }
  };
  
  const filtered = reports.filter(report => {
    const q = search.toLowerCase();
    const matchSearch = 
      report.targetName?.toLowerCase().includes(q) ||
      report.reporterName?.toLowerCase().includes(q) ||
      report.reason?.toLowerCase().includes(q);
    
    const matchTab = activeTab === "All" || report.status === activeTab.toLowerCase();
    
    return matchSearch && matchTab;
  });
  
  const counts = {
    high: reports.filter(r => r.severity === "high").length,
    medium: reports.filter(r => r.severity === "medium").length,
    low: reports.filter(r => r.severity === "low").length,
    pending: reports.filter(r => r.status === "pending").length,
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Unknown";
    }
  };
  
  if (loading) {
    return (
      <main className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-teal-500 mx-auto mb-3" />
          <p className="text-slate-500">Loading reports...</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Reports & Flagged Content</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          User-submitted reports for clinics, doctors, and users
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reports..."
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm
                     outline-none focus:border-teal-400 transition-colors"
        />
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Pending Review", count: counts.pending, icon: <Flag size={18} />, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "High Severity", count: counts.high, icon: <AlertTriangle size={18} />, color: "text-red-500", bg: "bg-red-50" },
          { label: "Medium Severity", count: counts.medium, icon: <Flag size={18} />, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Low Severity", count: counts.low, icon: <TrendingUp size={18} />, color: "text-slate-500", bg: "bg-slate-100" },
        ].map(s => (
          <div key={s.label}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>
      
      {/* Status Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
        {["All", "Pending", "Reviewed", "Dismissed", "Resolved"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
                        ${activeTab === t
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-400 hover:text-slate-600'}`}>
            {t}
          </button>
        ))}
      </div>
      
      {/* Reports Table */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Type", "Reported Item", "Reporter", "Reason", "Reported", "Severity", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold rounded-full px-2.5 py-1
                                        ${TYPE_STYLE[report.targetType] || "bg-slate-100 text-slate-600"}`}>
                        {report.targetType}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-sm text-slate-800">
                      {report.targetName}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {report.reporterName}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 max-w-[200px] truncate">
                      {report.reason}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${SEV_STYLE[report.severity]}`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${STATUS_STYLE[report.status]}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        {report.status === "pending" && (
                          <>
                            <button 
                              onClick={() => handleAction(report.id, "reviewed")}
                              disabled={actionLoading === report.id}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Mark Reviewed"
                            >
                              <MessageSquare size={14} />
                            </button>
                            <button 
                              onClick={() => handleAction(report.id, "resolved")}
                              disabled={actionLoading === report.id}
                              className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Resolve"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button 
                              onClick={() => handleAction(report.id, "dismissed")}
                              disabled={actionLoading === report.id}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Dismiss"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-slate-400 italic text-sm">
                    No reports found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">Report Details</h3>
              <button onClick={() => setSelectedReport(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Reported Item</p>
                  <p className="font-semibold text-slate-800">{selectedReport.targetName}</p>
                  <p className="text-xs text-slate-500 capitalize">{selectedReport.targetType}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Reported By</p>
                  <p className="font-semibold text-slate-800">{selectedReport.reporterName}</p>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Reason</p>
                <p className="text-sm text-slate-700">{selectedReport.reason}</p>
              </div>
              
              {selectedReport.description && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Description</p>
                  <p className="text-sm text-slate-600">{selectedReport.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Severity</p>
                  <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${SEV_STYLE[selectedReport.severity]}`}>
                    {selectedReport.severity}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                  <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${STATUS_STYLE[selectedReport.status]}`}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Reported Date</p>
                <p className="text-sm text-slate-600">{new Date(selectedReport.createdAt).toLocaleString()}</p>
              </div>
              
              {selectedReport.reviewedNotes && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Review Notes</p>
                  <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">{selectedReport.reviewedNotes}</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button onClick={() => setSelectedReport(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
export default function ReportsFlaggedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsFlaggedPageInner />
    </Suspense>
  );
}

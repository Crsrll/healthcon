"use client";
import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Flag, Star, Search, Loader2, Eye, CheckCircle,
  XCircle, MessageSquare, X, ChevronDown, ChevronUp,
  AlertTriangle, ThumbsUp
} from "lucide-react";
import { useAdminReportsReviews } from "@/hooks/useAdminReportsReviews";

/* ── Style maps ─────────────────────────────────────── */
const REPORT_STATUS_STYLE = {
  pending:   "bg-amber-50 text-amber-700 border border-amber-200",
  reviewed:  "bg-blue-50 text-blue-600 border border-blue-200",
  resolved:  "bg-green-50 text-green-600 border border-green-200",
  dismissed: "bg-red-50 text-red-500 border border-red-200",
};
const REVIEW_STATUS_STYLE = {
  pending:  "bg-amber-50 text-amber-700 border border-amber-200",
  approved: "bg-green-50 text-green-600 border border-green-200",
  rejected: "bg-red-50 text-red-500 border border-red-200",
};

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
        />
      ))}
    </span>
  );
}

function formatDate(val) {
  if (!val) return "—";
  try { return new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return "—"; }
}

/* ── Detail Modal ───────────────────────────────────── */
function DetailModal({ item, onClose, onAction, actionLoading }) {
  const isReport = item._type === "report";
  const collection = isReport ? "clinicReports" : "reviews";

  const reportActions = [
    { label: "Mark Reviewed", value: "reviewed", icon: <MessageSquare size={14}/>, color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Resolve",       value: "resolved", icon: <CheckCircle size={14}/>,   color: "bg-green-600 hover:bg-green-700" },
    { label: "Dismiss",       value: "dismissed",icon: <XCircle size={14}/>,       color: "bg-red-500 hover:bg-red-600" },
  ];
  const reviewActions = [
    { label: "Approve", value: "approved", icon: <CheckCircle size={14}/>, color: "bg-green-600 hover:bg-green-700" },
    { label: "Reject",  value: "rejected", icon: <XCircle size={14}/>,     color: "bg-red-500 hover:bg-red-600" },
  ];
  const actions = isReport ? reportActions : reviewActions;
  const availableActions = actions.filter(a => a.value !== item.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            {isReport
              ? <Flag size={16} className="text-amber-500"/>
              : <Star size={16} className="text-amber-400 fill-amber-400"/>}
            <h3 className="font-bold text-slate-800">{isReport ? "Report Details" : "Review Details"}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-400"/>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {isReport ? (
            <>
              <Row label="Clinic" value={item.clinicName || "—"} />
              <Row label="Reporter" value={`${item.reporterName || "Anonymous"} ${item.reporterEmail ? `· ${item.reporterEmail}` : ""}`} />
              <Row label="Subject" value={item.subject || "—"} />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Message</p>
                <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 leading-relaxed">{item.message || "—"}</p>
              </div>
              {item.doctorName && <Row label="Doctor" value={item.doctorName} />}
              <Row label="Date" value={formatDate(item.createdAt)} />
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                  <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${REPORT_STATUS_STYLE[item.status] || "bg-slate-100 text-slate-500"}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <Row label="Clinic" value={item.clinicName || "—"} />
              <Row label="Patient" value={item.patientName || "Anonymous"} />
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Rating</p>
                <StarRating rating={item.rating} />
                <span className="text-xs text-slate-500">{item.rating}/5</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Review</p>
                <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 leading-relaxed">{item.review || "—"}</p>
              </div>
              <Row label="Date" value={formatDate(item.createdAt)} />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${REVIEW_STATUS_STYLE[item.status] || "bg-slate-100 text-slate-500"}`}>
                  {item.status}
                </span>
              </div>
            </>
          )}

          {/* Actions */}
          {availableActions.length > 0 && (
            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              {availableActions.map(a => (
                <button
                  key={a.value}
                  onClick={() => onAction(item.id, collection, a.value)}
                  disabled={actionLoading === item.id}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold transition-all ${a.color} disabled:opacity-50`}
                >
                  {actionLoading === item.id ? <Loader2 size={12} className="animate-spin"/> : a.icon}
                  {a.label}
                </button>
              ))}
              <button onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors">
                Close
              </button>
            </div>
          )}
          {availableActions.length === 0 && (
            <div className="pt-3 border-t border-slate-100">
              <button onClick={onClose} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  );
}

/* ── Card for mobile ────────────────────────────────── */
function ItemCard({ item, onView, onAction, actionLoading }) {
  const isReport = item._type === "report";
  const statusStyle = isReport
    ? (REPORT_STATUS_STYLE[item.status] || "bg-slate-100 text-slate-500")
    : (REVIEW_STATUS_STYLE[item.status] || "bg-slate-100 text-slate-500");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {isReport
            ? <span className="bg-amber-50 text-amber-600 rounded-lg p-1.5"><Flag size={14}/></span>
            : <span className="bg-yellow-50 text-yellow-500 rounded-lg p-1.5"><Star size={14} className="fill-yellow-400"/></span>}
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{item.clinicName || "—"}</p>
            <p className="text-[11px] text-slate-400">{isReport ? item.reporterName : item.patientName}</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 shrink-0 ${statusStyle}`}>
          {item.status}
        </span>
      </div>

      {isReport
        ? <p className="text-xs text-slate-600 line-clamp-2">{item.subject || "No subject"}</p>
        : (
          <div className="flex items-center gap-2">
            <StarRating rating={item.rating}/>
            <p className="text-xs text-slate-600 line-clamp-2">{item.review}</p>
          </div>
        )}

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-400">{formatDate(item.createdAt)}</p>
        <button
          onClick={() => onView(item)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          <Eye size={13}/> View
        </button>
      </div>
    </div>
  );
}

/* ── Main inner component ───────────────────────────── */
function ReportsReviewsPageInner() {
  const searchParams = useSearchParams();
  const { reports, reviews, loading, error, updateStatus } = useAdminReportsReviews();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [tab, setTab] = useState("reports"); // "reports" | "reviews"
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (id, collection, status) => {
    setActionLoading(id);
    const result = await updateStatus(id, collection, status);
    setActionLoading(null);
    if (result.success) setSelected(null);
    else alert(`Failed: ${result.error}`);
  };

  const q = search.toLowerCase();

  const filteredReports = reports.filter(r => {
    const matchSearch = !q ||
      r.clinicName?.toLowerCase().includes(q) ||
      r.reporterName?.toLowerCase().includes(q) ||
      r.subject?.toLowerCase().includes(q) ||
      r.message?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredReviews = reviews.filter(r => {
    const matchSearch = !q ||
      r.clinicName?.toLowerCase().includes(q) ||
      r.patientName?.toLowerCase().includes(q) ||
      r.review?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const reportStatusOpts = ["all", "pending", "reviewed", "resolved", "dismissed"];
  const reviewStatusOpts = ["all", "pending", "approved", "rejected"];
  const statusOpts = tab === "reports" ? reportStatusOpts : reviewStatusOpts;

  // Summary counts
  const summary = {
    reports: { total: reports.length, pending: reports.filter(r => r.status === "pending").length },
    reviews: { total: reviews.length, pending: reviews.filter(r => r.status === "pending").length },
  };

  if (loading) {
    return (
      <main className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-teal-500 mx-auto mb-3"/>
          <p className="text-slate-500 text-sm">Loading reports & reviews...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0"/>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </main>
    );
  }

  const activeItems = tab === "reports" ? filteredReports : filteredReviews;

  return (
    <main className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-800">Reports & Reviews</h2>
        <p className="text-xs text-slate-400 mt-0.5">All patient reports and clinic reviews across the platform</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Reports",   count: summary.reports.total,   icon: <Flag size={16}/>,        color: "text-amber-600",  bg: "bg-amber-50" },
          { label: "Pending Reports", count: summary.reports.pending, icon: <AlertTriangle size={16}/>, color: "text-red-500",    bg: "bg-red-50"   },
          { label: "Total Reviews",   count: summary.reviews.total,   icon: <Star size={16}/>,         color: "text-yellow-500", bg: "bg-yellow-50"},
          { label: "Pending Reviews", count: summary.reviews.pending, icon: <ThumbsUp size={16}/>,     color: "text-teal-600",   bg: "bg-teal-50"  },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
            </div>
            <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Controls: tab + search + status filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Tab toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
          {[
            { key: "reports", label: "Reports", icon: <Flag size={13}/> },
            { key: "reviews", label: "Reviews", icon: <Star size={13}/> },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setStatusFilter("all"); }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
                ${tab === t.key ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${tab}...`}
            className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-400 transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="relative w-fit">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-teal-400 transition-colors cursor-pointer"
          >
            {statusOpts.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
        </div>
      </div>

      {/* Mobile cards (hidden on md+) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
        {activeItems.length > 0 ? activeItems.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onView={setSelected}
            onAction={handleAction}
            actionLoading={actionLoading}
          />
        )) : (
          <div className="col-span-2 text-center py-10 text-slate-400 text-sm">No {tab} found.</div>
        )}
      </div>

      {/* Desktop table (hidden below md) */}
      <section className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {tab === "reports"
                  ? ["Clinic", "Reporter", "Subject", "Date", "Status", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))
                  : ["Clinic", "Patient", "Rating", "Review", "Date", "Status", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeItems.length > 0 ? activeItems.map(item => (
                tab === "reports" ? (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-sm text-slate-800 whitespace-nowrap">{item.clinicName || "—"}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{item.reporterName || "Anonymous"}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-[220px] truncate">{item.subject || "—"}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${REPORT_STATUS_STYLE[item.status] || "bg-slate-100 text-slate-500"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View">
                        <Eye size={14}/>
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-sm text-slate-800 whitespace-nowrap">{item.clinicName || "—"}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{item.patientName || "Anonymous"}</td>
                    <td className="px-4 py-3"><StarRating rating={item.rating}/></td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-[220px] truncate">{item.review}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${REVIEW_STATUS_STYLE[item.status] || "bg-slate-100 text-slate-500"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View">
                        <Eye size={14}/>
                      </button>
                    </td>
                  </tr>
                )
              )) : (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-slate-400 italic text-sm">
                    No {tab} found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail Modal */}
      {selected && (
        <DetailModal
          item={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
          actionLoading={actionLoading}
        />
      )}
    </main>
  );
}

export default function ReportsFlaggedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsReviewsPageInner />
    </Suspense>
  );
}

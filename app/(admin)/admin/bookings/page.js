"use client"
import { Suspense } from "react";;
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { useAllBookings } from "@/hooks/useAllBookings";

const STATUS_STYLE = {
  confirmed: "bg-blue-50 text-blue-700",
  pending: "bg-amber-50 text-amber-700",
  Completed: "bg-teal-50 text-teal-700",
  Cancelled: "bg-red-50 text-red-600",
  rejected: "bg-red-50 text-red-700",
};

function BookingsPageInner() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const { bookings, loading, error, refreshBookings } = useAllBookings();
  const [search, setSearch] = useState(urlQuery);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  // Filter by search and tab
  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      b.patientName?.toLowerCase().includes(q) ||
      b.doctorName?.toLowerCase().includes(q) ||
      b.clinicID?.toLowerCase().includes(q) ||
      b.service?.toLowerCase().includes(q);

    const matchTab = tab === "All" || b.status === tab.toLowerCase();

    return matchSearch && matchTab;
  });

  const counts = {
    All: bookings.length,
    Pending: bookings.filter((b) => b.status === "pending").length,
    Confirmed: bookings.filter((b) => b.status === "confirmed").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
    Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    Rejected: bookings.filter((b) => b.status === "Rejected").length,
  };

  // Format date and time
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return "Unknown";
    try {
      const date = new Date(dateStr);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${formattedDate}, ${timeStr || ""}`;
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <main className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-teal-500 mx-auto mb-3" />
          <p className="text-slate-500">Loading bookings...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={refreshBookings}
            className="mt-2 text-sm text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Platform Bookings</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          All bookings across all clinics
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient, doctor, or clinic..."
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm
                     outline-none focus:border-teal-400 transition-colors"
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Pending", count: counts.Pending, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Confirmed", count: counts.Confirmed, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Completed", count: counts.Completed, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Cancelled", count: counts.Cancelled, color: "text-red-500", bg: "bg-red-50" },
          { label: "Rejected", count: counts.Rejected, color: "text-red-500", bg: "bg-red-50" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center
                       justify-between"
          >
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{s.label}</p>
              <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.count}</p>
            </div>

          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
        {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
                        ${
                          tab === t
                            ? "bg-white text-slate-800 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
          >
            {t}
          </button>
        ))}
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Patient", "Doctor", "Clinic", "Date & Time", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-[10px] font-bold text-slate-400
                               uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-sm text-slate-800">
                      {b.patientName || "Unknown"}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {b.doctorName || "Unknown"}
                    </td>
                    <td className="px-5 py-4">
  <div>
    <p className="text-sm font-medium text-slate-700">{b.clinicName || "Unknown Clinic"}</p>
    {b.clinicCity && (
      <p className="text-[10px] text-slate-400 mt-0.5">{b.clinicCity}</p>
    )}
  </div>
</td>
                    <td className="px-5 py-4 font-semibold text-sm text-slate-700">
                      {formatDateTime(b.date, b.time)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1
                                    ${STATUS_STYLE[b.status]}`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-slate-400 italic text-sm">
                    No bookings found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
export default function BookingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingsPageInner />
    </Suspense>
  );
}

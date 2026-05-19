"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Eye, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useClinics } from "@/hooks/useClinics";

const STATUS_STYLE = {
  approved: "bg-teal-50 text-teal-700",
  pending: "bg-amber-50 text-amber-700",
  suspended: "bg-red-50 text-red-600",
};

export default function ClinicsPage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const { clinics, loading } = useClinics("all");

  const [search, setSearch] = useState(urlQuery);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  // Transform clinic data to match the expected format
  const formattedClinics = clinics.map((clinic) => ({
    id: clinic.id,
    name: clinic.clinicName || clinic.name || "Unnamed Clinic",
    owner: clinic.owner || clinic.contact || "Unknown",
    city: clinic.city || "Not specified",
    status: clinic.approved === true ? "approved" : "pending",
    doctors: clinic.doctorsCount || 0,
    bookings: clinic.bookingsCount || 0,
  }));

  const filtered = formattedClinics.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.owner.toLowerCase().includes(q);

    const matchFilter = filter === "All" || c.status === filter.toLowerCase();

    return matchSearch && matchFilter;
  });

  const approvedCount = formattedClinics.filter(
    (c) => c.status === "approved",
  ).length;
  const pendingCount = formattedClinics.filter(
    (c) => c.status === "pending",
  ).length;

  if (loading) {
    return (
      <main className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-slate-500 mt-3">Loading clinics...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Clinics Directory
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            {approvedCount} Approved · {pendingCount} Pending
          </p>
        </div>

        {search && (
          <div className="bg-teal-50 border border-teal-100 px-4 py-2 rounded-xl">
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
              Search Results for:{" "}
              <span className="text-slate-800">"{search}"</span>
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[280px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, ID or owner..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-teal-400 transition-all"
          />
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {["All", "Approved", "Pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all uppercase tracking-tighter
                          ${filter === tab ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Clinic Details</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4 text-center">Stats</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map((clinic) => (
                  <tr
                    key={clinic.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors uppercase">
                          {clinic.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">
                            {clinic.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {clinic.city} · ID: {clinic.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">
                      {clinic.owner}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center">
                        <p className="text-xs font-black text-slate-700">
                          {clinic.bookings}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                          Bookings
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`text-[10px] font-black uppercase rounded-full px-3 py-1 border ${STATUS_STYLE[clinic.status]}`}
                      >
                        {clinic.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                          title="View Profile"
                        >
                          <Eye size={16} />
                        </button>
                        {clinic.status === "approved" ? (
                          <button
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Suspend Clinic"
                          >
                            <ShieldAlert size={16} />
                          </button>
                        ) : (
                          <button
                            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                            title="Approve Clinic"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <p className="text-slate-400 font-medium italic text-sm">
                      No clinics found matching your criteria.
                    </p>
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

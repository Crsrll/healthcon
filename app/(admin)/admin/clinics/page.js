"use client"
import { Suspense } from "react";;
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Eye,
  ShieldAlert,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { useClinics } from "@/hooks/useClinics";
import { usePendingClinics } from "@/hooks/usePendingClinics";
import { useAuth } from "@/context/authContext"; // ADD THIS

const STATUS_STYLE = {
  approved: "bg-teal-50 text-teal-700 border-teal-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  suspended: "bg-red-50 text-red-600 border-red-200",
};

function ClinicsPageInner() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const { user } = useAuth(); // ADD THIS - get current user
  const { clinics, loading } = useClinics("all");
  const { approveClinic, suspendClinic, reinstateClinic } = usePendingClinics(user); // ADD user parameter

  const [search, setSearch] = useState(urlQuery);
  const [filter, setFilter] = useState("All");
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  const handleStatusUpdate = async (clinicId, action, clinicName) => {
    setActionLoading(clinicId);
    let result;

    if (action === "approve") {
      result = await approveClinic(clinicId, clinicName);
    } else if (action === "suspend") {
      result = await suspendClinic(clinicId, clinicName);
    } else if (action === "reinstate") {
      result = await reinstateClinic(clinicId, clinicName);
    }

    setActionLoading(null);

    if (!result?.success) {
      alert(`Failed to ${action}: ${result?.error || "Unknown error"}`);
    }
  };

  // Get status from clinic data
  const getStatus = (clinic) => {
    if (clinic.suspended === true) return "suspended";
    if (clinic.approved === true) return "approved";
    return "pending";
  };

  const filtered = clinics.filter((clinic) => {
    const q = search.toLowerCase();
    const name = (clinic.clinicName || clinic.name || "").toLowerCase();
    const city = (clinic.city || "").toLowerCase();
    const id = clinic.id.toLowerCase();
    const status = getStatus(clinic);

    const matchSearch = name.includes(q) || city.includes(q) || id.includes(q);
    const matchFilter = filter === "All" || status === filter.toLowerCase();

    return matchSearch && matchFilter;
  });

  const approvedCount = clinics.filter(
    (c) => getStatus(c) === "approved",
  ).length;
  const pendingCount = clinics.filter((c) => getStatus(c) === "pending").length;
  const suspendedCount = clinics.filter(
    (c) => getStatus(c) === "suspended",
  ).length;

  if (loading) {
    return (
      <main className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-slate-500 mt-3">Loading clinics...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Clinics Directory
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              {approvedCount} Approved · {pendingCount} Pending ·{" "}
              {suspendedCount} Suspended
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
              placeholder="Search by name, city, or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-teal-400 transition-all"
            />
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {["All", "Approved", "Pending", "Suspended"].map((tab) => (
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
          {/* Mobile card view */}
          <div className="sm:hidden divide-y divide-slate-100">
            {filtered.length > 0 ? (
              filtered.map((clinic) => {
                const status = getStatus(clinic);
                const name = clinic.clinicName || clinic.name || "Unnamed Clinic";
                const phone = clinic.contact || clinic.phone || "No contact";
                const email = clinic.email || "No email";
                const city = clinic.city || "Not specified";
                const hours = clinic.hours || null;
                const services = clinic.services || clinic.specialization || [];
                const image = clinic.image || null;
                return (
                  <div key={clinic.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 font-black text-xs flex items-center justify-center shrink-0 uppercase">
                          {name.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-800 truncate">{name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{city}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase rounded-full px-2.5 py-1 border shrink-0 ${STATUS_STYLE[status]}`}>{status}</span>
                    </div>
                    <p className="text-xs text-slate-500">{phone}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedClinic({ ...clinic, status, name, phone, email, city, hours, services, image })}
                        className="flex-1 py-2 text-xs font-bold text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition">View</button>
                      {status === "approved" && (
                        <button onClick={() => handleStatusUpdate(clinic.id, "suspend", name)} disabled={actionLoading === clinic.id}
                          className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-50">Suspend</button>
                      )}
                      {status === "suspended" && (
                        <button onClick={() => handleStatusUpdate(clinic.id, "reinstate", name)} disabled={actionLoading === clinic.id}
                          className="flex-1 py-2 text-xs font-bold text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition disabled:opacity-50">Reinstate</button>
                      )}
                      {status === "pending" && (
                        <button onClick={() => handleStatusUpdate(clinic.id, "approve", name)} disabled={actionLoading === clinic.id}
                          className="flex-1 py-2 text-xs font-bold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition disabled:opacity-50">Approve</button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-slate-400 text-sm italic">No clinics found</div>
            )}
          </div>
          {/* Desktop table view */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Clinic Details</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-center">Stats</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length > 0 ? (
                  filtered.map((clinic) => {
                    const status = getStatus(clinic);
                    const name =
                      clinic.clinicName || clinic.name || "Unnamed Clinic";
                    const phone =
                      clinic.contact || clinic.phone || "No contact";
                    const email = clinic.email || "No email";
                    const city = clinic.city || "Not specified";
                    const hours = clinic.hours || null;
                    const services =
                      clinic.services || clinic.specialization || [];
                    const image = clinic.image || null;

                    return (
                      <tr
                        key={clinic.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors uppercase">
                              {name.substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-800">
                                {name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">
                                {city} · ID: {clinic.id.substring(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-600">
                          {phone}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex flex-col items-center">
                            <p className="text-xs font-black text-slate-700">
                              {clinic.bookingsCount || 0}
                            </p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                              Bookings
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`text-[10px] font-black uppercase rounded-full px-3 py-1 border ${STATUS_STYLE[status]}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setSelectedClinic({
                                  ...clinic,
                                  status,
                                  name,
                                  phone,
                                  email,
                                  city,
                                  hours,
                                  services,
                                  image,
                                })
                              }
                              className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                              title="View Profile"
                            >
                              <Eye size={16} />
                            </button>

                            {status === "approved" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(clinic.id, "suspend", name)
                                }
                                disabled={actionLoading === clinic.id}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                title="Suspend Clinic"
                              >
                                {actionLoading === clinic.id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <ShieldAlert size={16} />
                                )}
                              </button>
                            )}

                            {status === "suspended" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(clinic.id, "reinstate", name)
                                }
                                disabled={actionLoading === clinic.id}
                                className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all disabled:opacity-50"
                                title="Reinstate Clinic"
                              >
                                {actionLoading === clinic.id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <CheckCircle2 size={16} />
                                )}
                              </button>
                            )}

                            {status === "pending" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(clinic.id, "approve", name)
                                }
                                disabled={actionLoading === clinic.id}
                                className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all disabled:opacity-50"
                                title="Approve Clinic"
                              >
                                {actionLoading === clinic.id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <CheckCircle2 size={16} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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

      {/* Modal */}
      {selectedClinic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">
                Clinic Details
              </h3>
              <button
                onClick={() => setSelectedClinic(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                {selectedClinic.image && (
                  <img
                    src={selectedClinic.image}
                    alt={selectedClinic.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-800">
                    {selectedClinic.name}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {selectedClinic.city}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-black uppercase rounded-full px-3 py-1 border ${STATUS_STYLE[selectedClinic.status]}`}
                >
                  {selectedClinic.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                    Phone
                  </p>
                  <p className="text-sm text-slate-700">
                    {selectedClinic.phone}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                    Email
                  </p>
                  <p className="text-sm text-slate-700 break-all">
                    {selectedClinic.email}
                  </p>
                </div>
              </div>

              {selectedClinic.hours && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">
                    Hours of Operation
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    {Object.entries(selectedClinic.hours).map(
                      ([day, times]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-semibold capitalize">
                            {day}:
                          </span>
                          <span className="text-slate-600">
                            {times.open} - {times.close}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {selectedClinic.services?.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">
                    Services
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedClinic.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-teal-50 text-teal-700 font-semibold rounded-full px-3 py-1"
                      >
                        {typeof service === "string" ? service : service.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-slate-800">
                    {selectedClinic.doctorsCount || 0}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Doctors
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-slate-800">
                    {selectedClinic.bookingsCount || 0}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Bookings
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                {selectedClinic.status === "approved" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedClinic.id, "suspend", selectedClinic.name)
                    }
                    disabled={actionLoading === selectedClinic.id}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {actionLoading === selectedClinic.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ShieldAlert size={18} />
                    )}
                    Suspend Clinic
                  </button>
                )}

                {selectedClinic.status === "suspended" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedClinic.id, "reinstate", selectedClinic.name)
                    }
                    disabled={actionLoading === selectedClinic.id}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {actionLoading === selectedClinic.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                    Reinstate Clinic
                  </button>
                )}

                {selectedClinic.status === "pending" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedClinic.id, "approve", selectedClinic.name)
                    }
                    disabled={actionLoading === selectedClinic.id}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {actionLoading === selectedClinic.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                    Approve Clinic
                  </button>
                )}

                <button
                  onClick={() => setSelectedClinic(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default function ClinicsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClinicsPageInner />
    </Suspense>
  );
}

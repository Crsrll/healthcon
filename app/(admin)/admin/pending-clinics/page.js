"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import { usePendingClinics } from "@/hooks/usePendingClinics";

export default function PendingClinicsPage() {
  const { pendingClinics, loading, error, approveClinic, rejectClinic } =
    usePendingClinics();

  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const handleApprove = async (id) => {
    setActionLoading(id);
    const result = await approveClinic(id);
    setActionLoading(null);

    if (result.success) {
      if (selected?.id === id) setSelected(null);
    } else {
      alert(`Failed to approve: ${result.error}`);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    const result = await rejectClinic(id);
    setActionLoading(null);

    if (result.success) {
      if (selected?.id === id) setSelected(null);
    } else {
      alert(`Failed to reject: ${result.error}`);
    }
  };

  // Format clinic data from Firestore structure
  const formatClinic = (clinic) => ({
    id: clinic.id,
    name: clinic.clinicName || clinic.name || "Unnamed Clinic",
    owner: clinic.owner || clinic.contact || "Unknown",
    city: clinic.city || "Not specified",
    specialization: clinic.services || clinic.specialization || [],
    submitted: clinic.createdAt
      ? new Date(clinic.createdAt).toLocaleDateString()
      : "Unknown",
    docs: clinic.documentCount || 0,
    email: clinic.email,
    phone: clinic.phone,
    hours: clinic.hours,
    image: clinic.image,
  });

  if (loading) {
    return (
      <main className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-teal-500 mx-auto mb-3"
          />
          <p className="text-slate-500">Loading pending clinics...</p>
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
            onClick={() => window.location.reload()}
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
        <h2 className="text-lg font-bold text-slate-800">
          Pending Clinic Approvals
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Review clinic registrations before they appear in the public directory
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LIST */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <h3 className="font-bold text-slate-800">Queue</h3>
              <span
                className="bg-red-500 text-white text-[10px] font-bold
                               px-2.5 py-0.5 rounded-full"
              >
                {pendingClinics.length} pending
              </span>
            </div>

            {pendingClinics.length === 0 ? (
              <div className="py-16 text-center">
                <div
                  className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center
                                justify-center mx-auto mb-3"
                >
                  <CheckCircle size={24} className="text-teal-500" />
                </div>
                <p className="font-semibold text-slate-600">All caught up!</p>
                <p className="text-xs text-slate-400 mt-1">
                  No pending clinic approvals
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {pendingClinics.map((clinic) => {
                  const formatted = formatClinic(clinic);
                  return (
                    <div
                      key={clinic.id}
                      className={`p-5 flex items-start gap-4 cursor-pointer transition-colors
                                  ${
                                    selected?.id === clinic.id
                                      ? "bg-blue-50 border-l-2 border-blue-500"
                                      : "hover:bg-slate-50 border-l-2 border-transparent"
                                  }`}
                      onClick={() => setSelected(clinic)}
                    >
                      <div
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center
                                      justify-center text-sm font-bold text-slate-500 shrink-0"
                      >
                        {formatted.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">
                          {formatted.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatted.owner} · {formatted.city}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formatted.specialization.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              className="text-[10px] bg-slate-100 text-slate-500
                                         rounded-full px-2 py-0.5 font-medium"
                            >
                              {typeof s === "string" ? s : s.name || s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-slate-400">
                          {formatted.submitted}
                        </p>
                        <p className="text-[10px] text-blue-500 font-semibold mt-1">
                          {formatted.docs} docs
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* DETAIL PANEL */}
        <div>
          {selected ? (
            <section
              className="bg-white rounded-2xl border border-slate-200 shadow-sm
                                overflow-hidden sticky top-6"
            >
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">
                  Clinic Review
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                    Clinic Name
                  </p>
                  <p className="font-semibold text-slate-800">
                    {selected.clinicName || selected.name}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                    Email
                  </p>
                  <p className="text-sm text-slate-700">
                    {selected.email || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                    Contact
                  </p>
                  <p className="text-sm text-slate-700">
                    {selected.contact || selected.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                    City
                  </p>
                  <p className="text-sm text-slate-700">
                    {selected.city || "Not specified"}
                  </p>
                </div>

                {selected.hours && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                      Hours
                    </p>
                    <p className="text-sm text-slate-700">{selected.hours}</p>
                  </div>
                )}

                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">
                    Services & Specializations
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(selected.services || selected.specialization || []).map(
                      (s, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-teal-50 text-teal-700 font-semibold
                                   rounded-full px-2.5 py-1"
                        >
                          {typeof s === "string" ? s : s.name || s}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">
                    Submitted Documents
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500">
                      {selected.documentCount || 0} document(s) attached
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Document review functionality coming soon
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleApprove(selected.id)}
                    disabled={actionLoading === selected.id}
                    className="flex-1 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-300
                               text-white font-bold text-sm py-2.5 rounded-xl transition-colors 
                               flex items-center justify-center gap-2"
                  >
                    {actionLoading === selected.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selected.id)}
                    disabled={actionLoading === selected.id}
                    className="flex-1 bg-red-50 hover:bg-red-100 disabled:bg-red-50/50
                               text-red-600 font-bold text-sm py-2.5 rounded-xl transition-colors 
                               flex items-center justify-center gap-2 border border-red-100"
                  >
                    {actionLoading === selected.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <XCircle size={16} />
                    )}
                    Reject
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <div
              className="bg-white rounded-2xl border border-dashed border-slate-200
                            p-8 text-center"
            >
              <Eye size={24} className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400">
                Select a clinic to review details
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

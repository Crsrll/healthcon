"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";

const PENDING = [
  { id: 1, name: "City Care Plus",      owner: "Dr. Alon",       city: "Davao City",  specialization: ["Dental","Dermatology"],  submitted: "2 hrs ago",  docs: 3 },
  { id: 2, name: "Dermacare Cebu",      owner: "Dr. Sanchez",    city: "Cebu City",   specialization: ["Dermatology"],           submitted: "5 hrs ago",  docs: 5 },
  { id: 3, name: "Metro Health Manila", owner: "Dr. Tan",        city: "Manila",      specialization: ["General Practice"],      submitted: "1 day ago",  docs: 2 },
  { id: 4, name: "Wellness Hub CDO",    owner: "Dr. Reyes",      city: "CDO",         specialization: ["Pediatrics","OB-GYN"],   submitted: "1 day ago",  docs: 4 },
  { id: 5, name: "Sunrise Medical",     owner: "Dr. Castillo",   city: "Zamboanga",   specialization: ["Internal Medicine"],     submitted: "2 days ago", docs: 3 },
];

export default function PendingClinicsPage() {
  const [clinics, setClinics] = useState(PENDING);
  const [selected, setSelected] = useState(null);

  function approve(id) {
    setClinics(prev => prev.filter(c => c.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function reject(id) {
    setClinics(prev => prev.filter(c => c.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  return (
    <main className="p-6 space-y-6">

      <div>
        <h2 className="text-lg font-bold text-slate-800">Pending Clinic Approvals</h2>
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
              <span className="bg-red-500 text-white text-[10px] font-bold
                               px-2.5 py-0.5 rounded-full">
                {clinics.length} pending
              </span>
            </div>

            {clinics.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center
                                justify-center mx-auto mb-3">
                  <CheckCircle size={24} className="text-teal-500" />
                </div>
                <p className="font-semibold text-slate-600">All caught up!</p>
                <p className="text-xs text-slate-400 mt-1">No pending clinic approvals</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {clinics.map(clinic => (
                  <div key={clinic.id}
                    className={`p-5 flex items-start gap-4 cursor-pointer transition-colors
                                ${selected?.id === clinic.id
                                  ? 'bg-blue-50 border-l-2 border-blue-500'
                                  : 'hover:bg-slate-50 border-l-2 border-transparent'}`}
                    onClick={() => setSelected(clinic)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center
                                    justify-center text-sm font-bold text-slate-500 shrink-0">
                      {clinic.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{clinic.name}</p>
                      <p className="text-xs text-slate-400">
                        {clinic.owner} · {clinic.city}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {clinic.specialization.map(s => (
                          <span key={s}
                            className="text-[10px] bg-slate-100 text-slate-500
                                       rounded-full px-2 py-0.5 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-slate-400">{clinic.submitted}</p>
                      <p className="text-[10px] text-blue-500 font-semibold mt-1">
                        {clinic.docs} docs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* DETAIL PANEL */}
        <div>
          {selected ? (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm
                                overflow-hidden sticky top-6">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">Clinic Review</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                    Clinic Name
                  </p>
                  <p className="font-semibold text-slate-800">{selected.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Owner</p>
                  <p className="text-sm text-slate-700">{selected.owner}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">City</p>
                  <p className="text-sm text-slate-700">{selected.city}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">
                    Specializations
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.specialization.map(s => (
                      <span key={s}
                        className="text-xs bg-teal-50 text-teal-700 font-semibold
                                   rounded-full px-2.5 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">
                    Submitted Documents ({selected.docs})
                  </p>
                  <div className="space-y-1.5">
                    {Array.from({ length: selected.docs }).map((_, i) => (
                      <div key={i}
                        className="flex items-center justify-between bg-slate-50
                                   rounded-lg px-3 py-2">
                        <span className="text-xs text-slate-600">Document_{i + 1}.pdf</span>
                        <button className="text-[10px] text-blue-500 font-semibold
                                           hover:underline">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => approve(selected.id)}
                    className="flex-1 bg-teal-500 hover:bg-teal-400 text-white font-bold
                               text-sm py-2.5 rounded-xl transition-colors flex items-center
                               justify-center gap-2"
                  >
                    <CheckCircle size={16}/> Approve
                  </button>
                  <button
                    onClick={() => reject(selected.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold
                               text-sm py-2.5 rounded-xl transition-colors flex items-center
                               justify-center gap-2 border border-red-100"
                  >
                    <XCircle size={16}/> Reject
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200
                            p-8 text-center">
              <Eye size={24} className="text-slate-300 mx-auto mb-2"/>
              <p className="text-xs text-slate-400">Select a clinic to review details</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
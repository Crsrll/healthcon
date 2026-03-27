"use client";
import { useState } from "react";

const BOOKINGS = [
  { id:1,  patient:"John Wick",    doctor:"Dr. Rosa Macaraeg",  clinic:"CDO Outpatient",        date:"Mar 24, 9:00 AM",  status:"confirmed" },
  { id:2,  patient:"Sarah Connor", doctor:"Dr. Sofia Castillo", clinic:"Iligan Medical Center",  date:"Mar 24, 10:30 AM", status:"pending"   },
  { id:3,  patient:"Bruce Wayne",  doctor:"Dr. Ben Villanueva", clinic:"Joseph Community Health",date:"Mar 24, 1:00 PM",  status:"completed" },
  { id:4,  patient:"Diana Prince", doctor:"Dr. Marco Reyes",    clinic:"Iligan Medical Center",  date:"Mar 25, 8:00 AM",  status:"pending"   },
  { id:5,  patient:"Peter Parker", doctor:"Dr. Claire Mendoza", clinic:"Che Ann Community",      date:"Mar 25, 2:00 PM",  status:"cancelled" },
  { id:6,  patient:"Tony Stark",   doctor:"Dr. Jun Dela Cruz",  clinic:"CDO Outpatient",         date:"Mar 25, 3:00 PM",  status:"confirmed" },
];

const STATUS_STYLE = {
  confirmed: "bg-blue-50 text-blue-700",
  pending:   "bg-amber-50 text-amber-700",
  completed: "bg-teal-50 text-teal-700",
  cancelled: "bg-red-50 text-red-600",
};

export default function BookingsPage() {
  const [tab, setTab] = useState("All");

  const filtered = BOOKINGS.filter(b =>
    tab === "All" || b.status === tab.toLowerCase()
  );

  const counts = {
    All:       BOOKINGS.length,
    Pending:   BOOKINGS.filter(b=>b.status==="pending").length,
    Confirmed: BOOKINGS.filter(b=>b.status==="confirmed").length,
    Completed: BOOKINGS.filter(b=>b.status==="completed").length,
    Cancelled: BOOKINGS.filter(b=>b.status==="cancelled").length,
  };

  return (
    <main className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Platform Bookings</h2>
        <p className="text-xs text-slate-400 mt-0.5">All bookings across all clinics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Pending",   count: counts.Pending,   color:"text-amber-600", bg:"bg-amber-50"  },
          { label:"Confirmed", count: counts.Confirmed, color:"text-blue-600",  bg:"bg-blue-50"   },
          { label:"Completed", count: counts.Completed, color:"text-teal-600",  bg:"bg-teal-50"   },
          { label:"Cancelled", count: counts.Cancelled, color:"text-red-500",   bg:"bg-red-50"    },
        ].map(s => (
          <div key={s.label}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center
                       justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{s.label}</p>
              <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.count}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <span className={`text-lg font-black ${s.color}`}>{s.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
        {["All","Pending","Confirmed","Completed","Cancelled"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
                        ${tab === t
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-400 hover:text-slate-600'}`}>
            {t}
          </button>
        ))}
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Patient","Doctor","Clinic","Date & Time","Status"].map(h => (
                <th key={h} className="px-5 py-3 text-[10px] font-bold text-slate-400
                                       uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 font-semibold text-sm text-slate-800">
                  {b.patient}
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">{b.doctor}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{b.clinic}</td>
                <td className="px-5 py-4 font-semibold text-sm text-slate-700">{b.date}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1
                                    ${STATUS_STYLE[b.status]}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
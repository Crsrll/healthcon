"use client";
import { useState } from "react";
import { Flag, AlertTriangle, TrendingUp } from "lucide-react";

const FLAGGED = [
  { id:1, type:"Doctor",  name:"Dr. Claire Mendoza",  reason:"Multiple patient complaints",    clinic:"Che Ann Community",  date:"Mar 20", severity:"high"   },
  { id:2, type:"Clinic",  name:"Sunrise Medical",     reason:"Unverified credentials",          clinic:"—",                  date:"Mar 19", severity:"high"   },
  { id:3, type:"User",    name:"Peter Parker",        reason:"Spam booking reports",            clinic:"CDO Outpatient",     date:"Mar 18", severity:"medium" },
  { id:4, type:"Doctor",  name:"Dr. Paolo Gutierrez", reason:"No-show pattern detected",        clinic:"Sheila Community",   date:"Mar 17", severity:"low"    },
  { id:5, type:"Clinic",  name:"Metro Health Manila", reason:"Incomplete profile",              clinic:"—",                  date:"Mar 16", severity:"low"    },
];

const SEV_STYLE = {
  high:   "bg-red-50 text-red-600 border border-red-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  low:    "bg-slate-100 text-slate-500 border border-slate-200",
};

const TYPE_STYLE = {
  Doctor: "bg-indigo-50 text-indigo-600",
  Clinic: "bg-blue-50 text-blue-600",
  User:   "bg-slate-100 text-slate-600",
};

export default function ReportsFlaggedPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = FLAGGED.filter(f =>
    activeTab === "All" || f.type === activeTab
  );

  return (
    <main className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Reports & Flagged Content</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Review flagged doctors, clinics, and users
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label:"High Severity",   count:FLAGGED.filter(f=>f.severity==="high").length,   icon:<AlertTriangle size={18}/>, color:"text-red-500",   bg:"bg-red-50"   },
          { label:"Medium Severity", count:FLAGGED.filter(f=>f.severity==="medium").length, icon:<Flag size={18}/>,         color:"text-amber-600", bg:"bg-amber-50" },
          { label:"Low Severity",    count:FLAGGED.filter(f=>f.severity==="low").length,    icon:<TrendingUp size={18}/>,   color:"text-slate-500", bg:"bg-slate-100"},
        ].map(s => (
          <div key={s.label}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center
                       gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center
                             justify-center shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
        {["All","Doctor","Clinic","User"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
                        ${activeTab === t
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
              {["Type","Name","Reason","Clinic","Reported","Severity","Actions"].map(h => (
                <th key={h} className="px-5 py-3 text-[10px] font-bold text-slate-400
                                       uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-bold rounded-full px-2.5 py-1
                                    ${TYPE_STYLE[item.type]}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-sm text-slate-800">{item.name}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{item.reason}</td>
                <td className="px-5 py-4 text-sm text-slate-400">{item.clinic}</td>
                <td className="px-5 py-4 text-sm text-slate-400">{item.date}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1
                                    ${SEV_STYLE[item.severity]}`}>
                    {item.severity}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-semibold text-slate-500 bg-slate-100
                                       hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5
                                       rounded-lg transition-colors">
                      Review
                    </button>
                    <button className="text-xs font-semibold text-red-500 bg-red-50
                                       hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                      Dismiss
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
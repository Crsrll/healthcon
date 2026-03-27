"use client";
import { useState } from "react";
import { Search } from "lucide-react";

const DOCTORS = [
  { id:"1",  name:"Dr. Rosa Macaraeg",   spec:"General Practice",  clinic:"CDO Outpatient Clinic",   city:"CDO",        status:"active",   patients:128 },
  { id:"2",  name:"Dr. Jun Dela Cruz",   spec:"Pediatrics",        clinic:"CDO Outpatient Clinic",   city:"CDO",        status:"active",   patients:94  },
  { id:"3",  name:"Dr. Sofia Castillo",  spec:"Internal Medicine", clinic:"Iligan Medical Center",   city:"Iligan City",status:"active",   patients:205 },
  { id:"4",  name:"Dr. Marco Reyes",     spec:"Cardiology",        clinic:"Iligan Medical Center",   city:"Iligan City",status:"active",   patients:176 },
  { id:"5",  name:"Dr. Ben Villanueva",  spec:"Internal Medicine", clinic:"Joseph Community Health", city:"Dapitan",    status:"active",   patients:312 },
  { id:"6",  name:"Dr. Claire Mendoza",  spec:"Ob-Gyne",           clinic:"Che Ann Community Health",city:"Dapitan",    status:"flagged",  patients:88  },
  { id:"7",  name:"Dr. Paolo Gutierrez", spec:"General Practice",  clinic:"Sheila Community Health", city:"Dapitan",    status:"inactive", patients:0   },
];

const STATUS_STYLE = {
  active:   "bg-teal-50 text-teal-700",
  flagged:  "bg-red-50 text-red-600",
  inactive: "bg-slate-100 text-slate-500",
};

export default function DoctorsPage() {
  const [search, setSearch] = useState("");

  const filtered = DOCTORS.filter(d => {
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) ||
           d.spec.toLowerCase().includes(q) ||
           d.clinic.toLowerCase().includes(q);
  });

  return (
    <main className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">All Doctors</h2>
        <p className="text-xs text-slate-400 mt-0.5">Platform-wide doctor registry</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search doctor, specialty, clinic..."
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm
                     outline-none focus:border-teal-400 transition-colors"/>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Doctor","Specialization","Clinic","City","Patients","Status","Actions"].map(h => (
                <th key={h} className="px-5 py-3 text-[10px] font-bold text-slate-400
                                       uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold
                                    text-xs flex items-center justify-center shrink-0">
                      {doc.name.split(' ')[1]?.[0]}
                    </div>
                    <span className="font-semibold text-sm text-slate-800">{doc.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs bg-teal-50 text-teal-700 font-semibold
                                   rounded-full px-2.5 py-1">
                    {doc.spec}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">{doc.clinic}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{doc.city}</td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                  {doc.patients}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1
                                    ${STATUS_STYLE[doc.status]}`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-semibold text-slate-500 bg-slate-100
                                       hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5
                                       rounded-lg transition-colors">
                      View
                    </button>
                    {doc.status === "flagged" && (
                      <button className="text-xs font-semibold text-red-500 bg-red-50
                                         px-3 py-1.5 rounded-lg">
                        Review
                      </button>
                    )}
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
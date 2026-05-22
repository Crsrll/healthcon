"use client"
import { Suspense } from "react";;
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, UserCheck, AlertOctagon, UserMinus } from "lucide-react";

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
  active:   "bg-teal-50 text-teal-700 border-teal-100",
  flagged:  "bg-red-50 text-red-600 border-red-100",
  inactive: "bg-slate-50 text-slate-500 border-slate-200",
};

function DoctorsPageInner() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [search, setSearch] = useState(urlQuery);
  const [filter, setFilter] = useState("All");

  // Sync local search with URL search (Global Layout Search bar)
  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  // Combined Filter Logic
  const filtered = DOCTORS.filter(doc => {
    const q = search.toLowerCase();
    const matchSearch = doc.name.toLowerCase().includes(q) ||
                        doc.spec.toLowerCase().includes(q) ||
                        doc.clinic.toLowerCase().includes(q);
    
    const matchFilter = filter === "All" || doc.status === filter.toLowerCase();
    
    return matchSearch && matchFilter;
  });

  return (
    <main className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* ── HEADER AREA ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Doctor Registry</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            {DOCTORS.filter(d => d.status === 'active').length} Active ·{" "}
            {DOCTORS.filter(d => d.status === 'flagged').length} Flagged
          </p>
        </div>
        
        {search && (
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
             <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
               Filtering by: <span className="text-slate-800">"{search}"</span>
             </p>
          </div>
        )}
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="flex items-center gap-3 flex-wrap bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search doctor, specialty, or clinic..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-teal-400 transition-all"
          />
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {["All","Active","Flagged","Inactive"].map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all uppercase tracking-tighter
                          ${filter === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── DOCTORS TABLE ── */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Doctor / Clinic","Specialization","Patients","Status","Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-100">
                          {doc.name.split(' ').map(n => n[0]).join('').substring(1, 3)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{doc.clinic}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 rounded-lg px-2.5 py-1 uppercase">
                        {doc.spec}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-slate-700">
                      {doc.patients.toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black uppercase rounded-full px-3 py-1 border ${STATUS_STYLE[doc.status]}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="Verify / View">
                          <UserCheck size={18} />
                        </button>
                        {doc.status === "flagged" && (
                          <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Review Incident">
                            <AlertOctagon size={18} />
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="Deactivate">
                          <UserMinus size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-slate-400 italic text-sm">
                    No doctors found matching your search criteria.
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

// "use client";
// import { useState } from "react";
// import { Search } from "lucide-react";

// const DOCTORS = [
//   { id:"1",  name:"Dr. Rosa Macaraeg",   spec:"General Practice",  clinic:"CDO Outpatient Clinic",   city:"CDO",        status:"active",   patients:128 },
//   { id:"2",  name:"Dr. Jun Dela Cruz",   spec:"Pediatrics",        clinic:"CDO Outpatient Clinic",   city:"CDO",        status:"active",   patients:94  },
//   { id:"3",  name:"Dr. Sofia Castillo",  spec:"Internal Medicine", clinic:"Iligan Medical Center",   city:"Iligan City",status:"active",   patients:205 },
//   { id:"4",  name:"Dr. Marco Reyes",     spec:"Cardiology",        clinic:"Iligan Medical Center",   city:"Iligan City",status:"active",   patients:176 },
//   { id:"5",  name:"Dr. Ben Villanueva",  spec:"Internal Medicine", clinic:"Joseph Community Health", city:"Dapitan",    status:"active",   patients:312 },
//   { id:"6",  name:"Dr. Claire Mendoza",  spec:"Ob-Gyne",           clinic:"Che Ann Community Health",city:"Dapitan",    status:"flagged",  patients:88  },
//   { id:"7",  name:"Dr. Paolo Gutierrez", spec:"General Practice",  clinic:"Sheila Community Health", city:"Dapitan",    status:"inactive", patients:0   },
// ];

// const STATUS_STYLE = {
//   active:   "bg-teal-50 text-teal-700",
//   flagged:  "bg-red-50 text-red-600",
//   inactive: "bg-slate-100 text-slate-500",
// };

// export default function DoctorsPage() {
//   const [search, setSearch] = useState("");

//   const filtered = DOCTORS.filter(d => {
//     const q = search.toLowerCase();
//     return d.name.toLowerCase().includes(q) ||
//            d.spec.toLowerCase().includes(q) ||
//            d.clinic.toLowerCase().includes(q);
//   });

//   return (
//     <main className="p-4 sm:p-6 space-y-6">
//       <div>
//         <h2 className="text-lg font-bold text-slate-800">All Doctors</h2>
//         <p className="text-xs text-slate-400 mt-0.5">Platform-wide doctor registry</p>
//       </div>

//       <div className="relative max-w-sm">
//         <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
//         <input value={search} onChange={e => setSearch(e.target.value)}
//           placeholder="Search doctor, specialty, clinic..."
//           className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm
//                      outline-none focus:border-teal-400 transition-colors"/>
//       </div>

//       <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-slate-50 border-b border-slate-100">
//             <tr>
//               {["Doctor","Specialization","Clinic","City","Patients","Status","Actions"].map(h => (
//                 <th key={h} className="px-5 py-3 text-[10px] font-bold text-slate-400
//                                        uppercase tracking-widest">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {filtered.map(doc => (
//               <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
//                 <td className="px-5 py-4">
//                   <div className="flex items-center gap-2.5">
//                     <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold
//                                     text-xs flex items-center justify-center shrink-0">
//                       {doc.name.split(' ')[1]?.[0]}
//                     </div>
//                     <span className="font-semibold text-sm text-slate-800">{doc.name}</span>
//                   </div>
//                 </td>
//                 <td className="px-5 py-4">
//                   <span className="text-xs bg-teal-50 text-teal-700 font-semibold
//                                    rounded-full px-2.5 py-1">
//                     {doc.spec}
//                   </span>
//                 </td>
//                 <td className="px-5 py-4 text-sm text-slate-500">{doc.clinic}</td>
//                 <td className="px-5 py-4 text-sm text-slate-500">{doc.city}</td>
//                 <td className="px-5 py-4 text-sm font-semibold text-slate-700">
//                   {doc.patients}
//                 </td>
//                 <td className="px-5 py-4">
//                   <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1
//                                     ${STATUS_STYLE[doc.status]}`}>
//                     {doc.status}
//                   </span>
//                 </td>
//                 <td className="px-5 py-4">
//                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button className="text-xs font-semibold text-slate-500 bg-slate-100
//                                        hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5
//                                        rounded-lg transition-colors">
//                       View
//                     </button>
//                     {doc.status === "flagged" && (
//                       <button className="text-xs font-semibold text-red-500 bg-red-50
//                                          px-3 py-1.5 rounded-lg">
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </main>
//   );
// }
export default function DoctorsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DoctorsPageInner />
    </Suspense>
  );
}

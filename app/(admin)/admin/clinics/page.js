"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Eye, ShieldAlert, CheckCircle2 } from "lucide-react";

const ALL_CLINICS = [
  { id:"1", name:"Joseph Community Health", owner:"Dr. Villanueva", city:"Dapitan",         status:"approved",  doctors:3, bookings:420 },
  { id:"2", name:"Iligan Medical Center",   owner:"Dr. Castillo",  city:"Iligan City",      status:"approved",  doctors:5, bookings:310 },
  { id:"3", name:"CDO Outpatient Clinic",   owner:"Dr. Macaraeg",  city:"Cagayan de Oro",   status:"approved",  doctors:3, bookings:215 },
  { id:"4", name:"Bukidnon Community",      owner:"Dr. Santos",    city:"Malaybalay",       status:"approved",  doctors:1, bookings:88  },
  { id:"5", name:"City Care Plus",          owner:"Dr. Alon",      city:"Davao City",       status:"pending",   doctors:0, bookings:0   },
  { id:"6", name:"Dermacare Cebu",          owner:"Dr. Sanchez",   city:"Cebu City",        status:"pending",   doctors:0, bookings:0   },
  { id:"7", name:"Sunrise Medical",         owner:"Dr. Castillo",  city:"Zamboanga",        status:"suspended", doctors:2, bookings:0   },
];

const STATUS_STYLE = {
  approved:  "bg-teal-50 text-teal-700",
  pending:   "bg-amber-50 text-amber-700",
  suspended: "bg-red-50 text-red-600",
};

export default function ClinicsPage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [search, setSearch] = useState(urlQuery);
  const [filter, setFilter] = useState("All");

  // 2. Sync local search with URL search (Global Layout Search bar)
  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  // 3. Combined Filter Logic
  const filtered = ALL_CLINICS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) ||
                        c.city.toLowerCase().includes(q) ||
                        c.id.toLowerCase().includes(q) ||
                        c.owner.toLowerCase().includes(q);
    
    const matchFilter = filter === "All" || c.status === filter.toLowerCase();
    
    return matchSearch && matchFilter;
  });

  return (
    <main className="p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* ── HEADER AREA ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Clinics Directory</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            {ALL_CLINICS.filter(c => c.status === 'approved').length} Active ·{" "}
            {ALL_CLINICS.filter(c => c.status === 'pending').length} Pending ·{" "}
            {ALL_CLINICS.filter(c => c.status === 'suspended').length} Suspended
          </p>
        </div>

        {/* Status result indicator */}
        {search && (
          <div className="bg-teal-50 border border-teal-100 px-4 py-2 rounded-xl">
             <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
               Search Results for: <span className="text-slate-800">"{search}"</span>
             </p>
          </div>
        )}
      </div>

      {/* ── SEARCH & FILTER TABS ── */}
      <div className="flex items-center gap-3 flex-wrap bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, city, ID or owner..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-teal-400 transition-all"
          />
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {["All","Approved","Pending","Suspended"].map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all uppercase tracking-tighter
                          ${filter === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── CLINICS TABLE ── */}
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
                filtered.map(clinic => (
                  <tr key={clinic.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors uppercase">
                          {clinic.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{clinic.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{clinic.city} · ID: {clinic.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">
                      {clinic.owner}
                    </td>
                    <td className="px-6 py-5 text-center">
                       <div className="flex flex-col items-center">
                          <p className="text-xs font-black text-slate-700">{clinic.bookings}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Bookings</p>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black uppercase rounded-full px-3 py-1 border ${STATUS_STYLE[clinic.status]}`}>
                        {clinic.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="gap-2">
                        <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="View Profile">
                          <Eye size={16} />
                        </button>
                        {clinic.status === "approved" ? (
                          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Suspend Clinic">
                            <ShieldAlert size={16} />
                          </button>
                        ) : (
                          <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="Approve/Reinstate">
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
                    <p className="text-slate-400 font-medium italic text-sm">No clinics found matching your criteria.</p>
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

// const ALL_CLINICS = [
//   { id:"1", name:"Joseph Community Health", owner:"Dr. Villanueva", city:"Dapitan",         status:"approved",  doctors:3, bookings:420 },
//   { id:"2", name:"Iligan Medical Center",   owner:"Dr. Castillo",  city:"Iligan City",      status:"approved",  doctors:5, bookings:310 },
//   { id:"3", name:"CDO Outpatient Clinic",   owner:"Dr. Macaraeg",  city:"Cagayan de Oro",   status:"approved",  doctors:3, bookings:215 },
//   { id:"4", name:"Bukidnon Community",      owner:"Dr. Santos",    city:"Malaybalay",       status:"approved",  doctors:1, bookings:88  },
//   { id:"5", name:"City Care Plus",          owner:"Dr. Alon",      city:"Davao City",       status:"pending",   doctors:0, bookings:0   },
//   { id:"6", name:"Dermacare Cebu",          owner:"Dr. Sanchez",   city:"Cebu City",        status:"pending",   doctors:0, bookings:0   },
//   { id:"7", name:"Sunrise Medical",         owner:"Dr. Castillo",  city:"Zamboanga",        status:"suspended", doctors:2, bookings:0   },
// ];

// const STATUS_STYLE = {
//   approved:  "bg-teal-50 text-teal-700",
//   pending:   "bg-amber-50 text-amber-700",
//   suspended: "bg-red-50 text-red-600",
// };

// export default function ClinicsPage() {
//   const [search,    setSearch]    = useState("");
//   const [filter,    setFilter]    = useState("All");

//   const filtered = ALL_CLINICS.filter(c => {
//     const q = search.toLowerCase();
//     const matchSearch = c.name.toLowerCase().includes(q) ||
//                         c.city.toLowerCase().includes(q);
//     const matchFilter = filter === "All" ||
//                         c.status === filter.toLowerCase();
//     return matchSearch && matchFilter;
//   });

//   return (
//     <main className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-bold text-slate-800">All Clinics</h2>
//           <p className="text-xs text-slate-400 mt-0.5">
//             {ALL_CLINICS.filter(c => c.status === 'approved').length} approved ·{" "}
//             {ALL_CLINICS.filter(c => c.status === 'pending').length} pending ·{" "}
//             {ALL_CLINICS.filter(c => c.status === 'suspended').length} suspended
//           </p>
//         </div>
//       </div>

//       {/* Search + filter bar */}
//       <div className="flex items-center gap-3 flex-wrap">
//         <div className="relative flex-1 min-w-48">
//           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
//           <input
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Search clinic or city..."
//             className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm
//                        outline-none focus:border-teal-400 transition-colors"
//           />
//         </div>
//         <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
//           {["All","Approved","Pending","Suspended"].map(tab => (
//             <button key={tab} onClick={() => setFilter(tab)}
//               className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
//                           ${filter === tab
//                             ? 'bg-white text-slate-800 shadow-sm'
//                             : 'text-slate-400 hover:text-slate-600'}`}>
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-slate-50 border-b border-slate-100">
//             <tr>
//               {["Clinic","Owner","City","Doctors","Bookings","Status","Actions"].map(h => (
//                 <th key={h} className="px-5 py-3 text-[10px] font-bold text-slate-400
//                                        uppercase tracking-widest">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {filtered.map(clinic => (
//               <tr key={clinic.id} className="hover:bg-slate-50 transition-colors group">
//                 <td className="px-5 py-4">
//                   <div className="flex items-center gap-2.5">
//                     <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold
//                                     text-xs flex items-center justify-center shrink-0">
//                       {clinic.name[0]}
//                     </div>
//                     <span className="font-semibold text-sm text-slate-800">{clinic.name}</span>
//                   </div>
//                 </td>
//                 <td className="px-5 py-4 text-sm text-slate-500">{clinic.owner}</td>
//                 <td className="px-5 py-4 text-sm text-slate-500">{clinic.city}</td>
//                 <td className="px-5 py-4 text-sm font-semibold text-slate-700">
//                   {clinic.doctors}
//                 </td>
//                 <td className="px-5 py-4 text-sm text-slate-500">{clinic.bookings}</td>
//                 <td className="px-5 py-4">
//                   <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1
//                                     ${STATUS_STYLE[clinic.status]}`}>
//                     {clinic.status}
//                   </span>
//                 </td>
//                 <td className="px-5 py-4">
//                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button className="text-xs font-semibold text-slate-500 hover:text-blue-600
//                                        bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg
//                                        transition-colors">
//                       View
//                     </button>
//                     {clinic.status === "approved" && (
//                       <button className="text-xs font-semibold text-red-400 hover:text-red-600
//                                          bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
//                         Suspend
//                       </button>
//                     )}
//                     {clinic.status === "suspended" && (
//                       <button className="text-xs font-semibold text-teal-600 bg-teal-50
//                                          px-3 py-1.5 rounded-lg transition-colors">
//                         Reinstate
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
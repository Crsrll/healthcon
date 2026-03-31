"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Eye, ShieldMinus, ShieldCheck, User } from "lucide-react";

const USERS = [
  { id:"USR-001", name:"John Wick",      email:"john@email.com",    role:"patient", joined:"Mar 1, 2026",  bookings:12, status:"active"    },
  { id:"USR-002", name:"Sarah Connor",   email:"sarah@email.com",   role:"patient", joined:"Mar 5, 2026",  bookings:3,  status:"active"    },
  { id:"USR-003", name:"Bruce Wayne",    email:"bruce@email.com",   role:"patient", joined:"Mar 8, 2026",  bookings:8,  status:"active"    },
  { id:"USR-004", name:"Diana Prince",   email:"diana@email.com",   role:"patient", joined:"Mar 10, 2026", bookings:1,  status:"active"    },
  { id:"USR-005", name:"Peter Parker",   email:"peter@email.com",   role:"patient", joined:"Mar 12, 2026", bookings:5,  status:"suspended" },
  { id:"USR-006", name:"Tony Stark",     email:"tony@email.com",    role:"patient", joined:"Mar 14, 2026", bookings:0,  status:"active"    },
  { id:"USR-007", name:"Natasha R.",     email:"natasha@email.com", role:"patient", joined:"Mar 15, 2026", bookings:2,  status:"active"    },
];

const STATUS_STYLE = {
  active:    "bg-teal-50 text-teal-700 border-teal-100",
  suspended: "bg-red-50 text-red-600 border-red-100",
};

export default function UsersPage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || ""; // Catch search from Layout Navbar

  const [search, setSearch] = useState(urlQuery);
  const [tab, setTab] = useState("All");

  // Synchronize local input with global search bar
  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  const filtered = USERS.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || 
                        u.email.toLowerCase().includes(q) ||
                        u.id.toLowerCase().includes(q);
    
    const matchTab = tab === "All" || u.status === tab.toLowerCase();
    
    return matchSearch && matchTab;
  });

  return (
    <main className="p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* ── HEADER AREA ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">User Directory</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            {USERS.length} Total Registered · {USERS.filter(u => u.status === 'active').length} Active Patients
          </p>
        </div>
        
        {search && (
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
             <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
               Search: <span className="text-slate-800">"{search}"</span>
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
            placeholder="Search by name, email, or User ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-400 transition-all"
          />
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {["All","Active","Suspended"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all uppercase tracking-tighter
                          ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── USERS TABLE ── */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-center">Bookings</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center shrink-0 border border-blue-100 uppercase">
                          {user.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase">
                      {user.joined}
                    </td>
                    <td className="px-6 py-5 text-center">
                       <p className="text-sm font-black text-slate-700">{user.bookings}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black uppercase rounded-full px-3 py-1 border ${STATUS_STYLE[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Profile">
                          <Eye size={18} />
                        </button>
                        {user.status === 'active' ? (
                          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Suspend User">
                            <ShieldMinus size={18} />
                          </button>
                        ) : (
                          <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="Reinstate User">
                            <ShieldCheck size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-slate-400 italic text-sm">
                    No users found matching your search.
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
"use client";
import { useState } from "react";
import { Search } from "lucide-react";

const USERS = [
  { id:"1",  name:"John Wick",      email:"john@email.com",    role:"patient", joined:"Mar 1, 2026",  bookings:12, status:"active"    },
  { id:"2",  name:"Sarah Connor",   email:"sarah@email.com",   role:"patient", joined:"Mar 5, 2026",  bookings:3,  status:"active"    },
  { id:"3",  name:"Bruce Wayne",    email:"bruce@email.com",   role:"patient", joined:"Mar 8, 2026",  bookings:8,  status:"active"    },
  { id:"4",  name:"Diana Prince",   email:"diana@email.com",   role:"patient", joined:"Mar 10, 2026", bookings:1,  status:"active"    },
  { id:"5",  name:"Peter Parker",   email:"peter@email.com",   role:"patient", joined:"Mar 12, 2026", bookings:5,  status:"suspended" },
  { id:"6",  name:"Tony Stark",     email:"tony@email.com",    role:"patient", joined:"Mar 14, 2026", bookings:0,  status:"active"    },
  { id:"7",  name:"Natasha R.",     email:"natasha@email.com", role:"patient", joined:"Mar 15, 2026", bookings:2,  status:"active"    },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [tab,    setTab]    = useState("All");

  const filtered = USERS.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchT  = tab === "All" ||
                   (tab === "Active"    && u.status === "active") ||
                   (tab === "Suspended" && u.status === "suspended");
    return matchQ && matchT;
  });

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Users</h2>
          <p className="text-xs text-slate-400 mt-0.5">All registered patients on the platform</p>
        </div>
        <div className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg">
          {USERS.length} total
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm
                       outline-none focus:border-teal-400 transition-colors"/>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {["All","Active","Suspended"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
                          ${tab === t
                            ? 'bg-white text-slate-800 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["User","Email","Joined","Bookings","Status","Actions"].map(h => (
                <th key={h} className="px-5 py-3 text-[10px] font-bold text-slate-400
                                       uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold
                                    text-xs flex items-center justify-center shrink-0">
                      {user.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <span className="font-semibold text-sm text-slate-800">{user.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">{user.email}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{user.joined}</td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                  {user.bookings}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1
                                    ${user.status === 'active'
                                      ? 'bg-teal-50 text-teal-700'
                                      : 'bg-red-50 text-red-600'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-semibold text-slate-500 bg-slate-100
                                       hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5
                                       rounded-lg transition-colors">
                      View
                    </button>
                    <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg
                                        transition-colors
                                        ${user.status === 'active'
                                          ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                          : 'text-teal-600 bg-teal-50 hover:bg-teal-100'}`}>
                      {user.status === 'active' ? 'Suspend' : 'Reinstate'}
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
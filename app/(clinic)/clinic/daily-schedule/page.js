"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react"; // Added missing import

export default function DailySchedulePage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || ""; 
  const urlStatus = searchParams.get("status") || "All"; 

  // 1. Define missing states
  const [search, setSearch] = useState(urlQuery);
  const [filter, setFilter] = useState(urlStatus);
  
  const [schedule] = useState([
    { id: 1, time: "03:15 PM", patient: "Melissa Doe", service: "Check-Up", status: "In Session" },
    { id: 2, time: "01:00 PM", patient: "Diana Prince", service: "Consultation", status: "Waiting" },
    { id: 3, time: "09:30 AM", patient: "Sarah Connor", service: "Check-up", status: "Waiting" },
    { id: 4, time: "08:00 AM", patient: "John Wick", service: "Consultation", status: "Completed" },
    { id: 5, time: "11:00 AM", patient: "Bruce Wayne", service: "Follow-up", status: "Completed" },
    { id: 6, time: "02:30 PM", patient: "Peter Parker", service: "Prenatal Check-up", status: "Cancelled" },
  ]);

  // 2. Sync with URL changes (Global Search or PulseCard clicks)
  useEffect(() => {
    setSearch(urlQuery);
    setFilter(urlStatus);
  }, [urlQuery, urlStatus]);

  // 3. Combined Filter Logic (Status + Search)
  const filteredSchedule = schedule.filter(slot => {
    const matchesStatus = filter === "All" || slot.status === filter;
    const matchesSearch = slot.patient.toLowerCase().includes(search.toLowerCase()) ||
                          slot.service.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filterOptions = ["All", "In Session", "Waiting", "Completed", "Cancelled"];

  return (
    <main className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* ── HEADER AREA ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Daily Schedule</h2>
          <p className="text-sm text-slate-400 font-medium">View and manage today's appointments</p>
        </div>

        {search && (
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl w-fit">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              Results for: <span className="text-slate-800">"{search}"</span>
            </p>
          </div>
        )}
      </div>

      {/* ── TABLE CONTAINER ── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header: Local Search + Tabs */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name or service..." 
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-teal-400 transition-all bg-white" 
            />
          </div>

          <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit border border-slate-200">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  filter === opt 
                    ? "bg-white text-slate-800 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* ── THE TABLE ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {['Time', 'Patient', 'Service', 'Status'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSchedule.length > 0 ? (
                filteredSchedule.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 text-sm font-bold text-slate-700">{slot.time}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100">
                          {slot.patient.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-sm text-slate-800">{slot.patient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-tight">
                        {slot.service}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        slot.status === "Completed" ? "bg-green-100 text-green-700 border border-green-200" :
                        slot.status === "Waiting" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                        slot.status === "In Session" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                        "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                        {slot.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <p className="text-slate-400 font-medium italic text-sm">No appointments found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             Showing {filteredSchedule.length} of {schedule.length} total slots
           </p>
        </div>
      </section>
    </main>
  );
}
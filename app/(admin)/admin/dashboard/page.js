"use client";
import { useState } from "react";
import Link from "next/link";
import PulseCard from "@/components/ui/PulseCard";

export default function PlatformAdminDashboard() {
  const [search, setSearch] = useState("");

  const pendingClinics = [
    { id: 1, name: "City Care Plus", owner: "Dr. Alon", city: "Davao City", date: "2 hrs ago" },
    { id: 2, name: "Dermacare Cebu", owner: "Dr. Sanchez", city: "Cebu City", date: "5 hrs ago" },
    { id: 3, name: "Metro Health", owner: "Dr. Tan", city: "Manila", date: "1 day ago" },
  ];

  const topClinics = [
    { name: "Joseph Community Health", bookings: 420, growth: "+12%", color: "bg-teal-500" },
    { name: "Iligan Medical Center", bookings: 310, growth: "+8%", color: "bg-blue-500" },
    { name: "CDO Outpatient Clinic", bookings: 215, growth: "+5%", color: "bg-indigo-500" },
  ];

  return (
    <main className="min-h-screen bg-slate-100 font-sans pb-10">
      
      {/* ── UPGRADED ADMIN HEADER (Matches Clinic Density) ── */}
      <div className="relative bg-[#1a365d] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-teal-300 text-[11px] font-bold uppercase tracking-widest mb-1">Super Admin Portal</p>
            <h1 className="text-white text-2xl font-bold">Platform Overview</h1>
            <p className="text-slate-300 text-sm mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              System Status: <span className="text-green-400 font-semibold">All Systems Operational</span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Server Load Monitor */}
            <div className="hidden lg:block text-right">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Server Load</p>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 w-[32%]" />
                </div>
                <span className="text-white font-bold text-xs">32%</span>
              </div>
            </div>
            {/* Global Search */}
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Clinics/IDs..."
                  className="bg-white/10 border border-white/20 rounded-xl pl-4 pr-4 py-2 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20 transition-all w-48 lg:w-64"
                />
              </div>
              <button className="bg-teal-500 hover:bg-teal-400 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all">Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PulseCard title="Total Clinics" value="142" subtext="12 pending approval" icon="🏥" color="text-blue-600" iconBg="bg-blue-50" />
          <PulseCard title="Total Patients" value="8,432" subtext="+114 this week" icon="👥" color="text-teal-600" iconBg="bg-teal-50" />
          <PulseCard title="Active Bookings" value="1,205" subtext="Live across platform" icon="📅" color="text-indigo-600" iconBg="bg-indigo-50" />
          <PulseCard title="Net Revenue" value="₱250.8k" subtext="Commission (March)" icon="💰" color="text-emerald-600" iconBg="bg-emerald-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. APPROVAL QUEUE */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-bold text-slate-800">Clinic Approval Queue</h2>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">3 NEW</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Clinic Name</th>
                      <th className="px-6 py-4">Owner</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingClinics.map((clinic) => (
                      <tr key={clinic.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{clinic.name}</td>
                        <td className="px-6 py-4 text-slate-500">{clinic.owner}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-teal-700">Approve</button>
                          <button className="border border-slate-200 text-slate-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-red-50 hover:text-red-500">Review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 2. ANALYTICS GRID (New Section to match Clinic richness) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Growth Chart (Your existing SVG) */}
               <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">User Acquisition</h3>
                  <div className="relative h-32 w-full">
                    <svg className="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
                      <path d="M0,100 C100,100 150,40 250,50 C350,60 450,10 600,20" fill="none" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="600" cy="20" r="5" fill="#0d9488" stroke="#fff" strokeWidth="2" />
                    </svg>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase">
                      <span>Jan</span><span>Feb</span><span className="text-teal-600 font-black">March</span>
                    </div>
                  </div>
               </section>

               {/* Top Performing Clinics (New Content) */}
               <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">Top Performing Clinics</h3>
                  <div className="space-y-4">
                    {topClinics.map((clinic) => (
                      <div key={clinic.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-bold text-slate-700">{clinic.name}</span>
                          <span className="text-teal-600 font-bold">{clinic.growth}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`${clinic.color} h-full`} style={{ width: `${(clinic.bookings / 500) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
               </section>
            </div>
          </div>

          {/* RIGHT COLUMN (1/3) */}
          <aside className="space-y-6">

            {/* Audit Log */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[290px] flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 font-bold text-slate-800 text-sm">System Audit Log</div>
              <div className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar">
                {[
                  { user: "System", action: "Database Backup Completed", time: "1h ago", color: "border-teal-400" },
                  { user: "Admin", action: "Approved 'City Health'", time: "2h ago", color: "border-teal-400" },
                  { user: "System", action: "High Traffic Alert", time: "3h ago", color: "border-red-400" },
                ].map((log, i) => (
                  <div key={i} className={`flex gap-3 items-start border-l-2 ${log.color} pl-3 py-1`}>
                    <div>
                      <p className="text-[11px] text-slate-800 font-bold">{log.action}</p>
                      <p className="text-[10px] text-slate-400 uppercase">{log.user} · {log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 bg-slate-50 text-[10px] font-bold text-slate-400 hover:text-teal-600 transition-colors border-t border-slate-100 uppercase">
                View All Logs
              </button>
            </section>

            {/* Revenue Widget */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Revenue Breakdown</h3>
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full border-[6px] border-teal-500 border-r-slate-100 rotate-45" />
                 <div>
                    <p className="text-lg font-black text-slate-800">₱250,890</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Total Platform Fees</p>
                 </div>
              </div>
            </section>
          </aside>

        </div>
      </div>
    </main>
  );
}
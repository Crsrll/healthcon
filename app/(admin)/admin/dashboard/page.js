"use client";
import { useState } from "react";
import Link from "next/link";
import PulseCard from "@/components/ui/PulseCard";
import { Home, Clock, Building2, Stethoscope, Users, Calendar, Settings, Flag, CalendarCheck, Banknote  } from "lucide-react";
import SidebarWrapper from "@/components/dashboard/SidebarWrapper";

export default function PlatformAdminDashboard() {
  const [mode, setMode] = useState("Dashboard");
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

const buttons = [
  { label: "Dashboard", icon: <Home size={20} /> },
  { label: "Pending Clinics", icon: <Clock size={20} /> },
  { label: "Clinics", icon: <Building2 size={20} /> },
  { label: "Doctors", icon: <Stethoscope size={20} /> },
  { label: "Users", icon: <Users size={20} /> },
  { label: "Bookings", icon: <Calendar size={20} /> },
  { label: "System Settings", icon: <Settings size={20} /> },
  { label: "Reports & Flagged", icon: <Flag size={20} /> }
];

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* ── 1. TOP HEADER (Full Width) ── */}
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
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Clinics/IDs..."
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20 w-64"
            />
            <button className="bg-teal-500 hover:bg-teal-400 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all">Search</button>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN LAYOUT (Sidebar + Content) ── */}
      <div className="flex">
        {/* Sidebar */}
        <SidebarWrapper mode={mode} setMode={setMode} buttons={buttons} />

        {/* Content Area */}
        <div className="flex-1 p-8">
          {mode === "Dashboard" && (
            <main className="space-y-8 animate-in fade-in duration-500">
              
              {/* KPI CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">  
                <PulseCard title="Total Clinics" value="142" valueClass="text-2xl" subtext="12 pending approval" icon={<Building2 size={24} />} color="text-blue-600" iconBg="bg-blue-50" border="border-blue-200" />
                <PulseCard title="Total Users"value="10,390" valueClass="text-2xl" subtext="Patients and Clinics" icon={<Users size={24} />} color="text-emerald-600" iconBg="bg-emerald-50" border="border-emerald-200" />
                <PulseCard title="Active Bookings" value="1,205" valueClass="text-2xl" subtext="Live across platform" icon={<CalendarCheck size={24} />} color="text-indigo-600" iconBg="bg-indigo-50" border="border-indigo-200" />
                <PulseCard title="Revenue" value="₱250.8k" valueClass="text-2xl" subtext="Commission (March)" icon={<Banknote size={24} />} color="text-emerald-600" iconBg="bg-emerald-50" border="border-emerald-200" />
              </div>

              {/* MIDDLE GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* APPROVAL QUEUE */}
                  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h2 className="font-bold text-slate-800">Clinic Approval Queue</h2>
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">3 NEW</span>
                    </div>
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                        <tr>
                          <th className="px-6 py-4">Clinic Name</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pendingClinics.map((clinic) => (
                          <tr key={clinic.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-700">{clinic.name}</td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase">Approve</button>
                              <button className="border border-slate-200 text-slate-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase">Review</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>

                  {/* 2. ANALYTICS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Revenue Breakdown / Coverage */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Revenue Breakdown</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-[6px] border-teal-500 border-r-slate-100 rotate-45 shrink-0" />
                <div>
                  <p className="text-lg font-black text-slate-800">₱250,890</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Total Platform Fees</p>
                </div>
              </div>
              {/* Breakdown rows */}
              <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
                {[
                  { label: "Subscription Fees", amount: "₱148,200", pct: 59, color: "bg-teal-500" },
                  { label: "Booking Commissions", amount: "₱72,450", pct: 29, color: "bg-blue-400" },
                  { label: "Premium Listings", amount: "₱30,240", pct: 12, color: "bg-indigo-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 font-semibold">{item.label}</span>
                      <span className="text-slate-500 font-bold">{item.amount}</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">Top Performing Clinics</h3>
                      <div className="space-y-4">
                        {topClinics.map((clinic) => (
                          <div key={clinic.name}>
                            <div className="flex justify-between text-xs mb-1 font-bold text-slate-700">
                              <span>{clinic.name}</span>
                              <span className="text-teal-600">{clinic.growth}</span>
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

                {/* SIDEBAR LOGS & GROWTH */}
                <aside className="space-y-6">
                  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[300px] flex flex-col overflow-hidden text-xs">
                    <div className="px-5 py-4 border-b border-slate-100 font-bold text-slate-800 uppercase tracking-widest text-[10px]">System Audit Log</div>
                    <div className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar">
                      {[
                        { action: "DB Backup Completed", time: "1h ago", color: "border-teal-400" },
                        { action: "Clinic Approved", time: "2h ago", color: "border-teal-400" },
                        { action: "High Traffic Alert", time: "3h ago", color: "border-red-400" },
                      ].map((log, i) => (
                        <div key={i} className={`border-l-2 ${log.color} pl-3 py-0.5`}>
                          <p className="font-bold text-slate-800">{log.action}</p>
                          <p className="text-slate-400 uppercase font-semibold text-[9px]">{log.time}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* USER GROWTH LEGIT GRAPH */}
                  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[300px] flex flex-col p-5">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-slate-800 font-bold text-sm">User Growth</h3>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Last 3 Months</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span className="text-[9px] text-slate-500 font-bold uppercase">Patients</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                          <span className="text-[9px] text-slate-500 font-bold uppercase">Clinics</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex-1 group">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                        {/* 1. Definitions for Gradients */}
                        <defs>
                          <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="clinicGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {[0, 25, 50, 75, 100].map((line) => (
                          <line key={line} x1="0" y1={line} x2="300" y2={line} stroke="#f1f5f9" strokeWidth="1" />
                        ))}

                        <path
                          d="M0,80 C50,75 100,30 150,40 S250,5 300,10 L300,100 L0,100 Z"
                          fill="url(#patientGradient)"
                        />
                        <path
                          d="M0,80 C50,75 100,30 150,40 S250,5 300,10"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />

                        <path
                          d="M0,95 C50,90 100,60 150,70 S250,40 300,50 L300,100 L0,100 Z"
                          fill="url(#clinicGradient)"
                        />
                        <path
                          d="M0,95 C50,90 100,60 150,70 S250,40 300,50"
                          fill="none"
                          stroke="#14b8a6"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="4 2"
                        />

                        <circle cx="300" cy="10" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                        <circle cx="300" cy="50" r="4" fill="#14b8a6" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="flex justify-between mt-4 border-t border-slate-50 pt-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Patient</p>
                          <p className="text-xs font-black text-blue-600">+24%</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Clinic</p>
                          <p className="text-xs font-black text-teal-600">+12%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-300 uppercase">Mar 2026</span>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            </main>
          )}

          
          {mode !== "Dashboard" && (
            <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest">Entering {mode} Section...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
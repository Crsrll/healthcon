"use client";
import { useState } from "react";
import Link from "next/link";
import PulseCard from "@/components/ui/PulseCard";
import Modal from "@/components/ui/Modal";
import { Home, Clock, Building2, Stethoscope, Users, Calendar, Settings, Flag, CalendarCheck, Banknote, AlertCircle  } from "lucide-react";
import SidebarWrapper from "@/components/dashboard/SidebarWrapper";

export default function PlatformAdminDashboard() {
  const [mode, setMode] = useState("Dashboard");
  const [search, setSearch] = useState("");

  // 2. Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);

  const pendingClinics = [
    { id: 1, name: "City Care Plus", owner: "Dr. Alon", city: "Davao City", date: "2 hrs ago" },
    { id: 2, name: "Dermacare Cebu", owner: "Dr. Sanchez", city: "Cebu City", date: "5 hrs ago" },
    { id: 3, name: "Metro Health", owner: "Dr. Tan", city: "Manila", date: "1 day ago" },
  ];

  // Logic to open modal and save which clinic was selected
  const handleApproveClick = (clinic) => {
    setSelectedClinic(clinic);
    setIsModalOpen(true);
  };

  const topClinics = [
    { name: "Joseph Community Health", bookings: 420, growth: "+12%", color: "bg-teal-500" },
    { name: "Iligan Medical Center", bookings: 310, growth: "+8%", color: "bg-blue-500" },
    { name: "CDO Outpatient Clinic", bookings: 215, growth: "+5%", color: "bg-indigo-500" },
  ];

  const auditLogs = [
    { action: "Database Backup Completed", time: "1h ago", color: "border-teal-400" },
    { action: "Admin Approved 'City Health'", time: "2h ago", color: "border-teal-400" },
    { action: "System: High Traffic Alert", time: "3h ago", color: "border-red-400" },
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
      {/* ── 1. TOP HEADER ── */}
      <div className="relative bg-healthcon-blue overflow-hidden">
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

      <div className="flex">
        <SidebarWrapper mode={mode} setMode={setMode} buttons={buttons} />

        <div className="flex-1 p-8">
          {mode === "Dashboard" && (
            <main className="space-y-8 animate-in fade-in duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">  
                <PulseCard title="Total Clinics" value="142" subtext="12 pending approval" icon={<Building2 size={24} />} color="text-blue-600" iconBg="bg-blue-50" />
                <PulseCard title="Total Users" value="10,390" subtext="Patients and Clinics" icon={<Users size={24} />} color="text-emerald-600" iconBg="bg-emerald-50" />
                <PulseCard title="Active Bookings" value="1,205" subtext="Live across platform" icon={<CalendarCheck size={24} />} color="text-indigo-600" iconBg="bg-indigo-50" />
                <PulseCard title="Revenue" value="₱250.8k" subtext="Commission (March)" icon={<Banknote size={24} />} color="text-emerald-600" iconBg="bg-emerald-50" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
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
                            <td className="px-6 py-4 text-slate-500 text-xs">{clinic.owner}</td>
                            <td className="px-6 py-4 text-slate-500 text-xs">{clinic.city}</td>
                            <td className="px-6 py-4 text-slate-400 text-xs">{clinic.date}</td>
                            <td className="px-6 py-4 flex items-center gap-2">
                              {/* 3. Trigger Modal on Click */}
                              <button 
                                onClick={() => handleApproveClick(clinic)}
                                className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-teal-700 transition-all"
                              >
                                Approve
                              </button>
                              <button className="border border-slate-200 text-slate-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-red-50">Review</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-bold text-slate-800 text-sm mb-4">Revenue Breakdown</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-[6px] border-teal-500 border-r-slate-100 rotate-45 shrink-0" />
                            <div>
                                <p className="text-lg font-black text-slate-800">₱250,890</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Total Platform Fees</p>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
                            {[{ label: "Subscription Fees", amount: "₱148,200", pct: 59, color: "bg-teal-500" }, { label: "Booking Commissions", amount: "₱72,450", pct: 29, color: "bg-blue-400" }].map((item) => (
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
                      <div className="space-y-4 text-xs">
                        {topClinics.map((clinic) => (
                          <div key={clinic.name}>
                            <div className="flex justify-between mb-1 font-bold text-slate-700 uppercase tracking-tighter">
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

                <aside className="space-y-6">
                  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[295px] overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                      <h3 className="font-bold text-slate-800 text-sm">System Audit Log</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Live</span>
                      </div>
                    </div>

                    <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-scrollbar">
                      {auditLogs.map((log, i) => (
                        <div key={i} className={`border-l-2 ${log.color || 'border-slate-200'} pl-4 py-1`}>
                          <p className="font-bold text-slate-700 text-[13px]">{log.action}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-tighter">{log.time} • Node 01</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* LEGIT USER GROWTH GRAPH */}
                  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm h-75 flex flex-col p-5">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-slate-800 font-bold text-sm">User Growth</h3>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Trend Analytics</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-[8px] font-black uppercase">
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Patients</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> Clinics</div>
                      </div>
                    </div>
                    <div className="relative flex-1 group">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0" /></linearGradient>
                          <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" /><stop offset="100%" stopColor="#14b8a6" stopOpacity="0" /></linearGradient>
                        </defs>
                        <path d="M0,80 C50,75 100,30 150,40 S250,5 300,10 L300,100 L0,100 Z" fill="url(#pGrad)" />
                        <path d="M0,80 C50,75 100,30 150,40 S250,5 300,10" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                        <path d="M0,95 C50,90 100,60 150,70 S250,40 300,50 L300,100 L0,100 Z" fill="url(#cGrad)" />
                        <path d="M0,95 C50,90 100,60 150,70 S250,40 300,50" fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 2" />
                        <circle cx="300" cy="10" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" /><circle cx="300" cy="50" r="4" fill="#14b8a6" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="flex justify-between mt-4 border-t border-slate-50 pt-3">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last 30 Days</p>
                        <p className="text-xs font-black text-teal-600">+18.4%</p>
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

      {/* 4. THE MODAL COMPONENT (At the very bottom) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Approve Clinic Registration"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <AlertCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">Clinic Verification</p>
              <h4 className="text-base font-black text-slate-800">{selectedClinic?.name}</h4>
            </div>
          </div>

          <p className="text-sm text-slate-500 leading-relaxed">
            By clicking <span className="font-bold text-slate-800 underline decoration-teal-400">Confirm Approval</span>, this clinic will be officially registered on the platform and become visible to all patients.
          </p>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => {
                console.log("Approved", selectedClinic?.id);
                setIsModalOpen(false);
              }}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-2xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-teal-900/20 transition-all"
            >
              Confirm Approval
            </button>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
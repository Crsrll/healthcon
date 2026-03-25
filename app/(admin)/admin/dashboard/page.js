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

  return (
    <main className="min-h-screen bg-slate-100 font-sans pb-10">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* TOP KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <PulseCard 
            title="Partner Clinics" value="142" subtext="Global user base"
            icon="🏥" color="text-blue-600" iconBg="bg-blue-50"
          />
          <PulseCard 
            title="Active Patients" value="8,432" subtext="+12 this month"
            icon="👥" color="text-teal-600" iconBg="bg-teal-50"
          />
          <PulseCard 
            title="Total Bookings" value="24.5k" subtext="All-time volume"
            icon="📅" color="text-indigo-600" iconBg="bg-indigo-50"
          />
          <PulseCard 
            title="Platform Rev" value="₱128k" subtext="Commission (Mar)"
            icon="💰" color="text-emerald-600" iconBg="bg-emerald-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Table and Chart (2 Columns Wide) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. APPROVAL QUEUE TABLE */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Pending Clinic Approvals</h2>
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase">Requires Action</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Clinic Name</th>
                      <th className="px-6 py-4">Owner</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingClinics.map((clinic) => (
                      <tr key={clinic.id} className="hover:bg-slate-50 transition-colors text-slate-600">
                        <td className="px-6 py-4 font-bold text-slate-800">{clinic.name}</td>
                        <td className="px-6 py-4">{clinic.owner}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="text-[10px] font-bold bg-teal-500 text-white px-3 py-1.5 rounded-lg hover:bg-teal-600">Approve</button>
                          <button className="text-[10px] font-bold bg-white text-slate-400 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-red-50">Review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 2. MANUAL SVG CLINIC GROWTH CHART */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-slate-800 font-bold">Clinic Growth</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Acquisition Trend</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100">
                  +15.4% Monthly
                </div>
              </div>

              {/* The "Unstretched" SVG Container */}
              <div className="relative w-full h-50">
                <svg className="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
                  {/* Background Grid Lines */}
                  {[0, 30, 60, 90, 120].map((y) => (
                    <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                  ))}

                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* The Fill Area (Bottom Shadow) */}
                  <path 
                    d="M0,100 C100,100 150,40 250,50 C350,60 450,10 600,20 L600,120 L0,120 Z" 
                    fill="url(#chartGradient)" 
                  />

                  {/* The Smooth Wavy Line */}
                  <path 
                    d="M0,100 C100,100 150,40 250,50 C350,60 450,10 600,20" 
                    fill="none" 
                    stroke="#0d9488" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />

                  {/* Data Points (Dots) */}
                  <circle cx="250" cy="50" r="5" fill="#0d9488" stroke="#fff" strokeWidth="2" />
                  <circle cx="600" cy="20" r="5" fill="#0d9488" stroke="#fff" strokeWidth="2" />
                </svg>

                {/* Labels outside SVG to keep them crisp */}
                <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase px-1">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span className="text-teal-600 font-black">March (Today)</span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Sidebar (1 Column Wide) */}
          <aside className="space-y-6">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[350px] flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 font-bold text-slate-800 text-sm">System Audit Log</div>
              <div className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar">
                {[
                  { user: "System", action: "DB Backup Completed", time: "1h ago", color: "border-teal-400" },
                  { user: "Dr. Reyes", action: "New Clinic: 'Smile Dental'", time: "2h ago", color: "border-blue-400" },
                  { user: "Admin", action: "Approved 'City Health'", time: "4h ago", color: "border-teal-400" },
                  { user: "System", action: "Patch 2.4 Applied", time: "5h ago", color: "border-amber-400" },
                ].map((log, i) => (
                  <div key={i} className={`flex gap-3 items-start border-l-2 ${log.color} pl-3 py-1 transition-colors hover:bg-slate-50`}>
                    <div>
                      <p className="text-[11px] text-slate-800 font-bold">{log.action}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">{log.user} · {log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 bg-slate-50 text-[10px] font-bold text-slate-400 hover:text-teal-600 transition-colors border-t border-slate-100 uppercase">
                View All Logs
              </button>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Revenue by Tier</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-medium uppercase">Pro Clinics (70%)</span>
                    <span className="font-bold text-slate-800 underline decoration-teal-300">₱89,600</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[70%] h-full bg-teal-500 rounded-full" />
                  </div>
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-medium uppercase">Basic (30%)</span>
                    <span className="font-bold text-slate-800">₱38,400</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[30%] h-full bg-[#1a365d] rounded-full" />
                  </div>
                </div>
              </div>
            </section>
          </aside>

        </div>
      </div>
    </main>
  );
}
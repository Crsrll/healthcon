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

  const recentActivity = [
    { clinic: "Joseph Community Health", action: "New appointment booked", time: "2 min ago", type: "booking" },
    { clinic: "Dermacare Cebu", action: "Patient registered", time: "8 min ago", type: "patient" },
    { clinic: "Metro Health", action: "Schedule updated", time: "15 min ago", type: "schedule" },
    { clinic: "City Care Plus", action: "New inquiry received", time: "22 min ago", type: "inquiry" },
    { clinic: "Iligan Medical Center", action: "Doctor profile updated", time: "1 hr ago", type: "profile" },
  ];

  const activityDot = {
    booking: "bg-teal-400",
    patient: "bg-blue-400",
    schedule: "bg-indigo-400",
    inquiry: "bg-amber-400",
    profile: "bg-slate-300",
  };

  const regionStats = [
    { region: "Mindanao", clinics: 58, pct: 82 },
    { region: "Visayas", clinics: 41, pct: 61 },
    { region: "Luzon", clinics: 43, pct: 64 },
  ];

  const quickStats = [
    { label: "Avg. Rating", value: "4.8", sub: "Across all clinics", icon: "★", color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Uptime", value: "99.9%", sub: "Last 30 days", icon: "◈", color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Avg. Response", value: "1.2h", sub: "Clinic reply time", icon: "◷", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Cancellations", value: "3.2%", sub: "Down from 4.1%", icon: "↓", color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <main className="min-h-screen bg-slate-100 font-sans pb-10">

      {/* ── HEADER (untouched) ── */}
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
            <div className="hidden lg:block text-right">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Server Load</p>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 w-[32%]" />
                </div>
                <span className="text-white font-bold text-xs">32%</span>
              </div>
            </div>
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

        {/* MAIN GRID */}
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

            {/* 2. ANALYTICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Growth Chart */}
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

              {/* Top Performing Clinics */}
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

          </aside>
        </div>

        {/* ── BOTTOM ROW: EVEN CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Quick Platform Stats */}
          {quickStats.map((stat) => (
            <section key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start justify-between hover:shadow-md transition-all group">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800 leading-none">{stat.value}</p>
                <p className="text-[11px] text-slate-400 mt-1.5">{stat.sub}</p>
              </div>
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shrink-0 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </section>
          ))}
        </div>

        {/* ── SECOND BOTTOM ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Live Platform Activity Feed */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Live Activity Feed</h3>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-bold text-green-500 uppercase">Live</span>
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {recentActivity.map((item, i) => (
                <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activityDot[item.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-700 truncate">{item.clinic}</p>
                    <p className="text-[11px] text-slate-400 truncate">{item.action}</p>
                  </div>
                  <span className="text-[10px] text-slate-300 shrink-0 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-slate-50 text-[10px] font-bold text-slate-400 hover:text-teal-600 transition-colors border-t border-slate-100 uppercase">
              View Full Feed
            </button>
          </section>

          {/* Clinic Coverage by Region */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-5">Clinic Coverage by Region</h3>
            <div className="space-y-5">
              {regionStats.map((r) => (
                <div key={r.region}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-700">{r.region}</span>
                    <span className="text-slate-400 font-semibold">{r.clinics} clinics</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 text-center gap-2">
              <div>
                <p className="text-base font-black text-slate-800">142</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Total</p>
              </div>
              <div>
                <p className="text-base font-black text-teal-600">130</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Active</p>
              </div>
              <div>
                <p className="text-base font-black text-amber-500">12</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Pending</p>
              </div>
            </div>
          </section>

          {/* Admin Quick Actions */}
          <section className="bg-[#1a365d] rounded-2xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 bg-teal-400 rounded-full" />
                <h3 className="font-bold text-sm">Admin Actions</h3>
              </div>
              <div className="space-y-2.5">
                <button className="w-full bg-teal-500 hover:bg-teal-400 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add New Clinic
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/15 py-2.5 rounded-xl font-bold text-sm transition-all">
                  Broadcast Announcement
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/15 py-2.5 rounded-xl font-bold text-sm transition-all">
                  Export Platform Report
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/15 py-2.5 rounded-xl font-bold text-sm transition-all">
                  Manage Permissions
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
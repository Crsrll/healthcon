"use client";
import { useState } from "react";
import Link from "next/link";

export default function ClinicDashboard() {
    const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("queue");

  const stats = [
    {
      label: "Today's Appointments",
      value: "12",
      sub: "2 more than yesterday",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      ),
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Pending Requests",
      value: "5",
      sub: "Needs your review",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Inquiries",
      value: "3",
      sub: "2 unread messages",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
      ),
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-100",
    },
    {
      label: "Completed Today",
      value: "7",
      sub: "of 12 appointments",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
    },
  ];

  const todayAppointments = [
    { id: 1, time: "09:00 AM", patient: "John Wick", service: "Consultation", status: "Completed" },
    { id: 2, time: "10:30 AM", patient: "Melissa Doe", service: "Check-up", status: "In Session" },
    { id: 3, time: "11:15 AM", patient: "Sarah Connor", service: "X-Ray", status: "Waiting" },
    { id: 4, time: "01:30 PM", patient: "Bruce Wayne", service: "Follow-up", status: "Scheduled" },
  ];

  const recentInquiries = [
    { id: 1, user: "Peter Parker", initials: "PP", msg: "Are you open on Saturdays?", time: "10 mins ago", unread: true },
    { id: 2, user: "Diana Prince", initials: "DP", msg: "Can I reschedule my check-up?", time: "1 hour ago", unread: true },
    { id: 3, user: "Clark Kent", initials: "CK", msg: "What are your available slots?", time: "3 hours ago", unread: false },
  ];

  const statusStyle = {
    Completed: "bg-green-100 text-green-700",
    "In Session": "bg-blue-100 text-blue-700",
    Waiting: "bg-amber-100 text-amber-700",
    Scheduled: "bg-slate-100 text-slate-500",
  };

  const progressPct = Math.round((7 / 12) * 100);

  return (
    <div className="min-h-screen bg-slate-100 font-sans">

      {/* ── PAGE HEADER BANNER ── */}
      <div className="relative bg-[#1a365d] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-300 text-[11px] font-bold uppercase tracking-widest mb-1">Clinic Portal</p>
              <h1 className="text-white text-2xl font-bold">Joseph Community Health</h1>
              <p className="text-slate-300 text-sm mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                Monday, March 23 · Clinic is <span className="text-teal-300 font-semibold ml-1">Open</span>
              </p>
            </div>

            {/* Progress ring area */}
            <div className="hidden sm:flex items-center gap-6">
              {/* Daily progress */}
              <div className="text-right">
                <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Daily Progress</p>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm">7/12</span>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-600" />
              {/* Quick action */}
              <div className="mt-6 flex gap-2 max-w-xxl">
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Patients..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20 focus:border-teal-400/60 transition-all"
              />
            </div>
            <button className="bg-teal-500 hover:bg-teal-400 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md shadow-teal-900/30">
              Search
            </button>
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white rounded-2xl border ${stat.border} shadow-sm p-5 flex items-start justify-between hover:shadow-md transition-all group`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800 mt-1 leading-none">{stat.value}</p>
                <p className="text-[11px] text-slate-400 mt-1.5">{stat.sub}</p>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Queue Table & Analytics (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
        
        {/* TODAY'S QUEUE */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <h2 className="font-bold text-slate-800">Today's Queue</h2>
                <span className="bg-[#1a365d] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {todayAppointments.length}
                </span>
            </div>
            <Link href="/clinic/schedule" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
                View Calendar
            </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                    {["Time", "Patient", "Service", "Status", "Action"].map((h) => (
                    <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {h}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {todayAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-700 text-sm">{apt.time}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{apt.patient}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{apt.service}</td>
                    <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusStyle[apt.status]}`}>
                        {apt.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">•••</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </section>

        {/* MINI ANALYTICS SECTION */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. WEEKLY PATIENT VOLUME (Line Chart) */}
            <div>
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Weekly patient volume</h3>
                <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-lg">This week</span>
                </div>
                
                {/* Simple SVG Line Chart */}
                <div className="relative h-32 w-full mt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <line x1="0" y1="0" x2="300" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="25" x2="300" y2="25" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="75" x2="300" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                    
                    {/* The Line */}
                    <path
                    d="M0,60 Q25,40 50,45 T100,65 T150,30 T200,55 T250,80 T300,45"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="3"
                    strokeLinecap="round"
                    />
                    {/* Dots */}
                    <circle cx="0" cy="60" r="4" fill="#0d9488" />
                    <circle cx="50" cy="45" r="4" fill="#0d9488" />
                    <circle cx="150" cy="30" r="4" fill="#0d9488" />
                    <circle cx="300" cy="45" r="4" fill="#0d9488" />
                </svg>
                
                {/* X-Axis Labels */}
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span className="text-teal-600">Today</span>
                </div>
                </div>
            </div>

            {/* 2. TOP SERVICES (Progress Bars) */}
            <div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">Top Services</h3>
                <div className="space-y-4">
                {[
                    { name: "Dental Checkup", count: 42, color: "bg-teal-500", total: 50 },
                    { name: "Cleaning", count: 31, color: "bg-blue-500", total: 50 },
                    { name: "Tooth Extraction", count: 21, color: "bg-orange-500", total: 50 },
                    { name: "Braces Adjust", count: 17, color: "bg-amber-500", total: 50 },
                ].map((service) => (
                    <div key={service.name}>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-slate-700">{service.name}</span>
                        <span className="text-xs font-bold text-slate-400">{service.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                        className={`h-full ${service.color} rounded-full`} 
                        style={{ width: `${(service.count / service.total) * 100}%` }}
                        />
                    </div>
                    </div>
                ))}
                </div>
            </div>

            </div>
        </section>
        </div>
          {/* RIGHT — Sidebar */}
          <div className="space-y-5">

            {/* QUICK ACTIONS */}
            <section className="bg-[#1a365d] rounded-2xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative">    
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-teal-400 rounded-full" />
                  <h3 className="font-bold text-sm">Quick Actions</h3>
                </div>
                <div className="space-y-2.5">
                  <button className="w-full bg-teal-500 hover:bg-teal-400 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New Appointment
                  </button>
                  <button className="w-full bg-teal-500 hover:bg-teal-400 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add a New Doctor
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-white/15 py-2.5 rounded-xl font-bold text-sm transition-all">
                    Manage Schedule
                  </button>
                </div>
              </div>
            </section>

            {/* RECENT INQUIRIES */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Recent Inquiries</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-red-500 uppercase">2 New</span>
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`p-4 cursor-pointer transition-colors group ${inq.unread ? "hover:bg-teal-50/50" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${inq.unread ? "bg-[#1a365d] text-white" : "bg-slate-100 text-slate-500"}`}>
                        {inq.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className={`text-xs font-bold truncate ${inq.unread ? "text-slate-800" : "text-slate-500"}`}>
                            {inq.user}
                          </p>
                          <span className="text-[9px] text-slate-400 shrink-0 ml-2">{inq.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{inq.msg}</p>
                        {inq.unread && (
                          <button className="mt-1.5 text-[10px] font-bold text-teal-600 hover:text-teal-500 uppercase tracking-wide">
                            Reply →
                          </button>
                        )}
                      </div>
                      {inq.unread && (
                        <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                <button className="text-xs font-semibold text-slate-400 hover:text-teal-600 transition-colors w-full text-center">
                  View All Inquiries →
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
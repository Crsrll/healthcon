"use client";
import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, Clock, Sidebar } from "lucide-react";
import SidebarWrapper from "@/components/dashboard/SidebarWrapper";
import PulseCard from "@/components/ui/PulseCard";

export default function ClinicDashboard() {
  const [mode, setMode] = useState("Dashboard");
    const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const buttons = [
    { label: "Dashboard", icon: <Home size={20} /> },
    { label: "Edit", icon: <Pencil size={20}/> },
    { label: "Doctors", icon: <User size={20}/> },
    { label: "Booking", icon: <Calendar size={20}/> },
    { label: "Inquiries", icon: <MessageCircle size={20}/> }
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
      <div className="relative bg-healthcon-blue overflow-hidden">
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

      <div className="flex">
        <SidebarWrapper mode={mode} setMode={setMode} buttons={buttons}>
            </SidebarWrapper>   

      {/* ── MAIN CONTENT ── */}
      
      {mode === "Dashboard" &&
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">  
          <PulseCard title="Today's Appointments" value="12 size={30}" subtext="2 more than yesterday" icon={<CalendarCheck size={24} />} color="text-blue-600" iconBg="bg-blue-50" border="border-blue-100"/>
          <PulseCard title="Pending Requests" value="5 size={30}" subtext="Needs your review" icon={<Clock size={24} />} color="text-amber-600" iconBg="bg-amber-50" border="border-amber-100"/>
          <PulseCard title="Inquiries" value ="3 size={30}" subtext="2 unread messages" icon={<MessageCircle size={24} />} color="text-teal-600" iconBg="bg-teal-50" border="border-teal-100"/>
          <PulseCard title="Completed Today" value="7 size={30}" subtext="of 12 appointments" icon={<CheckCircle2 size={24} />} color="text-green-600" iconBg="bg-green-50" border="border-green-100"/>
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
                <span className="bg-healthcon-blue text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
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
            <section className="bg-healthcon-blue rounded-2xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${inq.unread ? "bg-healthcon-blue text-white" : "bg-slate-100 text-slate-500"}`}>
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
      </main>}

{mode === "Edit" && (
  <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Clinic Information</h2>
        <p className="text-xs text-slate-400 mt-0.5">Update your clinic's public profile</p>
      </div>
      <button className="bg-healthcon-blue hover:bg-blue-800 text-white text-sm
                         font-semibold px-5 py-2.5 rounded-xl transition-colors">
        Save Changes
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT — main form */}
      <div className="lg:col-span-2 space-y-4">

        {/* Basic info */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Clinic Name
              </label>
              <input
                defaultValue="Joseph Community Health"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                           text-slate-800 outline-none focus:border-teal-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Location / City
              </label>
              <input
                defaultValue="Dapitan"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                           text-slate-800 outline-none focus:border-teal-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Contact Number
              </label>
              <input
                defaultValue="(065) 123-4567"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                           text-slate-800 outline-none focus:border-teal-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Email Address
              </label>
              <input
                defaultValue="joseph@healthcon.ph"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                           text-slate-800 outline-none focus:border-teal-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Full Address
            </label>
            <input
              defaultValue="Sunrise St., Dapitan City, Zamboanga del Norte"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                         text-slate-800 outline-none focus:border-teal-400 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              About / Description
            </label>
            <textarea
              rows={4}
              defaultValue="A community health clinic serving Dapitan City and nearby areas."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                         text-slate-800 outline-none focus:border-teal-400 transition-colors
                         resize-none"
            />
          </div>
        </section>

        {/* Operating hours */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Operating Hours
          </h3>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <div key={day} className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 w-24 shrink-0">{day}</span>
              <input
                defaultValue={day === 'Sunday' ? 'Closed' : '8:00 AM'}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm
                           text-slate-800 outline-none focus:border-teal-400 transition-colors"
              />
              <span className="text-slate-400 text-sm shrink-0">to</span>
              <input
                defaultValue={day === 'Sunday' ? 'Closed' : '5:00 PM'}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm
                           text-slate-800 outline-none focus:border-teal-400 transition-colors"
              />
            </div>
          ))}
        </section>

      </div>

      {/* RIGHT — specializations + services */}
      <div className="space-y-4">

        {/* Specializations */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Specializations
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {['Internal Medicine', 'General Practice'].map(s => (
              <span key={s}
                className="flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs
                           font-semibold rounded-full px-3 py-1.5">
                {s}
                <button className="text-teal-400 hover:text-red-400 transition-colors">✕</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Add specialization..."
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm
                         outline-none focus:border-teal-400 transition-colors"
            />
            <button className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold
                               px-3 py-2 rounded-lg transition-colors">
              +
            </button>
          </div>
        </section>

        {/* Services */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Services Offered
          </h3>
          <div className="space-y-2 mb-3">
            {['General Consultation', 'Laboratory Services', 'Minor Surgery'].map(s => (
              <div key={s}
                className="flex items-center justify-between text-sm py-1.5
                           border-b border-slate-50 last:border-0">
                <span className="text-slate-700">{s}</span>
                <button className="text-slate-300 hover:text-red-400 transition-colors text-xs">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Add service..."
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm
                         outline-none focus:border-teal-400 transition-colors"
            />
            <button className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold
                               px-3 py-2 rounded-lg transition-colors">
              +
            </button>
          </div>
        </section>

        {/* Status toggle */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Clinic Status
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Currently Open</p>
              <p className="text-xs text-slate-400 mt-0.5">Visible in the public directory</p>
            </div>
            <div className="w-11 h-6 bg-teal-500 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </div>
        </section>

      </div>
    </div>
  </main>
)}

{mode === "Doctors" && (
  <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Manage Doctors</h2>
        <p className="text-xs text-slate-400 mt-0.5">Add, edit, or toggle doctor availability</p>
      </div>
      <button className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold
                         px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}
             viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Add Doctor
      </button>
    </div>

    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400
                         fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Search doctors..."
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm
                       outline-none focus:border-teal-400 transition-colors"
          />
        </div>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {['Doctor', 'Specialization', 'Schedule', 'Availability', 'Actions'].map(h => (
              <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400
                                     uppercase tracking-widest">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[
            { id: '1', name: 'Dr. Ben Villanueva',  spec: 'Internal Medicine', schedule: 'Mon–Fri, 8AM–12PM',  available: true  },
            { id: '2', name: 'Dr. Claire Mendoza',  spec: 'Ob-Gyne',           schedule: 'Tue, Thu, 1PM–5PM', available: true  },
            { id: '3', name: 'Dr. Paolo Gutierrez', spec: 'General Practice',  schedule: 'Mon, Wed, Fri',      available: false },
          ].map(doc => (
            <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors group">

              {/* Doctor */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold
                                  text-sm flex items-center justify-center shrink-0">
                    {doc.name.split(' ')[1]?.[0]}
                  </div>
                  <span className="font-semibold text-sm text-slate-800">{doc.name}</span>
                </div>
              </td>

              {/* Spec */}
              <td className="px-6 py-4">
                <span className="text-xs font-semibold bg-teal-50 text-teal-700
                                 rounded-full px-2.5 py-1">
                  {doc.spec}
                </span>
              </td>

              {/* Schedule */}
              <td className="px-6 py-4 text-sm text-slate-500">{doc.schedule}</td>

              {/* Toggle */}
              <td className="px-6 py-4">
                <button
                  className={`w-10 h-5 rounded-full relative transition-colors
                              ${doc.available ? 'bg-teal-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow
                                   transition-all
                                   ${doc.available ? 'left-5' : 'left-0.5'}`} />
                </button>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100
                                transition-opacity">
                  <button className="text-xs font-semibold text-slate-500 hover:text-blue-600
                                     bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg
                                     transition-colors">
                    Edit
                  </button>
                  <button className="text-xs font-semibold text-slate-500 hover:text-red-600
                                     bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-lg
                                     transition-colors">
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  </main>
)}

{mode === "Booking" && (
  <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Bookings</h2>
        <p className="text-xs text-slate-400 mt-0.5">Review, accept, or decline booking requests</p>
      </div>

      {/* Filter tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
                        ${activeTab === tab
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>

    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {['Patient', 'Doctor', 'Service', 'Date & Time', 'Status', 'Actions'].map(h => (
              <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400
                                     uppercase tracking-widest">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[
            { id: 1, patient: 'John Wick',     doctor: 'Dr. Ben Villanueva',  service: 'Consultation', date: 'Mar 24, 9:00 AM',  status: 'Pending'   },
            { id: 2, patient: 'Sarah Connor',  doctor: 'Dr. Claire Mendoza',  service: 'Check-up',     date: 'Mar 24, 10:30 AM', status: 'Confirmed' },
            { id: 3, patient: 'Bruce Wayne',   doctor: 'Dr. Ben Villanueva',  service: 'Follow-up',    date: 'Mar 24, 1:00 PM',  status: 'Completed' },
            { id: 4, patient: 'Diana Prince',  doctor: 'Dr. Paolo Gutierrez', service: 'Consultation', date: 'Mar 25, 8:00 AM',  status: 'Pending'   },
            { id: 5, patient: 'Peter Parker',  doctor: 'Dr. Claire Mendoza',  service: 'Prenatal',     date: 'Mar 25, 2:00 PM',  status: 'Cancelled' },
          ].filter(b => activeTab === 'All' || b.status === activeTab)
           .map(booking => (
            <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors group">

              {/* Patient */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold
                                  text-xs flex items-center justify-center shrink-0">
                    {booking.patient.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-semibold text-sm text-slate-800">{booking.patient}</span>
                </div>
              </td>

              {/* Doctor */}
              <td className="px-6 py-4 text-sm text-slate-500">{booking.doctor}</td>

              {/* Service */}
              <td className="px-6 py-4 text-sm text-slate-500">{booking.service}</td>

              {/* Date */}
              <td className="px-6 py-4 font-semibold text-sm text-slate-700">{booking.date}</td>

              {/* Status */}
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px]
                                  font-black uppercase ${statusStyle[booking.status] ??
                                  'bg-red-100 text-red-600'}`}>
                  {booking.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {booking.status === 'Pending' && (
                    <>
                      <button className="text-xs font-semibold text-white bg-teal-500
                                         hover:bg-teal-400 px-3 py-1.5 rounded-lg
                                         transition-colors">
                        Accept
                      </button>
                      <button className="text-xs font-semibold text-slate-500
                                         bg-slate-100 hover:bg-red-50 hover:text-red-600
                                         px-3 py-1.5 rounded-lg transition-colors">
                        Decline
                      </button>
                    </>
                  )}
                  {booking.status === 'Confirmed' && (
                    <button className="text-xs font-semibold text-slate-500
                                       bg-slate-100 hover:bg-slate-200
                                       px-3 py-1.5 rounded-lg transition-colors">
                      Mark Done
                    </button>
                  )}
                  {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  </main>
)}

{mode === "Inquiries" && (
  <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

    <div>
      <h2 className="text-lg font-bold text-slate-800">Inquiries</h2>
      <p className="text-xs text-slate-400 mt-0.5">Messages from patients about your clinic</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-150">

      {/* LEFT — inquiry list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm
                      overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100">
          <input
            placeholder="Search inquiries..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm
                       outline-none focus:border-teal-400 transition-colors"
          />
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
          {[
            { id: 1, user: 'Peter Parker',  initials: 'PP', msg: 'Are you open on Saturdays?',       time: '10 mins ago', unread: true,  active: true  },
            { id: 2, user: 'Diana Prince',  initials: 'DP', msg: 'Can I reschedule my check-up?',    time: '1 hour ago',  unread: true,  active: false },
            { id: 3, user: 'Clark Kent',    initials: 'CK', msg: 'What are your available slots?',   time: '3 hours ago', unread: false, active: false },
            { id: 4, user: 'Natasha R.',    initials: 'NR', msg: 'Is Dr. Villanueva available Mon?', time: 'Yesterday',   unread: false, active: false },
            { id: 5, user: 'Tony Stark',    initials: 'TS', msg: 'Do you accept PhilHealth?',        time: 'Yesterday',   unread: false, active: false },
          ].map(inq => (
            <div key={inq.id}
              className={`p-4 cursor-pointer transition-colors
                          ${inq.active
                            ? 'bg-teal-50 border-l-2 border-teal-500'
                            : 'hover:bg-slate-50 border-l-2 border-transparent'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                 text-[10px] font-black shrink-0
                                 ${inq.unread
                                   ? 'bg-healthcon-blue text-white'
                                   : 'bg-slate-100 text-slate-500'}`}>
                  {inq.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold truncate
                                   ${inq.unread ? 'text-slate-800' : 'text-slate-500'}`}>
                      {inq.user}
                    </p>
                    <span className="text-[9px] text-slate-400 shrink-0 ml-1">{inq.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{inq.msg}</p>
                </div>
                {inq.unread && (
                  <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — active conversation */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm
                      flex flex-col overflow-hidden">

        {/* Conversation header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-healthcon-blue text-white font-bold
                          text-xs flex items-center justify-center">
            PP
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">Peter Parker</p>
            <p className="text-[10px] text-slate-400">10 minutes ago</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-slate-50/40">

          {/* Patient message */}
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none
                            px-4 py-3 max-w-sm shadow-sm">
              <p className="text-sm text-slate-700">Are you open on Saturdays?</p>
              <p className="text-[10px] text-slate-400 mt-1">10:14 AM</p>
            </div>
          </div>

          {/* Clinic reply */}
          <div className="flex justify-end">
            <div className="bg-healthcon-blue rounded-2xl rounded-tr-none
                            px-4 py-3 max-w-sm">
              <p className="text-sm text-white">
                Yes, we are open on Saturdays from 8:00 AM to 12:00 PM.
              </p>
              <p className="text-[10px] text-blue-200 mt-1">10:17 AM · You</p>
            </div>
          </div>

          {/* Patient follow-up */}
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none
                            px-4 py-3 max-w-sm shadow-sm">
              <p className="text-sm text-slate-700">
                Great! Can I book for this Saturday morning?
              </p>
              <p className="text-[10px] text-slate-400 mt-1">10:18 AM</p>
            </div>
          </div>
        </div>

        {/* Reply input */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
          <input
            placeholder="Type a reply..."
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                       outline-none focus:border-teal-400 transition-colors bg-slate-50"
          />
          <button className="bg-teal-500 hover:bg-teal-400 text-white font-semibold
                             text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0">
            Send
          </button>
        </div>
      </div>
    </div>
  </main>
)}

      </div>
    </div>
  );
}
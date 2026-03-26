"use client";
import { Home, Pencil, User, Calendar, MessageCircle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/layout/Navbar";
import {useState} from "react";

const buttons = [
  { label: "Dashboard", href: "/clinic/dashboard", icon: <Home size={20} /> },
  { label: "Profile",   href:"/clinic/profile",   icon: <User size={20} /> },
  { label: "Edit",      href: "/clinic/edit",      icon: <Pencil size={20} /> },
  { label: "Doctors",   href: "/clinic/doctors",   icon: <User size={20} /> },
  { label: "Booking",   href: "/clinic/bookings",   icon: <Calendar size={20} /> },
  { label: "Inquiries", href: "/clinic/inquiries",  icon: <MessageCircle size={20} /> },
];

export default function ClinicLayout({ children }) {
  
  const [search, setSearch] = useState("");
  const progressPct = Math.round((7 / 12) * 100);

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* <Navbar /> */}
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
        <Sidebar buttons={buttons} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
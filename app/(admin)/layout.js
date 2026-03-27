"use client";
import { Home, Clock, Building2, Stethoscope, Users, Calendar, Settings, Flag} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import {useState} from "react";

const buttons = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <Home size={20} /> },
  { label: "Pending Clinics",   href:"/admin/pending-clinics",   icon: <Clock size={20} /> },
  { label: "Clinics", href:"/admin/clinics", icon: <Building2 size={20} /> },
  { label: "Doctors",   href: "/admin/doctors",   icon: <Stethoscope size={20} /> },
  { label: "Users",      href: "/admin/users",      icon: <Users size={20} /> },
  { label: "Bookings",   href: "/admin/bookings",   icon: <Calendar size={20} /> },
  { label: "System Settings", href: "/admin/system-settings", icon: <Settings size={20} /> },
  { label: "Reports & Flagged", href: "/admin/reports-flagged", icon: <Flag size={20} /> }
];

export default function ClinicLayout({ children }) {
  
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
          {/* ── 1. TOP HEADER (Full Width) ── */}
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
        <Sidebar buttons={buttons} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
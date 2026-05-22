"use client";
import { Home, Pencil, User, Calendar, Stethoscope, Settings, Flag, CalendarClock, Clock, Menu } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/authContext";

const buttons = [
  { label: "Dashboard",        href: "/clinic/dashboard",        icon: <Home size={20} /> },
  { label: "Pending Requests", href: "/clinic/pending-requests", icon: <Clock size={20} /> },
  { label: "Daily Schedule",   href: "/clinic/daily-schedule",   icon: <CalendarClock size={20} /> },
  { label: "Doctors",          href: "/clinic/doctors",          icon: <Stethoscope size={20} /> },
  { label: "Booking History",  href: "/clinic/bookings",         icon: <Calendar size={20} /> },
  { label: "Profile",          href: "/clinic/profile",          icon: <User size={20} /> },
  { label: "Edit",             href: "/clinic/edit",             icon: <Pencil size={20} /> },
  { label: "Settings",         href: "/clinic/settings",         icon: <Settings size={20} /> },
  { label: "Reports & Reviews",href: "/clinic/reports-reviews",  icon: <Flag size={20} /> },
];

export default function ClinicLayout({ children }) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    const lower = query.toLowerCase();
    if (lower.includes("dr ") || lower.includes("dr.")) {
      router.push(`/clinic/doctors?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/clinic/bookings?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <div className="relative bg-healthcon-blue overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="text-teal-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-0.5">Clinic Portal</p>
                <h1 className="text-white text-lg sm:text-2xl font-bold">{user?.clinicName || "Clinic"}</h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 hidden sm:flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  Clinic is <span className="text-teal-300 font-semibold ml-1">Open</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="hidden sm:flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Patients or Doctors..."
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20 w-48 lg:w-64 transition-all"
              />
              <button type="submit" className="bg-teal-500 hover:bg-teal-400 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md">
                Search
              </button>
            </form>
          </div>

          {/* Mobile search */}
          <div className="sm:hidden mt-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20"
              />
              <button type="submit" className="bg-teal-500 px-4 py-2 rounded-xl text-sm font-semibold text-white">Go</button>
            </form>
          </div>
        </div>
      </div>

      <div className="flex">
        <Sidebar
          buttons={buttons}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

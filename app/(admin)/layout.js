"use client";
import { Home, Clock, Building2, Users, Calendar, Settings, Flag, History, Menu } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import AdminNotificationBell from "@/components/Notif/AdminNotificationBell";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/authContext";

const buttons = [
  { label: "Dashboard",       href: "/admin/dashboard",       icon: <Home size={18} /> },
  { label: "Pending Clinics", href: "/admin/pending-clinics", icon: <Clock size={18} /> },
  { label: "Clinics",         href: "/admin/clinics",         icon: <Building2 size={18} /> },
  { label: "Users",           href: "/admin/users",           icon: <Users size={18} /> },
  { label: "Bookings",        href: "/admin/bookings",        icon: <Calendar size={18} /> },
  { label: "System Logs",     href: "/admin/audit-log",       icon: <History size={18} /> },
  { label: "System Settings", href: "/admin/system-settings", icon: <Settings size={18} /> },
  { label: "Reports & Reviews", href: "/admin/reports-flagged", icon: <Flag size={18} /> },
];

export default function AdminLayout({ children }) {
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    const lowerQuery = query.toLowerCase();
    const upperQuery = query.toUpperCase();
    if (upperQuery.startsWith("USR-")) return router.push(`/admin/users?q=${encodeURIComponent(query)}`);
    if (upperQuery.startsWith("CLN-")) return router.push(`/admin/clinics?q=${encodeURIComponent(query)}`);
    if (upperQuery.startsWith("DOC-") || lowerQuery.startsWith("dr.")) return router.push(`/admin/doctors?q=${encodeURIComponent(query)}`);
    if (lowerQuery.includes("@")) return router.push(`/admin/users?q=${encodeURIComponent(query)}`);
    router.push(`/admin/clinics?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* TOP HEADER */}
      <div className="relative bg-healthcon-blue overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex items-center justify-between gap-4">
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
              <p className="text-teal-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-0.5">Super Admin Portal</p>
              <h1 className="text-white text-lg sm:text-2xl font-bold">Platform Overview</h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 hidden sm:flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                System Status: <span className="text-green-400 font-semibold ml-1">All Systems Operational</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <form onSubmit={handleSearch} className="hidden sm:flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Clinics/IDs..."
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20 w-44 lg:w-64 transition-all"
              />
              <button type="submit" className="bg-teal-500 hover:bg-teal-400 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-teal-900/20">
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Mobile search bar below header */}
        <div className="sm:hidden px-4 pb-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20"
            />
            <button type="submit" className="bg-teal-500 hover:bg-teal-400 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all">
              Go
            </button>
          </form>
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

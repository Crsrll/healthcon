"use client";
import { Home, Clock, Building2, Users, Calendar, Settings, Flag, History } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import AdminNotificationBell from "@/components/Notif/AdminNotificationBell";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/authContext";

const buttons = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <Home size={18} /> },
  { label: "Pending Clinics", href: "/admin/pending-clinics", icon: <Clock size={18} /> },
  { label: "Clinics", href: "/admin/clinics", icon: <Building2 size={18} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={18} /> },
  { label: "Bookings", href: "/admin/bookings", icon: <Calendar size={18} /> },
  { label: "System Logs", href: "/admin/audit-log", icon: <History size={18} /> },
  { label: "System Settings", href: "/admin/system-settings", icon: <Settings size={18} /> },
  { label: "Reports & Flagged", href: "/admin/reports-flagged", icon: <Flag size={18} /> }
];

export default function ClinicLayout({ children }) {
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;

    const lowerQuery = query.toLowerCase();
    const upperQuery = query.toUpperCase();

    if (upperQuery.startsWith("USR-")) {
      return router.push(`/admin/users?q=${encodeURIComponent(query)}`);
    }
    if (upperQuery.startsWith("CLN-")) {
      return router.push(`/admin/clinics?q=${encodeURIComponent(query)}`);
    }
    if (upperQuery.startsWith("DOC-") || lowerQuery.startsWith("dr.")) {
      return router.push(`/admin/doctors?q=${encodeURIComponent(query)}`);
    }
    if (lowerQuery.includes("@")) {
      return router.push(`/admin/users?q=${encodeURIComponent(query)}`);
    }
    if (lowerQuery.includes("dr ") || lowerQuery.includes("dr.")) {
      return router.push(`/admin/doctors?q=${encodeURIComponent(query)}`);
    }

    router.push(`/admin/clinics?q=${encodeURIComponent(query)}`);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* TOP HEADER */}
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

          <div className="flex items-center gap-4">
            <AdminNotificationBell adminId={user?.id} />
            
            <form onSubmit={handleSearch} className="flex gap-2 relative group">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Clinics/IDs..."
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20 w-64 transition-all"
                />

                {search.length > 0 && !search.includes("-") && (
                  <div className="absolute top-full mt-2 left-0 bg-slate-800 text-white text-[9px] px-3 py-1.5 rounded-lg shadow-2xl z-50 whitespace-nowrap opacity-0 group-focus-within:opacity-100 transition-opacity border border-slate-700">
                    Tip: Use <span className="text-teal-400 font-bold uppercase">Cln-</span> Clinics, 
                    <span className="text-blue-400 font-bold uppercase ml-1">Usr-</span> Users, or 
                    <span className="text-indigo-400 font-bold uppercase ml-1">Doc-</span> Doctors
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="bg-teal-500 hover:bg-teal-400 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-teal-900/20"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="flex">
        <Sidebar 
          buttons={buttons} 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
        />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
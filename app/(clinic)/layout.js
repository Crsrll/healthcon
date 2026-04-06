"use client";
import { Home, Pencil, User, Calendar, MessageCircle , Stethoscope, Settings, Flag, CalendarClock, SearchIcon, Clock} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useRouter  } from "next/navigation";
import {useState} from "react";

const buttons = [
  { label: "Dashboard", href: "/clinic/dashboard", icon: <Home size={20} /> },
  { label: "Pending Requests",   href:"/clinic/pending-requests",   icon: <Clock size={20} /> },
  { label: "Daily Schedule", href: "/clinic/daily-schedule",  icon: <CalendarClock size={20} /> },
  { label: "Doctors",   href: "/clinic/doctors",   icon: <Stethoscope size={20} /> },
  { label: "Booking History",   href: "/clinic/bookings",   icon: <Calendar size={20} /> },
  { label: "Profile",   href:"/clinic/profile",   icon: <User size={20} /> },
  { label: "Edit",      href: "/clinic/edit",      icon: <Pencil size={20} /> },
  { label: "Inquiries", href: "/clinic/inquiries",  icon: <MessageCircle size={20} /> },
  { label: "Settings", href: "/clinic/settings", icon: <Settings size={20} /> },
  { label: "Reports & Reviews", href: "/clinic/reports-reviews", icon: <Flag size={20} /> }
  
];

export default function ClinicLayout({ children }) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const progressPct = Math.round((7 / 12) * 100);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;

    const lowerQuery = query.toLowerCase();
    const upperQuery = query.toUpperCase();

    if (upperQuery.includes("DAILY-") || lowerQuery.includes("sched")) {
      router.push(`/clinic/daily-schedule?q=${encodeURIComponent(query)}`);
    } else if (lowerQuery.includes("dr ") || lowerQuery.includes("dr.")) {
      router.push(`/clinic/doctors?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/clinic/bookings?q=${encodeURIComponent(query)}`);
    }
  };
  

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
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
              <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-xxl">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search Patients or Doctors..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20 transition-all w-64"
                    />
                  </div>
                  <button type="submit" className="bg-teal-500 hover:bg-teal-400 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md">
                    Search
                  </button>
                </form>
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
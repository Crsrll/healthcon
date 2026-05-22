"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { usePathname } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import { Menu, X } from "lucide-react";
import NotificationBell from "@/components/Notif/NotificationBell";
import AdminNotificationBell from "@/components/Notif/AdminNotificationBell";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useRealtimeUnreadResponses } from "@/hooks/useRealtimeUnreadResponses";

const patientLinks = [
  { name: "Dashboard",        href: "/patient/dashboard" },
  { name: "Find Clinics",     href: "/clinics" },
  { name: "My Appointments",  href: "/patient/appointments" },
];

export default function Navbar({ style }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled]         = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted]           = useState(false);
  const dropdownRef = useRef(null);

  const role           = user?.role;
  const unreadMessages = useUnreadMessages(user?.uid, role);
  const { unreadCount } = useRealtimeUnreadResponses(user?.uid);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pathname = usePathname();
  const hideOn = ["/auth/login", "/auth/register", "/auth/register-clinic", "/auth/login-clinic"];
  if (hideOn.includes(pathname)) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const profileName =
    role === "patient" ? `${user?.firstName} ${user?.lastName}` :
    role === "clinic"  ? user?.clinicName :
    role === "admin"   ? user?.firstName || user?.email?.split("@")[0] :
    `${user?.firstName} ${user?.lastName}`;

  const profileLabel =
    role === "patient" ? "Patient" :
    role === "clinic"  ? "Clinic Staff" :
    role === "admin"   ? "Administrator" : "User";

  /* ─────────────────────────────────────────────────────────
     Skeleton (before mount)
  ───────────────────────────────────────────────────────── */
  if (!mounted) return (
    <nav className={`${style} bg-navy-dark py-3`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between text-white">
        <div className="flex items-center gap-2 font-bold text-[20px]">
          <img src="/logo.png" alt="HealthCon" className="h-9 object-contain" />
          <span>Health<span className="text-cyan-300">con</span></span>
        </div>
      </div>
    </nav>
  );

  /* ─────────────────────────────────────────────────────────
     PATIENT — mobile-first nav with hamburger on LEFT
  ───────────────────────────────────────────────────────── */
  if (role === "patient") {
    return (
      <nav className={`${style} transition-all duration-300 ${scrolled ? "py-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]" : "py-3"}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-white h-12">

          {/* LEFT: hamburger (mobile) + logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {/* Logo - shows "HealthCon" text on mobile instead of logo image */}
            <div className="flex items-center gap-1.5 font-bold text-[18px] cursor-pointer" onClick={() => router.push("/")}>
              {/* Hide logo image on mobile, show text only */}
              <img src="/logo.png" alt="HealthCon" className="h-8 object-contain hidden sm:block" />
              <span className="text-white">
                Health<span className="text-cyan-300">con</span>
              </span>
            </div>
          </div>

          {/* CENTER: nav links desktop */}
          <div className="hidden md:flex items-center gap-8">
            {patientLinks.map(link => (
              <Link key={link.name} href={link.href}
                className="text-[12px] font-bold uppercase tracking-widest relative group">
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-300 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* RIGHT: icons */}
          <div className="flex items-center gap-2">
            {/* Messages */}
            <Link href="/patient/messages"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-teal-300 hover:bg-white/10 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              {unreadMessages > 0 && <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-navy-dark" />}
            </Link>

            <NotificationBell uid={user?.uid} />

            <div className="h-5 w-px bg-slate-600" />

            {/* Avatar / profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsProfileOpen(v => !v)}
                className="w-8 h-8 bg-teal-500 rounded-full border border-slate-300 cursor-pointer hover:ring-2 ring-teal-300 transition-all flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                <Avatar user={user} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-teal-600 uppercase">{profileLabel}</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{profileName}</p>
                  </div>
                  <Link href="/patient/profile" onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">My Profile</Link>
                  <Link href="/patient/reports-responses" onClick={() => setIsProfileOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                    <span>Reports & Responses</span>
                    {unreadCount > 0 && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                  </Link>
                  <Link href="/patient/settings" onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">Account Settings</Link>
                  <Link href="/patient/help" onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">Help & Support</Link>
                  <hr className="border-slate-100 my-1" />
                  <button onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 font-semibold hover:bg-red-50 transition-colors">Log Out</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1">
            {patientLinks.map(link => (
              <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-semibold py-2.5 px-3 rounded-xl transition-colors
                  ${pathname === link.href ? "bg-white/15 text-white" : "text-slate-300 hover:text-white hover:bg-white/10"}`}>
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    );
  }

  /* ─────────────────────────────────────────────────────────
     PUBLIC (no user) — minimal nav
  ───────────────────────────────────────────────────────── */
  if (!user) {
    return (
      <nav className={`${style} transition-all duration-300 ${scrolled ? "py-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]" : "py-3"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 font-bold text-[20px] cursor-pointer" onClick={() => router.push("/")}>
            {/* Hide logo on mobile for public view too */}
            <img src="/logo.png" alt="HealthCon" className="h-9 object-contain hidden sm:block" />
            <span>Health<span className="text-cyan-300">con</span></span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <span onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="text-[12px] font-bold uppercase tracking-widest cursor-pointer relative group">
              About<span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-300 transition-all duration-200 group-hover:w-full" />
            </span>
            <span onClick={() => router.push("/auth/register")}
              className="text-[12px] font-bold uppercase tracking-widest cursor-pointer relative group">
              Sign Up<span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-300 transition-all duration-200 group-hover:w-full" />
            </span>
            <button onClick={() => router.push("/auth/login")}
              className="bg-[#2f80d0] px-5 py-2 text-[14px] font-bold rounded-[10px] shadow-[0_4px_14px_rgba(47,128,208,0.35)] transition-all hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_10px_28px_rgba(47,128,208,0.5)] hover:bg-[#1a6dbf]">
              Log In
            </button>
          </div>

          {/* Mobile: just login button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => router.push("/auth/login")}
              className="bg-[#2f80d0] px-4 py-1.5 text-sm font-bold rounded-xl">Log In</button>
          </div>
        </div>
      </nav>
    );
  }

  /* ─────────────────────────────────────────────────────────
     ADMIN / CLINIC — no mobile hamburger in navbar
     (they have their own sidebar hamburger in the layout)
  ───────────────────────────────────────────────────────── */
  return (
    <nav className={`${style} transition-all duration-300 ${scrolled ? "py-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]" : "py-3"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between text-white">
        <div className="flex items-center gap-1.5 font-bold text-[20px] cursor-pointer" onClick={() => router.push("/")}>
          {/* Hide logo on mobile for admin/clinic too */}
          <img src="/logo.png" alt="HealthCon" className="h-9 object-contain hidden sm:block" />
          <span>Health<span className="text-cyan-300">con</span></span>
        </div>

        <div className="flex items-center gap-3">
          {role === "clinic" && (
            <Link href="/clinic/inquiries"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-teal-300 hover:bg-white/10 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              {unreadMessages > 0 && <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-navy-dark" />}
            </Link>
          )}

          {role === "admin" ? <AdminNotificationBell adminId={user?.uid} /> : <NotificationBell uid={user?.uid} />}

          <div className="h-5 w-px bg-slate-600" />

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsProfileOpen(v => !v)}
              className="w-8 h-8 bg-teal-500 rounded-full border border-slate-300 cursor-pointer hover:ring-2 ring-teal-300 transition-all flex items-center justify-center text-white font-bold text-xs overflow-hidden">
              <Avatar user={user} />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-teal-600 uppercase">{profileLabel}</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{profileName}</p>
                </div>
                <Link href={role === "clinic" ? "/clinic/profile" : "/admin/dashboard"}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                  {role === "clinic" ? "Clinic Profile" : "Admin Dashboard"}
                </Link>
                <Link href={role === "clinic" ? "/clinic/settings" : "/admin/system-settings"}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                  {role === "clinic" ? "Clinic Settings" : "System Settings"}
                </Link>
                <hr className="border-slate-100 my-1" />
                <button onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-red-600 font-semibold hover:bg-red-50 transition-colors">Log Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
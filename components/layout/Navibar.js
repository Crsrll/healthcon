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
  { name: "Dashboard", href: "/patient/dashboard" },
  { name: "Find Clinics", href: "/clinics" },
  { name: "My Appointments", href: "/patient/appointments" },
];

const clinicLinks = [
  { name: "Dashboard", href: "/clinic/dashboard" },
  { name: "Doctors", href: "/doctors" },
  { name: "Patients", href: "/clinic/patients" },
];

export default function Navbar({ style }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  // ── Unread message count (real-time) ──
  const role = user?.role;
  const unreadMessages = useUnreadMessages(user?.uid, role);
  
  // ── Unread responses count for reports (patient only) ──
  const { unreadCount } = useRealtimeUnreadResponses(user?.uid);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pathname = usePathname();
  const hideOn = ["/auth/login", "/auth/register", "/auth/register-clinic", "/auth/login-clinic"];
  if (hideOn.includes(pathname)) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const links =
    role === "patient" ? patientLinks :
    role === "clinic"  ? clinicLinks  :
    null;

  const profileName =
    role === "patient" ? `${user?.firstName} ${user?.lastName}` :
    role === "clinic"  ? user?.clinicName :
    role === "admin"   ? user?.firstName || user?.email?.split('@')[0] :
    `${user?.firstName} ${user?.lastName}`;

  const profileLabel =
    role === "patient" ? "Patient" :
    role === "clinic"  ? "Clinic Staff" :
    role === "admin"   ? "Administrator" :
    "User";

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

  // Add this function inside your Navbar component
const markAllReportsAsRead = async () => {
  if (!user?.uid) return;
  try {
    // Fetch all report IDs for this patient
    const res = await fetch(`/api/reports/to-clinic?reporterID=${user.uid}`);
    const data = await res.json();
    if (data.success && data.reports) {
      // For each report, get its reply thread and mark as read
      for (const report of data.reports) {
        const replyRes = await fetch(`/api/clinic-replies?reportId=${report.id}`);
        const replyData = await replyRes.json();
        if (replyData.success && replyData.reply && replyData.reply.unreadByPatient === true) {
          await fetch(`/api/clinic-replies`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ replyId: replyData.reply.id }),
          });
        }
      }
      // Refresh unread count
      window.dispatchEvent(new Event('unread-update'));
    }
  } catch (error) {
    console.error("Failed to mark reports as read:", error);
  }
};

  return (
    <nav
      className={`${style} transition-all duration-300 ${
        scrolled ? "py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]" : "py-3 shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between text-white">

        {/* LEFT: Logo */}
        <div
          className="flex items-center gap-2 font-bold cursor-pointer text-[20px]"
          onClick={() => router.push("/")}
        >
          <img src="/logo.png" alt="HealthCon" className="h-9 object-contain" />
          <span>Health<span className="text-cyan-300">con</span></span>
        </div>

        {/* CENTER: Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {links && links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[12px] font-bold uppercase tracking-widest relative group"
            >
              {link.name}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-300 transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* ── Public ── */}
          {!user && (
            <div className="flex items-center gap-8">
              <span
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                className="text-[12px] font-bold uppercase tracking-widest cursor-pointer relative group"
              >
                About
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-300 transition-all duration-200 group-hover:w-full" />
              </span>
              <span
                onClick={() => router.push("/auth/register")}
                className="text-[12px] font-bold uppercase tracking-widest cursor-pointer relative group"
              >
                Sign Up
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-300 transition-all duration-200 group-hover:w-full" />
              </span>
              <button
                onClick={() => router.push("/auth/login")}
                className="bg-[#2f80d0] px-5 py-2 text-[14px] font-bold rounded-[10px]
                           shadow-[0_4px_14px_rgba(47,128,208,0.35)]
                           transition-all duration-200
                           hover:-translate-y-0.5 hover:scale-[1.03]
                           hover:shadow-[0_10px_28px_rgba(47,128,208,0.5)]
                           hover:bg-[#1a6dbf]"
              >
                Log In
              </button>
            </div>
          )}

          {/* ── Logged in ── */}
          {user && (
            <div className="flex items-center gap-3">

              {/* ── Message icon with unread dot (only for patients and clinics) ── */}
              {(role === "patient" || role === "clinic") && (
                <Link
                  href={role === "patient" ? "/patient/messages" : "/clinic/inquiries"}
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-teal-300 hover:bg-white/10 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  {unreadMessages > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-navy-dark" />
                  )}
                </Link>
              )}

              {/* ── Notification Bell (uses different bell for admin) ── */}
              {role === "admin" ? (
                <AdminNotificationBell adminId={user?.uid} />
              ) : (
                <NotificationBell uid={user?.uid} />
              )}

              {/* Divider */}
              <div className="h-6 w-px bg-slate-600 mx-1" />

              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 bg-teal-500 rounded-full border border-slate-300 cursor-pointer hover:ring-2 ring-teal-300 transition-all flex items-center justify-center text-white font-bold text-xs"
                >
                  <Avatar user={user} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold text-teal-600 uppercase">{profileLabel}</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{profileName}</p>
                    </div>

                    {/* Profile link based on role */}
                    <Link
                      href={
                        role === "patient" ? "/patient/profile" :
                        role === "clinic" ? "/clinic/profile" :
                        "/admin/dashboard"
                      }
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {role === "patient" ? "My Profile" : role === "clinic" ? "Clinic Profile" : "Admin Dashboard"}
                    </Link>

                    {/* Reports & Responses (patients only) - Fixed version */}
                    {role === "patient" && (
                      <Link
                        href="/patient/reports-responses"
                        onClick={() => {
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span>Reports & Responses</span>
                        {unreadCount > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </Link>
                    )}

                    {/* Settings based on role */}
                    <Link
                      href={
                        role === "patient" ? "/patient/settings" :
                        role === "clinic" ? "/clinic/settings" :
                        "/admin/system-settings"
                      }
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {role === "patient" ? "Account Settings" : role === "clinic" ? "Clinic Settings" : "System Settings"}
                    </Link>

                    {/* Help & Support (all roles) */}
                    {role === "patient" && (
                      <Link
                        href="/patient/help"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Help & Support
                      </Link>
                    )}

                    <hr className="border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 font-semibold hover:bg-red-50 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-dark border-t border-white/10 px-4 py-3 space-y-2">
          {links && links.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-white py-2 border-b border-white/10 last:border-0">
              {link.name}
            </Link>
          ))}
          {!user && (
            <>
              <button onClick={() => { setMobileMenuOpen(false); router.push("/auth/register"); }}
                className="block w-full text-left text-sm font-bold text-white py-2 border-b border-white/10">Sign Up</button>
              <button onClick={() => { setMobileMenuOpen(false); router.push("/auth/login"); }}
                className="block w-full text-left text-sm font-bold text-cyan-300 py-2">Log In</button>
            </>
          )}
          {user && (
            <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="block w-full text-left text-sm font-bold text-red-400 py-2">Log Out</button>
          )}
        </div>
      )}
    </nav>
  );
}
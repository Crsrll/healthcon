"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/authContext";

const patientLinks = [
  { name: "Dashboard", href: "/patient/dashboard" },
  { name: "Find Clinics", href: "/clinics" },
  { name: "My Appointments", href: "/appointments" },
];

const clinicLinks = [
  { name: "Dashboard", href: "/clinic/dashboard" },
  { name: "Doctors", href: "/doctors" },
  { name: "Patients", href: "/clinic/patients" },
];

const adminLinks = [
  { name: "Overview", href: "/admin/dashboard" },
  { name: "Clinics", href: "/clinic" },
  { name: "Users", href: "/users" },
];

export default function Navbar({ style }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const role = user?.role;
  const links =
    role === "patient" ? patientLinks :
    role === "clinic"  ? clinicLinks  :
    role === "admin"   ? adminLinks   :
    null;

  const profileInitial =
    role === "patient" ? "M" :
    role === "clinic"  ? "J" :
    role === "admin"   ? "AD" : "";

  const profileName =
    role === "patient" ? "Melissa 👋" :
    role === "clinic"  ? "Joseph Health 🏥" :
    "Admin User";

  const profileLabel =
    role === "patient" ? "Patient" :
    role === "clinic"  ? "Clinic Staff" :
    "Admin";

  if (!mounted) return (
    <nav className={`${style} bg-navy-dark py-3`}>
      <div className="max-w-7xl mx-auto px-12 flex items-center justify-between text-white">
        <div className="flex items-center gap-2 font-bold text-[20px]">
          <img src="/logo.png" alt="HealthCon" className="h-9 object-contain" />
          <span>Health<span className="text-cyan-300">con</span></span>
        </div>
      </div>
    </nav>
  );

  return (
    <nav
      className={`${style} transition-all duration-300 ${
        scrolled ? "py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]" : "py-3 shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-12 flex items-center justify-between text-white">

        {/* LEFT: Logo */}
        <div
          className="flex items-center gap-2 font-bold cursor-pointer text-[20px]"
          onClick={() => router.push("/")}
        >
          <img src="/logo.png" alt="HealthCon" className="h-9 object-contain" />
          <span>Health<span className="text-cyan-300">con</span></span>
        </div>

        {/* CENTER: Dashboard nav links (logged in only) */}
        <div className="flex items-center gap-8">
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

        {/* RIGHT: Public links or logged-in icons */}
        <div className="flex items-center gap-8">

          {/* Public */}
          {!user && (
            <>
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
            </>
          )}

          {/* Logged in */}
          {user && (
            <>
              {/* Messages */}
              <button className="relative p-1 text-slate-300 hover:text-teal-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-navy-dark" />
              </button>

              {/* Notifications */}
              <button className="relative p-1 text-slate-300 hover:text-teal-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-teal-400 ring-2 ring-navy-dark" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center border-l border-slate-600 pl-4">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-9 h-9 bg-teal-500 rounded-full border border-slate-300 cursor-pointer hover:ring-2 ring-teal-300 transition-all flex items-center justify-center text-white font-bold text-xs"
                  >
                    {profileInitial}
                  </button>
                </div>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold text-teal-600 uppercase">{profileLabel}</p>
                      <p className="text-sm font-bold text-slate-800">{profileName}</p>
                    </div>

                    <Link
                      href={role === "patient" ? "/patient/profile" : role === "clinic" ? "/clinic/profile" : "/admin/audit-logs"}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {role === "patient" ? "My Profile" : role === "clinic" ? "Clinic Profile" : "Admin Logs"}
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {role === "patient" ? "Account Settings" : role === "clinic" ? "Clinic Settings" : "System Settings"}
                    </Link>

                    <Link
                      href="/help"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Help & Support
                    </Link>

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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  // Logic states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("patient"); // Changed name to match usage below

  const publicLinks = [
    { name: "Home", href: "/home" },
    { name: "Clinics", href: "/clinics" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" } 
  ];

  const patientLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Find Clinics", href: "/clinics" },
    { name: "My Appointments", href: "/appointments" }, 
  ];

  // FIXED: Changed userType to userRole to match the state above
  const activeLinks = isLoggedIn 
    ? (userRole === "patient" ? patientLinks : []) 
    : publicLinks;

  return (
    <nav className="bg-[#1a365d] border-b border-slate-700 px-6 py-3">
      {/* FIXED: Removed the self-closing </div> that was here */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <Link href="/" className="text-[#f7fafc] text-xl font-bold flex items-center gap-2">
          {/* Note: Use /logo.png (absolute path) instead of ./logo.png */}
          <img src="/logo.png" alt="Healthcon Logo" className="w-8 h-8" />
          <span>
            Health<span className="text-[#b2f5ea]">con</span>
          </span>
        </Link>

        {/* CENTER: Nav Links */}
        <ul className="hidden md:flex items-center space-x-8">
          {activeLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                // FIXED: Removed text-slate-600 because the background is dark
                className="text-white hover:text-teal-300 font-medium transition-all duration-200 text-sm"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT: Auth Buttons */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/auth/login" className="text-white font-medium text-sm hover:text-teal-300 transition-colors">
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="hover:text-teal-300 text-white px-5 py-2 text-sm font-semibold transition-all"
              >
                Get Started
              </Link>
            </>
          ) : (
            /* User Profile Circle */
            <div className="flex items-center gap-3 border-l pl-4 border-slate-500">
               <span className="text-sm font-medium text-white hidden sm:inline uppercase tracking-wide">
                 {userRole}
               </span>
               <div className="w-9 h-9 bg-slate-200 rounded-full border border-slate-300 cursor-pointer hover:ring-2 ring-teal-400 transition-all overflow-hidden">
                  {/* Avatar Image would go here */}
                  <div className="w-full h-full flex items-center justify-center text-slate-800 font-bold text-xs">
                    JD
                  </div>
               </div>
            </div>
          )}
        </div>
      </div> {/* End of max-w-7xl container */}
    </nav>
  );
}
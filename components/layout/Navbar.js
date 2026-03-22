"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Set to true to see the icons
  const [userRole, setUserRole] = useState("public");

  const publicLinks = [
    { name: "Home", href: "/home" },
    { name: "Clinics", href: "/clinics" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" } 
  ];

  const patientLinks = [
    { name: "Dashboard", href: "/patient/dashboard" },
    { name: "Find Clinics", href: "/clinics" },
    { name: "My Appointments", href: "/appointments" }, 
  ];

  const activeLinks = isLoggedIn 
    ? (userRole === "patient" ? patientLinks : []) 
    : publicLinks;

  return (
    <nav className="bg-[#1a365d] border-b border-slate-700 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <Link href="/" className="text-[#f7fafc] text-xl font-bold flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span>Health<span className="text-[#b2f5ea]">con</span></span>
        </Link>

        {/* CENTER: Nav Links */}
        <ul className="hidden md:flex items-center space-x-8">
          {activeLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="text-white hover:text-teal-300 font-medium transition-all text-sm">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT: Auth & App Icons */}
        <div className="flex items-center gap-3 sm:gap-5">
          {!isLoggedIn ? (
            <>
              <Link href="/auth/login" className="text-white font-medium text-sm hover:text-teal-300">
                Sign In
              </Link>
              <Link href="/auth/register" className="hover:text-teal-300 text-white px-5 py-2 text-sm font-semibold transition-all">
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              
              {/* 1. MESSAGES ICON */}
              <button className="relative p-1 text-slate-300 hover:text-teal-300 transition-colors">
                <span className="sr-only">View messages</span>
                {/* SVG for Message/Chat Bubble */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                {/* Notification Badge */}
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#1a365d]" />
              </button>

              {/* 2. NOTIFICATIONS ICON */}
              <button className="relative p-1 text-slate-300 hover:text-teal-300 transition-colors">
                <span className="sr-only">View notifications</span>
                {/* SVG for Bell */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                {/* Notification Badge */}
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-teal-400 ring-2 ring-[#1a365d]" />
              </button>

              {/* 3. PROFILE CIRCLE */}
              <div className="flex items-center gap-3 border-l pl-4 border-slate-600">
                 <div className="w-9 h-9 bg-teal-500 rounded-full border border-slate-300 cursor-pointer hover:ring-2 ring-teal-300 transition-all flex items-center justify-center text-white font-bold text-xs">
                    M
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
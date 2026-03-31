"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/authContext";

export default function Navbar() {
  const router = useRouter();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();       
    router.push("/");   
  };

  const [scrolled, setScrolled] = useState(false);
  
    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleAboutClick = () => {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-[#122844] transition-all duration-300 ${
          scrolled
            ? "py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            : "py-[18px]"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-12 flex items-center justify-between text-white">
          
          {/* Logo */}
          <div
            className="flex items-center gap-2 font-bold cursor-pointer text-[20px]"
            onClick={() => router.push("/")}
          >
            <img
              src="/logo.png"
              alt="HealthCon"
              className="h-9 object-contain"
            />
            <span>
              Health<span className="text-cyan-300">con</span>
            </span>
          </div>
  
          {/* Nav links */}
          <div className="flex items-center gap-8">
            
            <span
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-[12px] font-bold uppercase tracking-widest cursor-pointer relative group"
            >
              About
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-cyan-300 transition-all duration-200 group-hover:w-full"></span>
            </span>
  
            <span
              onClick={() => router.push("/auth/register")}
              className="text-[12px] font-bold uppercase tracking-widest cursor-pointer relative group"
            >
              Sign Up
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-cyan-300 transition-all duration-200 group-hover:w-full"></span>
            </span>
  
            {/* Button */}
            <button
              onClick={() => router.push("/auth/login")}
              className="bg-[#2f80d0] px-[22px] py-[9px] text-[14px] font-bold rounded-[10px]
                         shadow-[0_4px_14px_rgba(47,128,208,0.35)]
                         transition-all duration-200
                         hover:-translate-y-[3px] hover:scale-[1.03]
                         hover:shadow-[0_10px_28px_rgba(47,128,208,0.5)]
                         hover:bg-[#1a6dbf]"
            >
              Log In
            </button>
  
          </div>
        </div>
      </nav>
  )
}
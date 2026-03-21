"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard",           label: "Home",      icon: "home"     },
  { href: "/dashboard/bookings",  label: "Bookings",  icon: "calendar" },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: "chat"     },
  { href: "/dashboard/settings",  label: "Settings",  icon: "settings" },
];

const icons = {
  home: (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
      <path d="M2 8L8 2l6 6M4 6v7h3v-3h2v3h3V6"
        stroke="currentColor" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
      <rect x="2" y="3" width="12" height="11" rx="1.5"
        stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2 7h12M5 2v2M11 2v2"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
      <path d="M2 2.5h12a.5.5 0 01.5.5v8a.5.5 0 01-.5.5H5L2 14V3a.5.5 0 010-1z"
        stroke="currentColor" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
      <circle cx="8" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 1v1.5M8 11.5V13M1 7h1.5M11.5 7H13M2.9 2.9l1 1M10.1 10.1l1 1M2.9 11.1l1-1M10.1 4.9l1-1"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
};

function SidebarContent({ user, onClose }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-2 mb-5">
        <span className="text-white font-medium text-[15px]">HealthCon</span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70
              hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <p className="text-[10px] text-white/40 uppercase tracking-widest px-2 mb-1">
        Menu
      </p>
      <nav className="flex flex-col gap-0.5">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`
                flex items-center gap-2.5 px-2.5 py-2 rounded-lg
                text-[13px] transition-colors
                ${active
                  ? "bg-[#0F7F7F] text-white font-medium"
                  : "text-white/65 hover:bg-white/10 hover:text-white"}
              `}
            >
              {icons[link.icon]}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="mt-auto">
        <p className="text-[10px] text-white/40 uppercase tracking-widest px-2 mb-1">
          Account
        </p>
        <div className="flex items-center gap-2.5 px-2 pt-2 mt-1
          border-t border-white/15">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center
            justify-center text-white text-[11px] font-medium shrink-0">
            {user?.name?.charAt(0) ?? "P"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-[12px] font-medium truncate">
              {user?.name ?? "Patient"}
            </p>
            <p className="text-white/50 text-[10px] truncate">
              {user?.email ?? ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── DESKTOP sidebar — always visible, pushes content ──── */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0
        bg-[#0D6E6E] min-h-screen sticky top-0 px-3 py-4">
        <SidebarContent user={user} onClose={null} />
      </aside>

      {/* ── MOBILE drawer — slides in over content ────────────── */}
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-52
          bg-[#0D6E6E] px-3 py-4
          transition-transform duration-300 ease-in-out
          lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent user={user} onClose={() => setIsOpen(false)} />
      </aside>

      {/* ── Hamburger — mobile only ───────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed top-3 left-3 z-50 lg:hidden
          p-2 rounded-lg bg-[#0D6E6E] hover:bg-[#0F7F7F]
          text-white transition-all duration-200
          ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
        aria-label="Open menu"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
          <path d="M2 4h12M2 8h12M2 12h12"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>
    </>
  );
}
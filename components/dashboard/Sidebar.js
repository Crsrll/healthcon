"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Sidebar({ buttons, className = "", children, isCollapsed = false, onToggle, mobileOpen = false, onMobileClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar panel */}
      <div className={`
        shrink-0 bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto
        fixed top-0 left-0 h-full z-50 md:static md:h-screen
        ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "md:w-20" : "md:w-56"}
        ${className}
      `}>
        {/* Mobile close + Desktop toggle */}
        <div className="px-2 pt-2 border-b border-gray-100 mb-3 flex items-center justify-between">
          {/* Desktop collapse toggle */}
          <button
            onClick={onToggle}
            className="hidden md:flex w-full items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <div className="space-y-1 px-2">
          {buttons.map((b) => (
            <Link
              key={b.label}
              href={b.href}
              onClick={onMobileClose}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all flex items-center gap-2
                ${pathname === b.href ? "bg-[#1a355d] text-white" : "text-gray-500 hover:bg-gray-50"}
                ${isCollapsed ? "md:justify-center" : ""}`}
              title={isCollapsed ? b.label : ""}
            >
              <span className="shrink-0">{b.icon}</span>
              <span className={isCollapsed ? "md:hidden" : ""}>{b.label}</span>
            </Link>
          ))}
        </div>

        {children && (
          <div className={`mt-4 px-2 ${isCollapsed ? "md:hidden" : ""}`}>
            {children}
          </div>
        )}
      </div>
    </>
  );
}

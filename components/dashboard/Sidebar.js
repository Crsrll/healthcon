"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar({ buttons, className = '', children, isCollapsed = false, onToggle }) {
  const pathname = usePathname();

  return (
    <div className={`shrink-0 sticky top-0 h-screen overflow-y-auto bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-56'} ${className}`}>
      {/* Toggle Button */}
      <div className="px-2 pt-2 border-b border-gray-100 mb-3">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="space-y-1 px-2">
        {buttons.map((b) => (
          <Link
            key={b.label}
            href={b.href}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all flex items-center gap-2
              ${pathname === b.href
                ? "bg-[#1a355d] text-white"
                : "text-gray-500 hover:bg-gray-50"
              }
              ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? b.label : ""}
          >
            <span className="shrink-0">{b.icon}</span>
            {!isCollapsed && <span>{b.label}</span>}
          </Link>
        ))}
      </div>
      
      {children && !isCollapsed && (
        <div className="mt-4 px-2">
          {children}
        </div>
      )}
    </div>
  );
}
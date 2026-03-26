"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ buttons, className = '', children }) {
  const pathname = usePathname();

  return (
    <div className={`w-56 shrink-0 sticky top-0 h-screen overflow-y-auto bg-white border-r border-gray-200 p-4 ${className}`}>
      {buttons.map((b) => (
        <Link
          key={b.label}
          href={b.href}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium
            transition-all flex items-center gap-2
            ${pathname === b.href
              ? "bg-[#1a355d] text-white"
              : "text-gray-500 hover:bg-gray-50"
            }`}
        >
          {b.icon}
          {b.label}
        </Link>
      ))}
      {children}
    </div>
  );
}
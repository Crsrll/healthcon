'use client';
import { useState } from 'react';

export default function FilterSection({ title, defaultOpen = true, children, hasActive = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-2">

      {/* Header — click to collapse */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-3
                   bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-[#1a355d]">{title}</span>
        <div className="flex items-center gap-2">
          {hasActive && (
            <span className="text-[10px] font-bold bg-[#b2f5ea] text-[#1a355d]
                             rounded-full px-2 py-0.5">
              •
            </span>
          )}
          <svg
            className={`w-4 h-4 stroke-gray-400 fill-none stroke-2 transition-transform
                        ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>

      {/* Body — shown/hidden */}
      {open && (
        <div className="border-t border-gray-100 p-2">
          {children}
        </div>
      )}
    </div>
  );
}
'use client';
import { useState } from 'react';

// ── Collapsible section (reusable) ──────────────────────────
function FilterSection({ title, defaultOpen = true, children, hasActive = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-3
                   bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-[#1a355d]">{title}</span>
        <div className="flex items-center gap-2">
          {hasActive && (
            <span className="w-2 h-2 rounded-full bg-healthcon-teal border border-[#1a355d]" />
          )}
          <svg
            className={`w-4 h-4 stroke-gray-400 fill-none stroke-2 transition-transform
                        ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-2">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Filter button item ───────────────────────────────────────
function FilterItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-2 px-2 py-2
                  rounded-lg text-sm transition-colors mb-0.5
                  ${active
                    ? 'bg-blue-50 text-[#1a355d] font-medium'
                    : 'text-gray-500 hover:bg-gray-50'}`}
    >
      <span className={`w-3.5 h-3.5 rounded-full border shrink-0 transition-all
                        ${active
                          ? 'border-[#1a355d] bg-[#1a355d]'
                          : 'border-gray-300'}`}
      />
      {label}
    </button>
  );
}

// ── Main sidebar export ──────────────────────────────────────
export default function FilterSidebar({
  mode,          // 'clinics' | 'doctors'
  onModeChange,  // (mode) => void
  specialty,
  onSpecialtyChange,
  city,
  onCityChange,
  onReset,
  SPECIALTIES,
  CITIES,
}) {
  return (
    <aside className="w-56 shrink-0 sticky top-0 h-screen
                      overflow-y-auto bg-white border-r border-gray-200 p-4">

      {/* ── Mode switcher ── */}
      <div className="mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Search
        </p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onModeChange('clinics')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all flex items-center gap-2
                        ${mode === 'clinics'
                          ? 'bg-[#1a355d] text-white'
                          : 'text-gray-500 hover:bg-gray-50'}`}
          >
            {/* Clinic icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Clinics
          </button>

          <button
            onClick={() => onModeChange('doctors')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all flex items-center gap-2
                        ${mode === 'doctors'
                          ? 'bg-[#1a355d] text-white'
                          : 'text-gray-500 hover:bg-gray-50'}`}
          >
            {/* Doctor icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Doctors
          </button>
        </div>
      </div>

      <hr className="border-gray-100 mb-4" />

      {/* ── Filters header ── */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Filters
        </span>
        <button
          onClick={onReset}
          className="text-xs text-[#3182ce] hover:underline font-medium"
        >
          Reset
        </button>
      </div>

      {/* ── Specialty filter ── */}
      <FilterSection title="Specialty" hasActive={specialty !== 'All'}>
        {SPECIALTIES.map(s => (
          <FilterItem
            key={s}
            label={s}
            active={specialty === s}
            onClick={() => onSpecialtyChange(s)}
          />
        ))}
      </FilterSection>

      {/* ── Location filter ── */}
      <FilterSection title="Location" hasActive={city !== 'All cities'}>
        {CITIES.map(c => (
          <FilterItem
            key={c}
            label={c}
            active={city === c}
            onClick={() => onCityChange(c)}
          />
        ))}
      </FilterSection>

    </aside>
  );
}
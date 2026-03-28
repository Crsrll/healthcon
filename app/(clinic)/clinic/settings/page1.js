"use client";
import { useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────
function BellIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  );
}
function CalendarIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  );
}
function UserGroupIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );
}
function ShieldCheckIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}
function ClockIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
function CheckIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}
function TrashIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}
function PauseIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
  );
}
function WarningIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  );
}
function ChevronDownIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-1
        ${value ? "bg-teal-500" : "bg-slate-200"}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200
          ${value ? "left-6" : "left-1"}`}
      />
    </button>
  );
}

// ── Setting Row ───────────────────────────────────────────────────────────────
function SettingRow({ label, hint, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-0.5 leading-snug">{hint}</p>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ Icon, iconBg, iconColor, title, desc, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-slate-800">{title}</p>
          {desc && <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ type, onClose, onConfirm }) {
  const [text, setText] = useState("");
  const isDelete = type === "delete";
  const keyword  = isDelete ? "DELETE" : "DEACTIVATE";
  const valid    = text === keyword;

  return (
    <div
      className="fixed inset-0 bg-[#0f3460]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4
          ${isDelete ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"}`}>
          {isDelete ? <TrashIcon className="w-5 h-5" /> : <PauseIcon className="w-5 h-5" />}
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-1.5">
          {isDelete ? "Delete Clinic Account" : "Deactivate Clinic"}
        </h3>
        <p className="text-[13px] text-slate-500 leading-relaxed mb-5">
          {isDelete
            ? "This will permanently delete your clinic, all appointments, and patient records. This action cannot be undone."
            : "Your clinic will be hidden from patients and will not accept new bookings. You can reactivate at any time."}
        </p>

        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          Type <span className="text-slate-700">{keyword}</span> to confirm
        </label>
        <input
          autoFocus
          placeholder={`Type ${keyword}`}
          value={text}
          onChange={(e) => setText(e.target.value.toUpperCase())}
          className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none mb-4 transition-all
            ${valid
              ? "border-teal-400 ring-2 ring-teal-500/10"
              : isDelete
                ? "border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-400/10"
                : "border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10"
            }`}
        />

        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => valid && onConfirm()}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition
              ${isDelete
                ? "bg-red-500 hover:bg-red-600 disabled:bg-red-200"
                : "bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200"}
              disabled:cursor-not-allowed`}
          >
            {isDelete ? "Delete Forever" : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ClinicSettingsPage() {
  const [modal, setModal] = useState(null);
  const [saved, setSaved]   = useState(false);

  // Bookings
  const [acceptBookings, setAcceptBookings] = useState(true);
  const [autoConfirm,    setAutoConfirm]    = useState(false);
  const [walkIns,        setWalkIns]        = useState(true);

  // Notifications
  const [emailNotifs,    setEmailNotifs]    = useState(true);
  const [smsNotifs,      setSmsNotifs]      = useState(false);
  const [reminders,      setReminders]      = useState(true);
  const [feedback,       setFeedback]       = useState(true);

  // Capacity
  const [maxPatients,   setMaxPatients]   = useState("30");
  const [slotDuration,  setSlotDuration]  = useState("30");
  const [bufferTime,    setBufferTime]    = useState("5");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-3xl mx-auto px-5 py-10 space-y-5">

        {/* PAGE HEADER */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f3460] flex items-center justify-center text-teal-400 flex-shrink-0">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 leading-tight">Clinic Settings</h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage preferences and account configuration</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>

        {/* BOOKINGS */}
        <SectionCard
          Icon={CalendarIcon}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
          title="Bookings"
          desc="Control how your clinic accepts appointments"
        >
          <SettingRow
            label="Accept Online Bookings"
            hint="Allow patients to book appointments through the platform"
            value={acceptBookings}
            onChange={setAcceptBookings}
          />
          <SettingRow
            label="Auto-Confirm Appointments"
            hint="Automatically confirm bookings without manual review"
            value={autoConfirm}
            onChange={setAutoConfirm}
          />
          <SettingRow
            label="Allow Walk-in Patients"
            hint="Accept patients without prior appointment"
            value={walkIns}
            onChange={setWalkIns}
          />
        </SectionCard>

        {/* NOTIFICATIONS */}
        <SectionCard
          Icon={BellIcon}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          title="Notifications"
          desc="Choose how you receive updates and alerts"
        >
          <SettingRow
            label="Email Notifications"
            hint="Receive appointment updates via email"
            value={emailNotifs}
            onChange={setEmailNotifs}
          />
          <SettingRow
            label="SMS Notifications"
            hint="Receive appointment updates via text message"
            value={smsNotifs}
            onChange={setSmsNotifs}
          />
          <SettingRow
            label="Appointment Reminders"
            hint="Send automatic reminders to patients before their visit"
            value={reminders}
            onChange={setReminders}
          />
          <SettingRow
            label="Patient Feedback Alerts"
            hint="Get notified when a patient submits a review or feedback"
            value={feedback}
            onChange={setFeedback}
          />
        </SectionCard>

        {/* CAPACITY */}
        <SectionCard
          Icon={UserGroupIcon}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          title="Capacity & Scheduling"
          desc="Set patient limits and appointment slot configuration"
        >
          <div className="py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Max Patients */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Max Patients / Day
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <UserGroupIcon className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={maxPatients}
                  onChange={(e) => setMaxPatients(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
                />
              </div>
            </div>

            {/* Slot Duration */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Slot Duration
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ClockIcon className="w-4 h-4" />
                </span>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-2.5 pl-9 pr-8 text-sm text-slate-800 bg-white outline-none appearance-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
                >
                  {["15", "20", "30", "45", "60"].map((v) => (
                    <option key={v} value={v}>{v} min</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            {/* Buffer Time */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Buffer Between Slots
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ClockIcon className="w-4 h-4" />
                </span>
                <select
                  value={bufferTime}
                  onChange={(e) => setBufferTime(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-2.5 pl-9 pr-8 text-sm text-slate-800 bg-white outline-none appearance-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
                >
                  {["0", "5", "10", "15"].map((v) => (
                    <option key={v} value={v}>{v === "0" ? "None" : `${v} min`}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

          </div>
        </SectionCard>

        {/* SAVE BAR */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all
              ${saved ? "bg-emerald-500" : "bg-[#0f3460] hover:bg-[#0d2d56]"}`}
          >
            {saved
              ? <><CheckIcon className="w-4 h-4" /> Saved!</>
              : "Save Settings"
            }
          </button>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-white border border-red-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-red-50 border-b border-red-100">
            <WarningIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-[13px] font-bold text-red-800">Danger Zone</p>
              <p className="text-[11px] text-red-400 mt-0.5">These actions are permanent — proceed with caution</p>
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            <div className="flex items-center justify-between px-5 py-4 gap-4 hover:bg-red-50/30 transition">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">Deactivate Clinic</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Temporarily hide your clinic from patients. No new bookings will be accepted. You can reactivate anytime.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal("deactivate")}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:border-amber-300 transition"
              >
                <PauseIcon className="w-3.5 h-3.5" />
                Deactivate
              </button>
            </div>

            <div className="flex items-center justify-between px-5 py-4 gap-4 hover:bg-red-50/30 transition">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">Delete Clinic Account</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Permanently delete all clinic data, appointments, and records. This cannot be undone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal("delete")}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>

      </div>

      {modal && (
        <ConfirmModal
          type={modal}
          onClose={() => setModal(null)}
          onConfirm={() => setModal(null)}
        />
      )}
    </main>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/authContext";
import {
  Calendar, Bell, Users, Clock, ShieldAlert,
  TrashIcon, PauseIcon, CheckIcon, Loader2, PlayIcon,
} from "lucide-react";

// ── CONFIRM MODAL ──────────────────────────────────────────────────────────────
function ConfirmModal({ type, onClose, onConfirm, isLoading, error }) {
  const [text, setText] = useState("");
  const isDelete  = type === "delete";
  const keyword   = isDelete ? "DELETE" : "DEACTIVATE";
  const valid     = text === keyword;

  return (
    <div
      className="fixed inset-0 bg-[#0f3460]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => !isLoading && onClose()}
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
          disabled={isLoading}
          className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none mb-2 transition-all disabled:opacity-50
            ${valid
              ? "border-teal-400 ring-2 ring-teal-500/10"
              : isDelete
                ? "border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-400/10"
                : "border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10"
            }`}
        />

        {error && (
          <p className="text-xs text-red-500 mb-3 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
            {error}
          </p>
        )}

        <div className="flex gap-2.5 mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid || isLoading}
            onClick={() => valid && !isLoading && onConfirm()}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition flex items-center justify-center gap-2
              ${isDelete
                ? "bg-red-500 hover:bg-red-600 disabled:bg-red-200"
                : "bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200"}
              disabled:cursor-not-allowed`}
          >
            {isLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              : isDelete ? "Delete Forever" : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TOGGLE SWITCH ──────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <div
      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors flex-shrink-0
        ${checked ? "bg-teal-500" : "bg-slate-200"}`}
      onClick={onChange}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform
        ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ClinicSettingsPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [modal, setModal]             = useState(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [actionError, setActionError] = useState(null);
  const [saved, setSaved]             = useState(false);
  const [isSaving, setIsSaving]       = useState(false);

  const [autoconfirmAppt, setAutoConfirmAppt] = useState(false);
  const [walkinPatients, setWalkinPatients]   = useState(false);
  const [emailNotifs, setEmailNotifs]         = useState(true);
  const [reminders, setReminders]             = useState(true);
  const [feedback, setFeedback]               = useState(true);
  const [maxPatients, setMaxPatients]         = useState("30");
  const [slotDuration, setSlotDuration]       = useState("30 minutes");
  const [bufferbetween, setBufferBetween]     = useState("10 minutes");

  const isInactive = user?.status === "inactive";

  // ── Save settings ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Open modal ─────────────────────────────────────────────────────────────
  const openModal = (type) => {
    setActionError(null);
    setModal(type);
  };

  // ── Deactivate ─────────────────────────────────────────────────────────────
  const handleDeactivateClinic = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const res = await fetch("/api/clinics/deactivate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId: user?.uid }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to deactivate clinic.");
      }

      await refreshUser?.();
      setModal(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteClinic = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const res = await fetch("/api/clinics/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId: user?.uid }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete clinic.");
      }

      await signOut(auth);
      router.push("/");
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Reactivate ─────────────────────────────────────────────────────────────
  const handleReactivate = async () => {
    try {
      const res = await fetch("/api/clinics/reactivate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId: user?.uid }),
      });

      if (!res.ok) throw new Error("Failed to reactivate.");

      await refreshUser?.();
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Dispatch ───────────────────────────────────────────────────────────────
  const handleConfirmAction = () => {
    if (modal === "delete")     handleDeleteClinic();
    if (modal === "deactivate") handleDeactivateClinic();
  };

  return (
    <main className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* ── INACTIVE BANNER ── */}
      {isInactive && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PauseIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-700">Your clinic is deactivated</p>
              <p className="text-xs text-amber-600 mt-0.5">
                It is currently hidden from patients and not accepting bookings.
              </p>
            </div>
          </div>
          <button
            onClick={handleReactivate}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition"
          >
            <PlayIcon className="w-3.5 h-3.5" />
            Reactivate
          </button>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-800">Clinic Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">Manage your clinic's preferences and configurations</p>
      </div>

      {/* ── BOOKINGS ── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Calendar size={18} /></div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bookings</h3>
        </div>
        <p className="text-sm text-slate-500 mb-6">Control how your clinic accepts appointments</p>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Auto-confirm Appointments</p>
              <p className="text-xs text-slate-400 mt-0.5">Automatically confirm appointments without manual approval</p>
            </div>
            <Toggle checked={autoconfirmAppt} onChange={() => setAutoConfirmAppt(!autoconfirmAppt)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Allow Walk-in Patients</p>
              <p className="text-xs text-slate-400 mt-0.5">Accept patients without prior appointments</p>
            </div>
            <Toggle checked={walkinPatients} onChange={() => setWalkinPatients(!walkinPatients)} />
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── NOTIFICATIONS ── */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Bell size={18} /></div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</h3>
          </div>
          <div className="space-y-6">
            {[
              { id: "email",  label: "Email Notifications",      sub: "Get notified about new appointments", state: emailNotifs, fn: setEmailNotifs },
              { id: "remind", label: "Appointment Reminders",    sub: "Send reminders to patients",          state: reminders,  fn: setReminders  },
              { id: "feed",   label: "Collect Patient Feedback", sub: "Allow feedback after appointments",   state: feedback,   fn: setFeedback   },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                </div>
                <Toggle checked={item.state} onChange={() => item.fn(!item.state)} />
              </div>
            ))}
          </div>
        </section>

        {/* ── CAPACITY & SCHEDULING ── */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Users size={18} /></div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capacity & Scheduling</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1.5">
                <Users size={14} /> Max Patients per Day
              </label>
              <input
                type="number"
                value={maxPatients}
                onChange={(e) => setMaxPatients(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-400 transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1.5">
                <Clock size={14} /> Slot Duration
              </label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-400 transition-all"
              >
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>60 minutes</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1.5">
                <Clock size={14} /> Buffer Time
              </label>
              <input
                value={bufferbetween}
                onChange={(e) => setBufferBetween(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-400 transition-all"
              />
            </div>
          </div>
        </section>
      </div>

      {/* ── SAVE / DISCARD ── */}
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
          disabled={isSaving}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all disabled:opacity-70
            ${saved ? "bg-emerald-500" : "bg-[#0f3460] hover:bg-[#0d2d56]"}`}
        >
          {isSaving
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            : saved
              ? <><CheckIcon className="w-4 h-4" /> Saved!</>
              : "Save Settings"}
        </button>
      </div>

      {/* ── DANGER ZONE ── */}
      <section className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4 text-red-500">
          <ShieldAlert size={18} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Danger Zone</h3>
        </div>
        <p className="text-sm text-slate-500 mb-6">These actions are permanent — proceed with caution</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Deactivate — hidden if already inactive, shows reactivate instead */}
          {isInactive ? (
            <div className="flex items-center justify-between px-5 py-4 gap-4 border border-amber-100 rounded-xl bg-amber-50/30">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">Reactivate Clinic</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">Make your clinic visible to patients again.</p>
              </div>
              <button
                type="button"
                onClick={handleReactivate}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
              >
                <PlayIcon className="w-3.5 h-3.5" /> Reactivate
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-5 py-4 gap-4 border border-slate-100 rounded-xl hover:bg-amber-50/30 transition">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">Deactivate Clinic</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">Temporarily hide your clinic from patients.</p>
              </div>
              <button
                type="button"
                onClick={() => openModal("deactivate")}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
              >
                <PauseIcon className="w-3.5 h-3.5" /> Deactivate
              </button>
            </div>
          )}

          {/* Delete */}
          <div className="flex items-center justify-between px-5 py-4 gap-4 border border-slate-100 rounded-xl hover:bg-red-50/30 transition">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">Delete Clinic</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">Permanently delete all clinic data.</p>
            </div>
            <button
              type="button"
              onClick={() => openModal("delete")}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition"
            >
              <TrashIcon className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      {modal && (
        <ConfirmModal
          type={modal}
          onClose={() => !isLoading && setModal(null)}
          onConfirm={handleConfirmAction}
          isLoading={isLoading}
          error={actionError}
        />
      )}
    </main>
  );
}
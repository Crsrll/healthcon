"use client";
import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import {
  Settings,
  ShieldAlert,
  Power,
  ChevronRight,
  Trash2,
  Info
} from "lucide-react";

export default function AccountSettingsPage() {
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountStatus, setAccountStatus] = useState("Active");

  const handleDeactivate = () => {
    setAccountStatus("Deactivated");
    setIsDeactivateModalOpen(false);
    alert("Your account has been deactivated. You can reactivate it by logging in again.");
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
    alert("Account permanently deleted. Redirecting to landing page...");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 font-sans">

      <div className="bg-[#1a365d] text-white pt-10 pb-14 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
              <Link href="/patient/dashboard" className="hover:text-white transition-colors">Patient</Link>
              <ChevronRight size={10} />
              <span className="text-white/60">Settings</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold">Account Settings</h1>
            <p className="text-blue-200/70 text-sm mt-1">Manage your account status and data privacy. </p>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 mt-8 space-y-4">

        {/* ── ACCOUNT STATUS ── */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center
              ${accountStatus === "Active" ? "bg-teal-50 text-teal-600" : "bg-slate-100 text-slate-400"}`}>
              <Settings size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
              <p className={`text-base font-black uppercase ${accountStatus === "Active" ? "text-teal-600" : "text-slate-400"}`}>
                {accountStatus}
              </p>
            </div>
          </div>
          {accountStatus === "Deactivated" && (
            <button
              onClick={() => setAccountStatus("Active")}
              className="bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Reactivate
            </button>
          )}
        </section>

        {/* ── DANGER ZONE ── */}
        <section className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-red-50 bg-red-50/30 flex items-center gap-3">
            <ShieldAlert className="text-red-500" size={18} />
            <h2 className="text-[10px] font-black text-red-800 uppercase tracking-widest">Danger Zone</h2>
          </div>

          <div className="p-6 space-y-6">

            {/* Deactivate */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deactivate Account</p>
                <p className="text-sm font-semibold text-slate-700">Temporarily disable your account</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Your profile and records will be hidden from clinics, but your data will be saved for when you return.
                </p>
              </div>
              <button
                onClick={() => setIsDeactivateModalOpen(true)}
                disabled={accountStatus === "Deactivated"}
                className="shrink-0 px-5 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 transition-all"
              >
                Deactivate
              </button>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Delete */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Delete Account</p>
                <p className="text-sm font-semibold text-slate-700">Permanently delete your account</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Once deleted, all your medical history, prescriptions, and appointments will be wiped from our servers. This cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="shrink-0 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-900/20 transition-all active:scale-95"
              >
                Delete Account
              </button>
            </div>

          </div>
        </section>

        {/* ── INFO BOX ── */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
          <p className="text-[11px] text-blue-700 leading-relaxed">
            Looking to change your email or phone number? Please visit the{" "}
            <Link href="/patient/profile" className="font-black underline hover:text-blue-900 transition-colors">
              Profile Page
            </Link>{" "}
            instead.
          </p>
        </div>
      </div>

      {/* ── MODAL: DEACTIVATE ── */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        title="Deactivate Account"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-4">
              <Power size={28} />
            </div>
            <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">Take a break?</h4>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              You can reactivate your account anytime by logging back in. Your data will remain safe.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDeactivate}
              className="flex-1 bg-[#1a365d] hover:bg-[#1e3f6e] text-white py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
            >
              Confirm Deactivation
            </button>
            <button
              onClick={() => setIsDeactivateModalOpen(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* ── MODAL: DELETE ── */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Permanent Deletion"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4">
              <Trash2 size={28} />
            </div>
            <h4 className="text-base font-black text-red-600 uppercase tracking-tight">This is permanent</h4>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Are you absolutely sure? All your medical records and history will be lost forever.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-900/20 transition-all active:scale-95"
            >
              Yes, Delete Everything
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
            >
              I changed my mind
            </button>
          </div>
        </div>
      </Modal>

    </main>
  );
}
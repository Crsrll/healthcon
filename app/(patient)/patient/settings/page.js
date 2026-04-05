"use client";
import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { 
  Settings, 
  ShieldAlert, 
  UserX, 
  Power, 
  ChevronRight, 
  AlertTriangle,
  Trash2,
  Info
} from "lucide-react";

export default function AccountSettingsPage() {
  // --- STATES ---
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountStatus, setAccountStatus] = useState("Active");

  // --- HANDLERS ---
  const handleDeactivate = () => {
    setAccountStatus("Deactivated");
    setIsDeactivateModalOpen(false);
    alert("Your account has been deactivated. You can reactivate it by logging in again.");
  };

  const handleDelete = () => {
    // In a real app, this would call your API to delete the user
    setIsDeleteModalOpen(false);
    alert("Account permanently deleted. Redirecting to landing page...");
    window.location.href = "/"; // Redirect to home
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      
      {/* ── HEADER ── */}
      <div className="bg-[#1a365d] text-white pt-12 pb-16 px-8">
        <div className="max-w-full mx-auto">
          <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <Link href="/patient/dashboard" className="hover:text-white transition-colors">Patient</Link>
            <ChevronRight size={10} />
            <span className="text-white/60">Settings</span>
          </nav>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-teal-300 text-sm mt-1">Manage your account status and data privacy.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 mt-10 space-y-6">
        
        {/* ── 1. ACCOUNT STATUS CARD ── */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accountStatus === 'Active' ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
              <Settings size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
              <p className="text-lg font-black text-slate-800 uppercase">{accountStatus}</p>
            </div>
          </div>
          {accountStatus === "Deactivated" && (
            <button 
              onClick={() => setAccountStatus("Active")}
              className="bg-teal-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all"
            >
              Reactivate
            </button>
          )}
        </section>

        {/* ── 2. DANGER ZONE ── */}
        <section className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-red-50 bg-red-50/30 flex items-center gap-3">
            <ShieldAlert className="text-red-500" size={20} />
            <h2 className="font-black text-red-800 uppercase text-xs tracking-widest">Danger Zone</h2>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Deactivate Option */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm uppercase">Deactivate Account</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Temporarily disable your account. Your profile and records will be hidden from clinics, but your data will be saved for when you return.
                </p>
              </div>
              <button 
                onClick={() => setIsDeactivateModalOpen(true)}
                disabled={accountStatus === "Deactivated"}
                className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50 transition-all shrink-0"
              >
                Deactivate
              </button>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* Delete Option */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="font-bold text-red-600 text-sm uppercase">Delete Account Permanently</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Once you delete your account, there is no going back. All your medical history, prescriptions, and appointments will be wiped from our servers.
                </p>
              </div>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-6 py-3 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-900/20 transition-all active:scale-95 shrink-0"
              >
                Delete Account
              </button>
            </div>

          </div>
        </section>

        {/* ── INFO BOX ── */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <Info className="text-blue-500 shrink-0" size={18} />
          <p className="text-[11px] text-blue-700 leading-relaxed">
            Looking to change your email or phone number? Please visit the <Link href="/patient/profile" className="font-bold underline">Profile Page</Link> instead.
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
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4">
              <Power size={32} />
            </div>
            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Take a break?</h4>
            <p className="text-sm text-slate-500 mt-2">
              You can reactivate your account anytime by logging back in. Your data will remain safe.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleDeactivate} className="flex-1 bg-[#1a365d] text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">Confirm Deactivation</button>
            <button onClick={() => setIsDeactivateModalOpen(false)} className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
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
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={32} />
            </div>
            <h4 className="text-lg font-black text-red-600 uppercase tracking-tight">This is permanent</h4>
            <p className="text-sm text-slate-500 mt-2">
              Are you absolutely sure? All your medical records and history will be lost forever.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-900/20">Yes, Delete Everything</button>
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">I changed my mind</button>
          </div>
        </div>
      </Modal>

    </main>
  );
}
"use client";
import { useState } from "react";
import { Calendar, Bell, Users, Clock, ShieldAlert,TrashIcon,PauseIcon,CheckIcon } from "lucide-react";

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
            // FIXED: Removed "ConfirmModal." prefix and added () to call function
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

// ── MAIN PAGE COMPONENT ──
export default function ClinicSettingsPage() {  
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);
  const [autoconfirmAppt, setAutoConfirmAppt] = useState(false);
  const [walkinPatients, setWalkinPatients] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [feedback, setFeedback] = useState(true);
  const [maxPatients, setMaxPatients] = useState("30");
  const [slotDuration, setSlotDuration] = useState("30 minutes");
  const [bufferbetween, setBufferBetween] = useState("10 minutes");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    console.log("Settings saved!");
  };

  const handleConfirmAction = () => {
    console.log(`Action confirmed for: ${modal}`);
    setModal(null);
  };
  
  return (
    <main className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Clinic Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">Manage your clinic's preferences and configurations</p>
      </div>
      
      {/* ── BOOKINGS SECTION ── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
            <Calendar size={18} />
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bookings</h3>
        </div>
        <p className="text-sm text-slate-500 mb-6">Control how your clinic accepts appointments</p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Auto-confirm Appointments</p>
              <p className="text-xs text-slate-400 mt-0.5">Automatically confirm appointments without manual approval</p>
            </div>
            <div 
              className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${autoconfirmAppt ? 'bg-teal-500' : 'bg-slate-200'}`} 
              onClick={() => setAutoConfirmAppt(!autoconfirmAppt)}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${autoconfirmAppt ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Allow Walk-in Patients</p>
              <p className="text-xs text-slate-400 mt-0.5">Accept patients without prior appointments</p>
            </div>
            <div 
              className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${walkinPatients ? 'bg-teal-500' : 'bg-slate-200'}`} 
              onClick={() => setWalkinPatients(!walkinPatients)}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${walkinPatients ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── NOTIFICATIONS ── */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Bell size={18} />
            </div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { id: 'email', label: 'Email Notifications', sub: 'Get notified about new appointments', state: emailNotifs, fn: setEmailNotifs },
              { id: 'remind', label: 'Appointment Reminders', sub: 'Send reminders to patients', state: reminders, fn: setReminders },
              { id: 'feed', label: 'Collect Patient Feedback', sub: 'Allow feedback after appointments', state: feedback, fn: setFeedback }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                </div>
                <div 
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.state ? 'bg-teal-500' : 'bg-slate-200'}`} 
                  onClick={() => item.fn(!item.state)}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.state ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CAPACITY & SCHEDULING ── */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Users size={18} />
            </div>
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
                onChange={e => setMaxPatients(e.target.value)} 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-400 transition-all" 
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1.5">
                <Clock size={14} /> Slot Duration
              </label>
              <select 
                value={slotDuration} 
                onChange={e => setSlotDuration(e.target.value)} 
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
                onChange={e => setBufferBetween(e.target.value)} 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-400 transition-all" 
              />
            </div>
          </div>
        </section>
      </div>

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

      {/* ── DANGER ZONE ── */}
      <section className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4 text-red-500">
          <ShieldAlert size={18} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Danger Zone</h3>
        </div>
        <p className="text-sm text-slate-500 mb-6">These actions are permanent — proceed with caution</p>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between px-5 py-4 gap-4 border border-slate-50 rounded-xl hover:bg-red-50/30 transition">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">Deactivate Clinic</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                Temporarily hide your clinic from patients.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModal("deactivate")}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
            >
              <PauseIcon className="w-3.5 h-3.5" />
              Deactivate
            </button>
          </div>

          <div className="flex items-center justify-between px-5 py-4 gap-4 border border-slate-50 rounded-xl hover:bg-red-50/30 transition">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">Delete Clinic</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                Permanently delete all clinic data.
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
      </section>

      {modal && (
        <ConfirmModal
          type={modal}
          onClose={() => setModal(null)}
          onConfirm={handleConfirmAction} // FIXED: Added missing onConfirm prop
        />
      )}
    </main>
  );
}
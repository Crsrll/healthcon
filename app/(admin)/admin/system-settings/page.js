"use client";
import { useState } from "react";

export default function SystemSettingsPage() {
  const [emailNotifs,  setEmailNotifs]  = useState(true);
  const [autoApprove,  setAutoApprove]  = useState(false);
  const [maintenance,  setMaintenance]  = useState(false);
  const [maxBookings,  setMaxBookings]  = useState("20");
  const [commissionPct,setCommission]  = useState("5");

  function Toggle({ value, onChange }) {
    return (
      <button onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative transition-colors shrink-0
                    ${value ? 'bg-teal-500' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow
                         transition-all ${value ? 'left-6' : 'left-1'}`} />
      </button>
    );
  }

  return (
    <main className="p-6 space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold text-slate-800">System Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">Platform-wide configuration</p>
      </div>

      {/* General */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          General
        </h3>
        {[
          { label:"Email Notifications",  sub:"Send system emails to clinic admins",   val:emailNotifs, set:setEmailNotifs },
          { label:"Auto-approve Clinics", sub:"Skip manual review for new registrations — not recommended", val:autoApprove, set:setAutoApprove },
          { label:"Maintenance Mode",     sub:"Take platform offline for all users",   val:maintenance, set:setMaintenance },
        ].map(item => (
          <div key={item.label}
            className="flex items-center justify-between py-3 border-b border-slate-50
                       last:border-0">
            <div>
              <p className="text-sm font-semibold text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
            </div>
            <Toggle value={item.val} onChange={item.set} />
          </div>
        ))}
      </section>

      {/* Platform config */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Platform Configuration
        </h3>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
            Max Bookings Per Doctor Per Day
          </label>
          <input type="number" value={maxBookings}
            onChange={e => setMaxBookings(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-32
                       outline-none focus:border-teal-400 transition-colors"/>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
            Platform Commission (%)
          </label>
          <input type="number" value={commissionPct}
            onChange={e => setCommission(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-32
                       outline-none focus:border-teal-400 transition-colors"/>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">
          Danger Zone
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-red-50">
            <div>
              <p className="text-sm font-semibold text-slate-700">Clear All Audit Logs</p>
              <p className="text-xs text-slate-400">Permanently deletes system logs</p>
            </div>
            <button className="text-xs font-bold text-red-500 border border-red-200
                               hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
              Clear Logs
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Reset Platform Data</p>
              <p className="text-xs text-slate-400">Wipes all test data — production only</p>
            </div>
            <button className="text-xs font-bold text-red-500 border border-red-200
                               hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
              Reset
            </button>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button className="bg-healthcon-blue hover:bg-blue-900 text-white font-semibold
                           text-sm px-6 py-2.5 rounded-xl transition-colors">
          Save Settings
        </button>
      </div>
    </main>
  );
}
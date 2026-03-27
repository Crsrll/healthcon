"use client";
import { useState } from "react";

export default function ClinicSettingsPage() {
  const [acceptBookings, setAcceptBookings] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [maxPatients, setMaxPatients] = useState("30");
  const [clinicName, setClinicName] = useState("Sample Clinic");

  function Toggle({ value, onChange }) {
    return (
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative transition-colors
        ${value ? "bg-teal-500" : "bg-slate-200"}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all
          ${value ? "left-6" : "left-1"}`}
        />
      </button>
    );
  }

  return (
    <main className="p-6 space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Clinic Settings</h2>
        <p className="text-xs text-slate-400">Manage your clinic configuration</p>
      </div>

      {/* General */}
      <section className="bg-white p-6 rounded-2xl border space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase">
          General
        </h3>

        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Accept Bookings</p>
          <Toggle value={acceptBookings} onChange={setAcceptBookings} />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Email Notifications</p>
          <Toggle value={emailNotifs} onChange={setEmailNotifs} />
        </div>
      </section>

      {/* Clinic Info */}
      <section className="bg-white p-6 rounded-2xl border space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase">
          Clinic Info
        </h3>

        <div>
          <label className="text-xs font-semibold">Clinic Name</label>
          <input
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            className="border rounded-xl px-3 py-2 w-full mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-semibold">
            Max Patients Per Day
          </label>
          <input
            type="number"
            value={maxPatients}
            onChange={(e) => setMaxPatients(e.target.value)}
            className="border rounded-xl px-3 py-2 w-32 mt-1"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-5 py-2 rounded-xl">
          Save Settings
        </button>
      </div>
    </main>
  );
}
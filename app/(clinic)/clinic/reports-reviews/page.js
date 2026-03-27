"use client";
import { useState } from "react";

const REPORTS = [
  {
    id: 1,
    patient: "John Doe",
    issue: "Doctor was late",
    date: "Mar 20",
    severity: "medium",
  },
];

const REVIEWS = [
  {
    id: 1,
    patient: "Jane Smith",
    rating: 4,
    comment: "Good service but waiting time was long",
    date: "Mar 19",
  },
];

export default function ClinicReportsPage() {
  const [tab, setTab] = useState("Reports");

  return (
    <main className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold">Reports & Reviews</h2>
        <p className="text-xs text-slate-400">
          Feedback and issues for your clinic
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        {["Reports", "Reviews"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 text-xs rounded-lg
              ${tab === t ? "bg-white shadow" : "text-slate-400"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Reports */}
      {tab === "Reports" && (
        <section className="bg-white p-6 rounded-2xl border">
          {REPORTS.map((r) => (
            <div key={r.id} className="border-b py-3">
              <p className="font-semibold">{r.patient}</p>
              <p className="text-sm text-slate-500">{r.issue}</p>
              <p className="text-xs text-slate-400">{r.date}</p>
            </div>
          ))}
        </section>
      )}

      {/* Reviews */}
      {tab === "Reviews" && (
        <section className="bg-white p-6 rounded-2xl border">
          {REVIEWS.map((r) => (
            <div key={r.id} className="border-b py-3">
              <p className="font-semibold">{r.patient}</p>
              <p className="text-sm">⭐ {r.rating}/5</p>
              <p className="text-sm text-slate-500">{r.comment}</p>
              <p className="text-xs text-slate-400">{r.date}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
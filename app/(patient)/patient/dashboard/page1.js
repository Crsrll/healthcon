"use client";
import { useState } from "react";
import Link from "next/link";

export default function PatientDashboard() {
  const [search, setSearch] = useState("");

  const shortCuts = [
    {
      name: "Book Appointment",
      href: "/clinics",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
        </svg>
      ),
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-100 hover:border-teal-400",
    },
    {
      name: "Medical Records",
      href: "/medical-records",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      ),
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100 hover:border-blue-400",
    },
    {
      name: "Favorite Clinics",
      href: "/favorite-clinics",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ),
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100 hover:border-amber-400",
    },
  ];

  const appointments = [
    { id: "1", date: "Mar 23", time: "10:00 AM", doctor: "Dr. Smith", clinic: "Joseph Community Health", status: "Confirmed", specialty: "General" },
    { id: "2", date: "Mar 25", time: "11:00 AM", doctor: "Dr. John", clinic: "Joseph Community Health", status: "Pending", specialty: "Cardiology" },
  ];

  const nearbyClinics = [
    { id: "1", name: "CDO General Outpatient", city: "Cagayan de Oro", specialty: "Ob-Gyne", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400" },
    { id: "2", name: "Iligan Medical Center", city: "Iligan City", specialty: "Cardiology", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400" },
    { id: "3", name: "Bukidnon Community", city: "Malaybalay", specialty: "General", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400" },
  ];

  return (
    <main className="min-h-screen bg-slate-100 pb-12 font-sans">

      {/* ── HERO HEADER ── */}
<div className="relative bg-healthcon-blue overflow-hidden">
  {/* Subtle grid texture */}
  <div
    className="absolute inset-0 opacity-10"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
    }}
  />
  {/* Glow blob */}
  <div className="absolute -top-10 -right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

  {/* Main Header Container */}
  <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-16">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      
      {/* LEFT SIDE: Greetings */}
      <div className="flex-1">
        <p className="text-teal-300 text-xs font-semibold uppercase tracking-widest mb-1">Patient Portal</p>
        <h1 className="text-white text-2xl font-bold">Good Day, Melissa! 👋</h1>
        <p className="text-slate-300 text-sm mt-1 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          Next appointment: <span className="text-teal-300 font-medium">Today at 10:00 AM</span>
        </p>
      </div>

      {/* RIGHT SIDE: Search Bar */}
      <div className="w-full md:w-auto md:min-w-[450px]">
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clinics, doctors..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20 focus:border-teal-400/60 transition-all"
            />
          </div>
          <button 
            type="submit"
            className="bg-teal-500 hover:bg-teal-400 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md shadow-teal-900/30"
          >
            Search
          </button>
        </form>
      </div>

    </div>
  </div>
</div>

      {/* ── MAIN CONTENT (overlaps header) ── */}
      <div className="max-w-7xl mx-auto px-6 mt-6 space-y-6">

        {/* SHORTCUTS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {shortCuts.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`bg-white rounded-2xl border ${item.border} px-5 py-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all group`}
            >
              <div className={`${item.bg} ${item.color} p-2.5 rounded-xl transition-transform group-hover:scale-110`}>
                {item.icon}
              </div>
              <span className="font-semibold text-slate-700 text-sm">{item.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — 2 cols */}
          <div className="lg:col-span-2 space-y-6">

            {/* UPCOMING VISITS */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">Upcoming Visits</h2>
                <Link href="/appointments" className="text-xs text-teal-600 font-semibold hover:underline">View All</Link>
              </div>
              <div className="p-5 space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 transition-all group"
                  >
                    {/* Date block */}
                    <div className="shrink-0 w-12 h-12 bg-healthcon-blue rounded-xl flex flex-col items-center justify-center text-white">
                      <span className="text-[9px] font-bold uppercase opacity-70 leading-none">
                        {apt.date.split(" ")[0]}
                      </span>
                      <span className="text-base font-bold leading-tight">
                        {apt.date.split(" ")[1]}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-slate-800 text-sm">{apt.doctor}</h3>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${apt.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{apt.clinic}</p>
                      <p className="text-xs text-teal-600 font-medium mt-0.5">{apt.time} · {apt.specialty}</p>
                    </div>

                    {/* Action */}
                    <button className="shrink-0 text-xs font-semibold text-slate-400 group-hover:text-teal-600 transition-colors">
                      Details →
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* CLINICS NEAR YOU */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">Clinics Near You</h2>
                <Link href="/clinics" className="text-xs text-teal-600 font-semibold hover:underline">View All</Link>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nearbyClinics.slice(0, 2).map((clinic) => (
                  <Link
                    href={`/clinics/${clinic.id}`}
                    key={clinic.id}
                    className="group rounded-xl overflow-hidden border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={clinic.image}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt={clinic.name}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                      <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white bg-teal-600/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {clinic.specialty}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug">{clinic.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {clinic.city}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT — sidebar */}
          <aside className="space-y-6">

            {/* RECENTLY VIEWED */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">Recently Viewed</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {nearbyClinics.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <img
                      src={item.image}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                      alt={item.name}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-teal-700 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Viewed 2 days ago</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-400 shrink-0 transition-colors">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                ))}
                <p classname="justify-center">View All</p>
              </div>
            </section>

            {/* HEALTH TIP CARD */}
            <div className="bg-linear-to-br from-healthcon-blue to-[#1e4976] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-400/10 rounded-full blur-2xl" />
              <p className="text-teal-300 text-[10px] font-bold uppercase tracking-widest mb-2">Health Tip</p>
              <p className="text-sm font-semibold leading-snug">Stay hydrated — drink at least 8 glasses of water daily for optimal health.</p>
              <button className="mt-4 text-xs font-semibold text-teal-300 hover:text-teal-200 transition-colors">
                More Tips →
              </button>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}
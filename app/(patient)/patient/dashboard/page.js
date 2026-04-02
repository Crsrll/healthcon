"use client";
import { useState } from "react";
import Link from "next/link";
import { Calendar, FileText, Star, Search, ChevronRight, Pill, Beaker, ShieldCheck, PhoneCall, ArrowRight } from "lucide-react";

export default function PatientDashboard() {
  const [search, setSearch] = useState("");

  // --- MOCK DATA ---
  const appointments = [
    { id: "1", date: "Mar 23", time: "10:00 AM", doctor: "Dr. Ben Villanueva", clinic: "Joseph Community Health", status: "Confirmed", type: "General" },
    { id: "2", date: "Mar 25", time: "11:00 AM", doctor: "Dr. Claire Mendoza", clinic: "Joseph Community Health", status: "Pending", type: "Ob-Gyne" },
  ];

  const prescriptions = [
    { name: "Amoxicillin", dose: "500mg", freq: "3x a day", remaining: "4 days left" },
    { name: "Cetirizine", dose: "10mg", freq: "Once a day", remaining: "Ongoing" },
  ];

  const nearbyClinics = [
    { id: "1", name: "CDO General Outpatient", city: "Cagayan de Oro", specialty: "Ob-Gyne", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400" },
    { id: "2", name: "Iligan Medical Center", city: "Iligan City", specialty: "Cardiology", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400" },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12 font-sans">
      
      {/* ── HERO HEADER ── */}
      <div className="relative bg-[#1a365d] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Left: Greetings */}
            <div className="flex-1">
              <p className="text-teal-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Patient Portal</p>
              <h1 className="text-white text-3xl font-bold">Good Day, Melissa! 👋</h1>
              <p className="text-slate-300 text-sm mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                Next appointment: <span className="text-teal-300 font-semibold">Today at 10:00 AM</span>
              </p>
            </div>

            {/* Right: Search Bar */}
            <div className="w-full md:w-auto md:min-w-[400px]">
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search clinics, doctors..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20 focus:border-teal-400/60 transition-all"
                  />
                </div>
                <button type="submit" className="bg-teal-500 hover:bg-teal-400 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-teal-900/40">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

        {/* 1. PRIMARY SHORTCUTS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Book Appointment", href: "/clinics", icon: <Calendar />, color: "text-teal-600", bg: "bg-teal-50" },
            { name: "Medical Records", href: "/patient/medical-records", icon: <FileText />, color: "text-blue-600", bg: "bg-blue-50" },
            { name: "Favorite Clinics", href: "/patient/favorite-clinics", icon: <Star />, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((item) => (
            <Link key={item.name} href={item.href} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all flex items-center gap-4 group">
              <div className={`${item.bg} ${item.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <span className="font-bold text-slate-700 text-sm">{item.name}</span>
              <ChevronRight className="ml-auto text-slate-300 group-hover:text-teal-500" size={16} />
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── LEFT COLUMN (2/3) ── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* UPCOMING VISITS */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Upcoming Visits</h2>
                <Link href="/patient/appointments?timeframe=Upcoming" className="text-xs font-bold text-teal-600 hover:underline">View All</Link>
              </div>
              <div className="p-6 space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-teal-200 transition-all group">
                    <div className="w-12 h-12 bg-[#1a365d] rounded-xl flex flex-col items-center justify-center text-white shrink-0">
                      <span className="text-[8px] font-bold uppercase opacity-60">{apt.date.split(" ")[0]}</span>
                      <span className="text-base font-black">{apt.date.split(" ")[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-sm">{apt.doctor}</h3>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{apt.clinic} · {apt.time}</p>
                    </div>
                    <button className="text-xs font-bold text-slate-400 group-hover:text-teal-600 transition-colors">Details →</button>
                  </div>
                ))}
              </div>
            </section>

            {/* ACTIVE PRESCRIPTIONS */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Active Prescriptions</h2>
                <Link href="/patient/meds" className="text-xs font-bold text-teal-600 hover:underline">Pharmacy Info</Link>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prescriptions.map((med) => (
                  <div key={med.name} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                      <Pill size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{med.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{med.dose} · {med.freq}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{med.remaining}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CLINICS NEAR YOU */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-bold text-slate-800 text-lg">Clinics Near You</h2>
                <Link href="/clinics" className="text-xs font-bold text-teal-600 hover:underline">Explore Map</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {nearbyClinics.map((clinic) => (
                  <Link href={`/clinics/${clinic.id}`} key={clinic.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all group">
                    <div className="relative h-40 overflow-hidden">
                      <img src={clinic.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={clinic.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-3 left-4 text-[10px] font-black text-white bg-teal-500 px-3 py-1 rounded-full uppercase tracking-widest">
                        {clinic.specialty}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-800">{clinic.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{clinic.city}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN (1/3) ── */}
          <aside className="space-y-6">
            
            {/* PROFILE STRENGTH */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Profile Strength</h3>
                <span className="text-teal-600 font-black text-xs">65%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="bg-teal-500 h-full rounded-full transition-all duration-1000" style={{ width: '65%' }} />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-5">
                Complete your medical history to speed up your next clinic check-in.
              </p>
              <button className="w-full py-3 bg-slate-50 hover:bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-teal-100 transition-all">
                Finish Setup
              </button>
            </section>

            {/* LATEST LAB RESULTS */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 text-sm mb-5">Latest Lab Results</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Beaker size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">Blood Panel Test</p>
                    <p className="text-[10px] text-slate-400">Joseph Health · 2 days ago</p>
                    <span className="inline-flex items-center gap-1 text-[9px] font-black text-teal-600 uppercase mt-2">
                      <ShieldCheck size={10} /> Ready to View
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* EMERGENCY SOS */}
            <section className="bg-red-50 border border-red-100 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                  <PhoneCall size={20} />
                </div>
                <h3 className="font-bold text-red-700 text-sm uppercase tracking-tight">Emergency</h3>
              </div>
              <p className="text-[11px] text-red-600/70 mb-5 font-medium leading-relaxed">
                Immediately contact the nearest medical facility or dial our 24/7 hotline.
              </p>
              <button className="w-full py-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.1em] rounded-xl transition-all shadow-md shadow-red-200">
                Call Hotline Now
              </button>
            </section>

            {/* HEALTH TIP */}
            <div className="bg-gradient-to-br from-[#1a365d] to-[#2d4a77] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-400/10 rounded-full blur-2xl" />
              <p className="text-teal-300 text-[10px] font-black uppercase tracking-widest mb-3">Daily Health Tip</p>
              <p className="text-sm font-bold leading-snug">Stay hydrated — drink at least 8 glasses of water daily for optimal kidney function.</p>
              <button className="mt-5 flex items-center gap-2 text-[10px] font-bold text-teal-300 hover:text-teal-200 transition-colors uppercase">
                Read More <ArrowRight size={12} />
              </button>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}
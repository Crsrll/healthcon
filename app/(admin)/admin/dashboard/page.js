"use client";
import { useState } from "react";
import PulseCard from "@/components/ui/PulseCard";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import { Building2, Users, CalendarCheck, Banknote, AlertCircle, FileText } from "lucide-react";

const pendingClinics = [
  { id: 1, name: "City Care Plus",  owner: "Dr. Alon",    city: "Davao City", date: "2 hrs ago" },
  { id: 2, name: "Dermacare Cebu", owner: "Dr. Sanchez", city: "Cebu City",  date: "5 hrs ago" },
  { id: 3, name: "Metro Health",   owner: "Dr. Tan",     city: "Manila",     date: "1 day ago" },
  // { id: 3, name: "Central Health",   owner: "Dr. Kani",     city: "Dipolog",     date: "1 day ago" },
];

const topClinics = [
  { name: "Joseph Community Health", bookings: 420, growth: "+12%", color: "bg-teal-500" },
  { name: "Iligan Medical Center",   bookings: 310, growth: "+8%",  color: "bg-blue-500" },
  { name: "CDO Outpatient Clinic",   bookings: 215, growth: "+5%",  color: "bg-indigo-500" },
];

const auditLogs = [
  { action: "Clinic Approved — City Care Plus", time: "1h ago",  color: "border-teal-400",  dot: "bg-teal-400"  },
  { action: "New User Registered",              time: "2h ago",  color: "border-blue-400",  dot: "bg-blue-400"  },
  { action: "High Traffic Alert",               time: "3h ago",  color: "border-red-400",   dot: "bg-red-400"   },
  { action: "DB Backup Completed",              time: "5h ago",  color: "border-teal-400",  dot: "bg-teal-400"  },
  { action: "Doctor Flagged for Review",        time: "6h ago",  color: "border-amber-400", dot: "bg-amber-400" },
  { action: "System Settings Updated",          time: "8h ago",  color: "border-slate-300", dot: "bg-slate-400" },
];

export default function AdminDashboard() {
    const [modalType, setModalType] = useState("");
    const handleOpenModal = (type, clinic) => {
      setModalType(type);
      setSelectedClinic(clinic);
      setIsModalOpen(true);
    };


    const [clinics, setClinics] = useState(pendingClinics);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState(null);
       const handleConfirmApproval = () => {
        setClinics(prev => prev.filter(c => c.id !== selectedClinic.id));
        setIsModalOpen(false);
        alert(`${selectedClinic.name} has been approved!`);
    };

  return (
    <main className="p-6 space-y-6 animate-in fade-in duration-500">

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
        <Link href="/admin/clinics" className="block">
          <PulseCard title="Total Clinics" value="142" valueClass="text-2xl" subtext="12 pending approval" icon={<Building2 size={24} />} color="text-blue-600" iconBg="bg-blue-50" border="border-blue-200" />
        </Link>
        <Link href="/admin/users" className="block">
          <PulseCard title="Total Users"value="10,390" valueClass="text-2xl" subtext="Patients and Clinics" icon={<Users size={24} />} color="text-emerald-600" iconBg="bg-emerald-50" border="border-emerald-200" />
        </Link>
        <Link href="/admin/bookings" className="block">
          <PulseCard title="Active Bookings" value="1,205" valueClass="text-2xl" subtext="Live across platform" icon={<CalendarCheck size={24} />} color="text-indigo-600" iconBg="bg-indigo-50" border="border-indigo-200" />
        </Link>
        <Link href="/admin/revenue" className="block">
          <PulseCard title="Revenue" value="₱250.8k" valueClass="text-2xl" subtext="Commission (March)" icon={<Banknote size={24} />} color="text-emerald-600" iconBg="bg-emerald-50" border="border-emerald-200" />
        </Link>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT 2 cols */}
        <div className="lg:col-span-2 space-y-6">

          {/* APPROVAL QUEUE */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-slate-800">Clinic Approval Queue</h2>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {pendingClinics.length} NEW
                </span>
              </div>
              <a href="/admin/pending-clinics"
                 className="text-xs font-semibold text-teal-600 hover:underline">
                View all →
              </a>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Clinic Name", "Owner", "City", "Submitted", "Actions"].map(h => (
                    <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400
                                           uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">{clinic.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{clinic.owner}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{clinic.city}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{clinic.date}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {/* 3. Trigger Modal on Click */}
                      <button 
                        onClick={() => handleOpenModal("approve", clinic)}
                        className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-teal-700 transition-all"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleOpenModal("review", clinic)}
                        className="border border-slate-200 text-slate-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-50 transition-all"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>


          {/* ANALYTICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Revenue Breakdown</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full shrink-0 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="4"/>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#14b8a6"
                            strokeWidth="4" strokeDasharray="59 41"/>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#60a5fa"
                            strokeWidth="4" strokeDasharray="29 71"
                            strokeDashoffset="-59"/>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#818cf8"
                            strokeWidth="4" strokeDasharray="12 88"
                            strokeDashoffset="-88"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-black text-slate-800">₱250,890</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Total Platform Fees</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Subscription Fees",    amount: "₱148,200", pct: 59, color: "bg-teal-500"   },
                  { label: "Booking Commissions",  amount: "₱72,450",  pct: 29, color: "bg-blue-400"   },
                  { label: "Premium Listings",     amount: "₱30,240",  pct: 12, color: "bg-indigo-400" },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 font-semibold">{item.label}</span>
                      <span className="text-slate-500 font-bold">{item.amount}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`}
                           style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Clinics */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Top Performing Clinics</h3>
              <div className="space-y-4">
                {topClinics.map((clinic, i) => (
                  <div key={clinic.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold">#{i + 1}</span>
                        <span className="font-semibold text-slate-700">{clinic.name}</span>
                      </div>
                      <span className="text-teal-600 font-bold">{clinic.growth}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`${clinic.color} h-full rounded-full`}
                           style={{ width: `${(clinic.bookings / 500) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{clinic.bookings} bookings</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* RIGHT col */}
        <aside className="space-y-6.5">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[300px] overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <h3 className="font-bold text-slate-800 text-sm">System Audit Log</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Live</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-scrollbar">
              {auditLogs.map((log, i) => (
                <div key={i} className={`border-l-2 ${log.color || 'border-slate-200'} pl-4 py-1 group cursor-default`}>
                  <p className="font-bold text-slate-700 text-[13px] group-hover:text-teal-600 transition-colors">
                    {log.action}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-tighter">
                    {log.time} • System Node 01
                  </p>
                </div>
              ))}
            </div>

            {/* Footer Action */}
            <div className="px-5 py-2 border-t border-slate-50 bg-slate-50/50 shrink-0">
              <a href = "/admin/audit-log">
                <button className="text-[11px] font-bold text-slate-400 hover:text-teal-600 uppercase tracking-widest w-full text-center transition-colors">
                  View Full History →
                </button>
              </a>
            </div>
          </section>

          {/* User growth chart */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">User Growth</h3>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                  Last 3 Months
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Patients</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Clinics</span>
                </div>
              </div>
            </div>
            <div className="relative h-28">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100"
                   preserveAspectRatio="none">
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {[0,25,50,75,100].map(y => (
                  <line key={y} x1="0" y1={y} x2="300" y2={y}
                        stroke="#f1f5f9" strokeWidth="1"/>
                ))}
                <path d="M0,80 C50,75 100,30 150,40 S250,5 300,10 L300,100 L0,100 Z"
                      fill="url(#pg)"/>
                <path d="M0,80 C50,75 100,30 150,40 S250,5 300,10"
                      fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M0,95 C50,90 100,60 150,70 S250,40 300,50 L300,100 L0,100 Z"
                      fill="url(#cg)"/>
                <path d="M0,95 C50,90 100,60 150,70 S250,40 300,50"
                      fill="none" stroke="#14b8a6" strokeWidth="2.5"
                      strokeLinecap="round" strokeDasharray="4 2"/>
                <circle cx="300" cy="10" r="4" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                <circle cx="300" cy="50" r="4" fill="#14b8a6" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t border-slate-50">
              <div className="flex gap-4">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Patient</p>
                  <p className="text-xs font-black text-blue-600">+24%</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Clinic</p>
                  <p className="text-xs font-black text-teal-600">+12%</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase">Mar 2026</span>
            </div>
          </section>
        </aside>
      </div>
      {/* 4. THE MODAL COMPONENT */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalType === "approve" ? "Confirm Approval" : "Clinic Review Details"}
      >
        {modalType === "approve" ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl">
               <AlertCircle className="text-blue-600" size={24} />
               <div>
                 <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Verify Clinic</p>
                 <h4 className="text-base font-black text-slate-800">{selectedClinic?.name}</h4>
               </div>
            </div>
            <p className="text-sm text-slate-500">Approve this clinic to make it live on the platform directory?</p>
            <div className="flex gap-3">
              <button onClick={handleConfirmApproval} className="flex-1 bg-teal-600 text-white py-3 rounded-2xl font-bold uppercase text-xs">Confirm Approval</button>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-2xl font-bold uppercase text-xs">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
               <h3 className="font-black text-xl text-slate-800">{selectedClinic?.name}</h3>
               <p className="text-xs text-slate-400 font-bold uppercase mt-1">{selectedClinic?.city} · {selectedClinic?.owner}</p>
            </div>
            <div className="space-y-3">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Documents</p>
               <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="text-teal-500" size={18} />
                    <span className="text-xs font-semibold text-slate-600">Business_Permit.pdf</span>
                  </div>
                  <button className="text-[10px] font-bold text-teal-600 underline">View</button>
               </div>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-800 text-white py-3 rounded-2xl font-bold uppercase text-xs">Close Review</button>
          </div>
        )}
      </Modal>
    </main>
  );
}
"use client";
import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { Search, Pill, User, Building2, Calendar, Download, ChevronRight } from "lucide-react";

export default function PrescriptionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const prescriptions =[
    { 
      id: 1, 
      name: "Amoxicillin", 
      dosage: "500mg", 
      instructions: "Take 1 capsule every 8 hours after meals", 
      doctor: "Dr. Ben Villanueva", 
      clinic: "Joseph Community Health", 
      date: "Mar 26, 2026", 
      status: "Active"
    },
    { 
      id: 2, 
      name: "Cetirizine", 
      dosage: "10mg", 
      instructions: "Take 1 tablet once a day before bedtime", 
      doctor: "Dr. Claire Mendoza", 
      clinic: "CDO Outpatient Clinic", 
      date: "Mar 20, 2026", 
      status: "Active"
    },
    { 
      id: 3, 
      name: "Paracetamol", 
      dosage: "500mg", 
      instructions: "Take 1 tablet every 4 hours as needed for fever", 
      doctor: "Dr. Ben Villanueva", 
      clinic: "Joseph Community Health", 
      date: "Feb 10, 2026", 
      status: "Completed"
    },
    { 
      id: 4, 
      name: "Losartan", 
      dosage: "50mg", 
      instructions: "Take 1 tablet daily in the morning", 
      doctor: "Dr. Marco Reyes", 
      clinic: "Iligan Medical Center", 
      date: "Jan 15, 2026", 
      status: "Completed"
    }
  ];

    const [isRxModalOpen, setIsRxModalOpen] = useState(false);
    const [selectedRx, setSelectedRx] = useState(null);

    const handleViewRx = (med) => {
    setSelectedRx(med);
    setIsRxModalOpen(true);
    };

  const filteredMeds = prescriptions.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.doctor.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusStyle = {
    Active: "bg-teal-50 text-teal-700 border-teal-100",
    Completed: "bg-slate-100 text-slate-500 border-slate-200",
  };

  return (
    <main className="min-h-screen bg-slate-100 font-sans pb-10">
      
      {/* ── HEADER ── */}
      <div className="relative bg-[#1a365d] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-widest mb-1">
              <Link href="/patient/dashboard" className="hover:text-white transition-colors">Patient</Link>
              <ChevronRight size={10} />
              <span className="text-white/60">Prescriptions</span>
            </nav>
            <h1 className="text-white text-2xl font-bold">My Prescriptions</h1>
            <p className="text-slate-300 text-sm mt-1">View and manage your active and past medications.</p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medication or doctor..." 
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-teal-400 transition-all bg-slate-50" 
            />
          </div>

          <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-full sm:w-auto">
            {["All", "Active", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                  filter === tab 
                    ? "bg-white text-slate-800 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── 2-COLUMN GRID FOR CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMeds.length > 0 ? (
            filteredMeds.map((med) => (
              <div key={med.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full hover:border-teal-300 transition-colors">
                
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${med.status === 'Active' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Pill size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">{med.name}</h3>
                      <p className="text-xs font-bold text-teal-600">{med.dosage}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${statusStyle[med.status]}`}>
                    {med.status}
                  </span>
                </div>

                {/* Instructions */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Instructions</p>
                  <p className="text-sm text-slate-700 font-medium">{med.instructions}</p>
                </div>

                {/* Footer Info & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 border-t border-slate-100 mt-auto">
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <User size={14} className="text-slate-400" /> {med.doctor}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <Building2 size={14} className="text-slate-400" /> {med.clinic}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" /> {med.date}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                    onClick={() => handleViewRx(med)} 
                    className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">
                      View Rx
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full bg-white py-20 rounded-2xl border-2 border-dashed border-slate-200 text-center">
              <Pill className="text-slate-300 mx-auto mb-3" size={32} />
              <p className="text-slate-500 font-bold text-sm">No prescriptions found.</p>
              <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>

      </div>
      {/* ── DIGITAL PRESCRIPTION MODAL ── */}
        <Modal 
        isOpen={isRxModalOpen} 
        onClose={() => setIsRxModalOpen(false)} 
        title="Digital Prescription"
        className="rounded-none" 
        >
        <div className="h-[365px] bg-white p-4 border-1 border-slate-100 rounded-none">
            {/* Header: Clinic Info */}
            <div className="text-center border-b-2 border-slate-100 pb-3 mb-4">
            <h2 className="font-black text-slate-800 uppercase tracking-tighter text-lg">{selectedRx?.clinic}</h2>
            <p className="text-[10px] text-slate-500 uppercase font-bold">123 Health St., Dapitan City, Philippines</p>
            <p className="text-[10px] text-slate-500 font-bold">Tel: (065) 123-4567</p>
            </div>

            {/* Doctor & Patient Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-[11px]">
            <div>
                <p className="text-slate-400 font-bold uppercase text-[9px]">Doctor</p>
                <p className="font-bold text-slate-800">{selectedRx?.doctor}</p>
                <p className="text-slate-500">Lic No: 0012345</p>
            </div>
            <div className="text-right">
                <p className="text-slate-400 font-bold uppercase text-[9px]">Date</p>
                <p className="font-bold text-slate-800">{selectedRx?.date}</p>
            </div>
            </div>

            {/* The Rx Symbol */}
            <div className="mb-2">
            <span className="text-4xl font-serif italic text-slate-800">Rx</span>
            </div>

            {/* Medication Details */}
            <div className="pl-6 mb-10">
            <h3 className="text-xl font-black text-slate-900 underline decoration-teal-500 underline-offset-4">
                {selectedRx?.name} {selectedRx?.dosage}
            </h3>
            <p className="text-sm text-slate-600 mt-4 font-medium italic">
                "{selectedRx?.instructions}"
            </p>
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase">
                Quantity: #21 Capsules
            </p>
            </div>

            {/* Footer: Signature & QR */}
            <div className="flex justify-end items-end border-t border-dashed border-slate-200 pt-2">
            <div className="text-center border-t border-slate-800 w-40 pt-1">
                <p className="text-[10px] font-black text-slate-800 uppercase">Digital Signature</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Verified by Healthcon</p>
            </div>
            </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3 mt-10">
            <button className="flex-1 bg-healthcon-blue text-white py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2">
            <Download size={14} /> Download PDF
            </button>
            <button className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold text-xs uppercase">
            Print Rx
            </button>
        </div>
        </Modal>
    </main>
  );
}
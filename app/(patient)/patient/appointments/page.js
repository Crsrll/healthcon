"use client"
import { Suspense } from "react";;
import { useState, useMemo, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock,  ChevronRight, Search,Plus,Clipboard } from "lucide-react";

function MyAppointmentsPageInner() {
    const searchParams = useSearchParams();
    const urlTimeframe = searchParams.get("timeframe") || "Upcoming";
    const [timeframe, setTimeframe] = useState(urlTimeframe);
    const [activeTab, setActiveTab] = useState("All");
    useEffect(() => {
        const t = searchParams.get("timeframe");
        if (t) setTimeframe(t);
    }, [searchParams]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);

  const [appointments, setAppointments] = useState([
    { id: 1, clinic: "Joseph Community Health", doctor: "Dr. Ben Villanueva", service: "General Check-up", date: "2026-04-10", time: "10:00 AM", status: "Confirmed", isPast: false },
    { id: 2, clinic: "Iligan Medical Center", doctor: "Dr. Claire Mendoza", service: "Cardiology", date: "2026-04-15", time: "02:30 PM", status: "Pending", isPast: false },
    { id: 3, clinic: "CDO Outpatient Clinic", doctor: "Dr. Rosa Macaraeg", service: "Laboratory Test", date: "2026-03-15", time: "09:00 AM", status: "Completed", isPast: true },
    { id: 4, clinic: "Joseph Community Health", doctor: "Dr. Ben Villanueva", service: "Follow-up", date: "2026-03-01", time: "11:00 AM", status: "Cancelled", isPast: true },
    { id: 5, clinic: "Melissa Community Health", doctor: "Dr. BB Boi", service: "Dental Check-up", date: "2026-04-17", time: "01:00 PM", status: "Confirmed", isPast: false},
  ]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesTime = timeframe === "Upcoming" ? !apt.isPast : apt.isPast;
      const matchesStatus = activeTab === "All" || apt.status === activeTab;
      const matchesSearch = apt.clinic.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            apt.doctor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTime && matchesStatus && matchesSearch;
    });
  }, [activeTab, timeframe, searchQuery, appointments]);

  // --- HANDLERS ---
  const handleCancel = (id) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments(prev => prev.map(apt => 
        apt.id === id ? { ...apt, status: "Cancelled" } : apt
      ));
    }
  };

  const handleBookNew = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newApt = {
      id: Date.now(),
      clinic: formData.get("clinic"),
      doctor: "To be assigned",
      service: formData.get("service"),
      date: formData.get("date"),
      time: formData.get("time"),
      status: "Pending",
      isPast: false
    };
    setAppointments([newApt, ...appointments]);
    setIsBookModalOpen(false);
  };

  const handleViewDetails = (apt) => {
    setSelectedApt(apt);
    setIsDetailsOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12 font-sans">

      <div className="bg-[#1a365d] text-white pt-10 pb-16 px-6">
        <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
          <Link href = "/patient/dashboard" className="hover:text-white transition-colors">
            <span>Patient</span>
          </Link>
          <ChevronRight size={10} />
          <span className="text-white/60">Appointments</span>
        </nav>
        <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Appointments</h1>
            <p className="text-teal-300 text-sm mt-1">Manage your upcoming visits and view medical history.</p>
          </div>
          <button 
            onClick={() => setIsBookModalOpen(true)}
            className="bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl shadow-teal-900/40 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Book New
          </button>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 mt-6 space-y-6">

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit shadow-sm">
                {["Upcoming", "Past"].map((t) => (
                    <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                        timeframe === t ? "bg-[#1a365d] text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                    }`}
                    >
                    {t}
                    </button>
                ))}
            </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clinic or doctor..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        <section className="space-y-3">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => (
              <div key={apt.id} className="bg-white p-5 border border-slate-200 shadow-sm hover:border-teal-500 transition-all group rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Icon Box */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      apt.status === 'Cancelled' ? 'bg-red-50 text-red-400' : 'bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600'
                    }`}>
                      <Calendar size={24} />
                    </div>
                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800">{apt.clinic}</h3>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                          apt.status === 'Confirmed' ? 'bg-teal-100 text-teal-700' : 
                          apt.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                          apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{apt.doctor} · {apt.service}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                          <Clock size={12} /> {apt.date} at {apt.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-auto md:ml-0">
                    {apt.status !== "Cancelled" && !apt.isPast && (
                      <button 
                        onClick={() => handleCancel(apt.id)}
                        className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewDetails(apt)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white py-20 rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <Clipboard className="text-slate-200 mx-auto mb-4" size={32} />
              <p className="text-slate-500 font-bold">No {timeframe.toLowerCase()} appointments found.</p>
            </div>
          )}
        </section>
      </div>

      {/* ── MODAL: BOOK NEW ── */}
      <Modal 
        isOpen={isBookModalOpen} 
        onClose={() => setIsBookModalOpen(false)} 
        title="Book New Appointment"
      >
        <form onSubmit={handleBookNew} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Select Clinic</label>
            <input name="clinic" required placeholder="Enter clinic name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Service</label>
            <select name="service" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500">
              <option>General Check-up</option>
              <option>Consultation</option>
              <option>Laboratory</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="date" type="date" required className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <input name="time" type="time" required className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest mt-4 shadow-lg shadow-teal-900/20">
            Confirm Booking
          </button>
        </form>
      </Modal>

      {/* ── MODAL: VIEW DETAILS ── */}
      <Modal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        title="Appointment Summary"
      >
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h3 className="text-xl font-black text-slate-900">{selectedApt?.clinic}</h3>
            <p className="text-xs font-bold text-teal-600 uppercase mt-1">{selectedApt?.doctor}</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Service</span>
              <span className="font-bold text-slate-700">{selectedApt?.service}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Date & Time</span>
              <span className="font-bold text-slate-700">{selectedApt?.date} at {selectedApt?.time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className="font-bold text-teal-600">{selectedApt?.status}</span>
            </div>
          </div>
          <button onClick={() => setIsDetailsOpen(false)} className="w-full bg-[#1a365d] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">
            Close Summary
          </button>
        </div>
      </Modal>

    </main>
  );
}
export default function MyAppointmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyAppointmentsPageInner />
    </Suspense>
  );
}

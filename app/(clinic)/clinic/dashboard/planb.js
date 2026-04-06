"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import PulseCard from "@/components/ui/PulseCard";
import { 
  CalendarCheck, Clock, MessageCircle, CheckCircle2, 
  Send, Plus, UserPlus, Stethoscope, Search, 
  ChevronRight, LayoutDashboard, Settings, Users 
} from "lucide-react";

export default function DashboardPage() {
  // --- NAVIGATION STATE ---
  const [mode, setMode] = useState("Dashboard");
  const [search, setSearch] = useState("");

  // --- EXISTING DATA ---
  const todayAppointments = [
    { id: 1, time: "09:00 AM", patient: "John Wick", service: "Consultation", status: "Completed" },
    { id: 2, time: "10:30 AM", patient: "Melissa Doe", service: "Check-up", status: "In Session" },
    { id: 3, time: "11:15 AM", patient: "Sarah Connor", service: "X-Ray", status: "Waiting" },
    { id: 4, time: "01:30 PM", patient: "Bruce Wayne", service: "Follow-up", status: "Cancelled" },
  ];

  const [inquiries, setInquiries] = useState([
    { id: 1, user: "Peter Parker", initials: "PP", msg: "Are you open on Saturdays?", time: "10 mins ago", unread: true },
    { id: 2, user: "Diana Prince", initials: "DP", msg: "Can I reschedule my check-up?", time: "1 hour ago", unread: true },
    { id: 3, user: "Clark Kent", initials: "CK", msg: "What are your available slots?", time: "3 hours ago", unread: false },
  ]);

  // --- MODAL STATES ---
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  // --- HANDLERS ---
  const handleOpenReply = (inq) => {
    setSelectedInquiry(inq);
    setIsInquiryModalOpen(true);
  };

  const handleSendReply = () => {
    setInquiries(prev => prev.map(item => 
      item.id === selectedInquiry.id ? { ...item, unread: false } : item
    ));
    setReplyText("");
    setIsInquiryModalOpen(false);
  };

  const statusStyle = {
    Completed: "bg-green-100 text-green-700",
    "In Session": "bg-blue-100 text-blue-700",
    Waiting: "bg-amber-100 text-amber-700",
    Scheduled: "bg-slate-100 text-slate-500",
    Cancelled: "bg-red-100 text-red-700",
  };

  const isDashboard = mode === "Dashboard";

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      
      {/* ── SHRINKING HEADER ── */}
      <header className={`relative bg-[#1a365d] transition-all duration-500 ease-in-out overflow-hidden z-30 ${
        isDashboard ? "py-8" : "py-3 shadow-lg"
      }`}>
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            {isDashboard ? (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <p className="text-teal-300 text-[11px] font-bold uppercase tracking-widest mb-1">Clinic Portal</p>
                <h1 className="text-white text-2xl font-bold">Joseph Community Health</h1>
                <p className="text-slate-300 text-sm mt-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Monday, March 23 · <span className="text-teal-300 font-semibold">Open</span>
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-white animate-in fade-in duration-300">
                <span className="text-slate-400 text-sm font-medium">Joseph Health</span>
                <ChevronRight size={14} className="text-slate-500" />
                <span className="text-teal-400 text-sm font-bold uppercase tracking-wider">{mode}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {isDashboard && (
              <div className="hidden lg:block text-right animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Daily Progress</p>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 w-[58%] transition-all duration-1000" />
                  </div>
                  <span className="text-white font-bold text-sm">7/12</span>
                </div>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className={`flex gap-2 transition-all duration-500 ${isDashboard ? "" : "scale-90"}`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 outline-none focus:bg-white/20 w-48 lg:w-64 transition-all"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ── SIDEBAR ── */}
        <aside className="w-64 bg-white h-[calc(100vh-60px)] sticky top-[60px] border-r border-slate-200 p-4 space-y-2 hidden md:block">
          {[
            { id: "Dashboard", icon: <LayoutDashboard size={18} /> },
            { id: "Doctors", icon: <Users size={18} /> },
            { id: "Inquiries", icon: <MessageCircle size={18} /> },
            { id: "Settings", icon: <Settings size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${
                mode === item.id ? "bg-[#1a365d] text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {item.icon} {item.id}
            </button>
          ))}
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <div className="flex-1 overflow-hidden">
          {mode === "Dashboard" ? (
            <main className="max-w-7xl mx-auto px-6 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* STATS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">  
                <Link href="/clinic/daily-schedule" className="block"><PulseCard title="Today's Appointments" value="12" subtext="2 more than yesterday" icon={<CalendarCheck size={24} />} color="text-blue-600" iconBg="bg-blue-50" border="border-blue-100"/></Link>
                <Link href="/clinic/pending-requests" className="block"><PulseCard title="Pending Requests" value="5" subtext="Needs your review" icon={<Clock size={24} />} color="text-amber-600" iconBg="bg-amber-50" border="border-amber-100"/></Link>
                <button onClick={() => setMode("Inquiries")} className="text-left block w-full"><PulseCard title="Inquiries" value={inquiries.filter(i => i.unread).length.toString()} subtext="Unread messages" icon={<MessageCircle size={24} />} color="text-teal-600" iconBg="bg-teal-50" border="border-teal-100"/></button>
                <Link href="/clinic/daily-schedule?status=Completed" className="block w-full"><PulseCard title="Completed Today" value="7" subtext="of 12 appointments" icon={<CheckCircle2 size={24} />} color="text-green-600" iconBg="bg-green-50" border="border-green-100"/></Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h2 className="font-bold text-slate-800">Today's Queue</h2>
                        <span className="bg-healthcon-blue text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">{todayAppointments.length}</span>
                      </div>
                      <Link href="/clinic/daily-schedule" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">View Schedule</Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            {["Time", "Patient", "Service", "Status"].map((h) => (
                              <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {todayAppointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors group">
                              <td className="px-6 py-4 font-bold text-slate-700 text-sm">{apt.time}</td>
                              <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{apt.patient}</td>
                              <td className="px-6 py-4 text-slate-500 text-sm">{apt.service}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusStyle[apt.status]}`}>{apt.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>

                <div className="space-y-5">
                  <section className="bg-healthcon-blue rounded-2xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
                    <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 bg-teal-400 rounded-full" />
                        <h3 className="font-bold text-sm uppercase tracking-wider">Quick Actions</h3>
                      </div>
                      <div className="space-y-2.5">
                        <button onClick={() => setIsApptModalOpen(true)} className="w-full bg-teal-500 hover:bg-teal-400 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"><Plus size={18} /> New Appointment</button>
                        <button onClick={() => setIsDoctorModalOpen(true)} className="w-full bg-teal-500 hover:bg-teal-400 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"><UserPlus size={18} /> Add a New Doctor</button>
                        <button onClick={() => setMode("Settings")} className="w-full bg-white/10 hover:bg-white/20 border border-white/15 py-2.5 rounded-xl font-bold text-sm transition-all">Manage Schedule</button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </main>
          ) : (
            <main className="p-8 animate-in fade-in zoom-in-95 duration-500">
               <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Manage {mode}</h2>
                  <p className="text-slate-400 mt-2 italic">This section is currently under development.</p>
                  <button onClick={() => setMode("Dashboard")} className="mt-6 text-teal-600 font-bold text-sm hover:underline">← Back to Dashboard</button>
               </div>
            </main>
          )}
        </div>
      </div>

      {/* ── MODALS ── */}
      <Modal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} title={`Inquiry from ${selectedInquiry?.user}`}>
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-sm text-slate-700 italic">"{selectedInquiry?.msg}"</p>
          </div>
          <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your response..." className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-teal-500 h-32 resize-none" />
          <button onClick={handleSendReply} className="w-full bg-healthcon-blue text-white py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2"><Send size={14} /> Send Reply</button>
        </div>
      </Modal>

      <Modal isOpen={isApptModalOpen} onClose={() => setIsApptModalOpen(false)} title="Create New Appointment">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsApptModalOpen(false); }}>
          <input required placeholder="Patient Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
          <div className="grid grid-cols-2 gap-3">
            <input required type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
            <input required type="time" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold text-xs uppercase shadow-lg shadow-teal-600/20">Confirm Booking</button>
        </form>
      </Modal>

      <Modal isOpen={isDoctorModalOpen} onClose={() => setIsDoctorModalOpen(false)} title="Register New Doctor">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsDoctorModalOpen(false); }}>
          <input required placeholder="Doctor's Full Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
          <input required placeholder="Specialization" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
          <button type="submit" className="w-full bg-healthcon-blue text-white py-3 rounded-xl font-bold text-xs uppercase shadow-lg shadow-blue-900/20">Add to Registry</button>
        </form>
      </Modal>
    </div>
  );
}
"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import PulseCard from "@/components/ui/PulseCard";
import { CalendarCheck, Clock, MessageCircle, CheckCircle2, Send, Plus, UserPlus, Stethoscope } from "lucide-react";

export default function DashboardPage() {
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

  const [isApptModalOpen, setIsApptModalOpen] = useState(false); // New Appointment Modal
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false); // New Doctor Modal

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

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">  
        <Link href="/clinic/daily-schedule" className="block">
          <PulseCard title="Today's Appointments" value="12" subtext="2 more than yesterday" icon={<CalendarCheck size={24} />} color="text-blue-600" iconBg="bg-blue-50" border="border-blue-100"/>
        </Link>
        <Link href="/clinic/pending-requests" className="block">
          <PulseCard title="Pending Requests" value="5" subtext="Needs your review" icon={<Clock size={24} />} color="text-amber-600" iconBg="bg-amber-50" border="border-amber-100"/>
        </Link>
        <Link href="/clinic/inquiries" className="block">
          <PulseCard title="Inquiries" value={inquiries.filter(i => i.unread).length.toString()} subtext="Unread messages" icon={<MessageCircle size={24} />} color="text-teal-600" iconBg="bg-teal-50" border="border-teal-100"/>
        </Link>
        <Link href="/clinic/daily-schedule?status=Completed" className="block w-full">  
          <PulseCard title="Completed Today" value="7" subtext="of 12 appointments" icon={<CheckCircle2 size={24} />} color="text-green-600" iconBg="bg-green-50" border="border-green-100"/>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* TODAY'S QUEUE */}
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

          {/* MINI ANALYTICS */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Weekly patient volume</h3>
                  <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-lg">This week</span>
                </div>
                <div className="relative h-32 w-full mt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <line x1="0" y1="0"  x2="300" y2="0"  stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="25" x2="300" y2="25" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="75" x2="300" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                    <path d="M0,60 Q25,40 50,45 T100,65 T150,30 T200,55 T250,80 T300,45" fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="0"   cy="60" r="4" fill="#0d9488" />
                    <circle cx="50"  cy="45" r="4" fill="#0d9488" />
                    <circle cx="150" cy="30" r="4" fill="#0d9488" />
                    <circle cx="300" cy="45" r="4" fill="#0d9488" />
                  </svg>
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span className="text-teal-600">Today</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">Top Services</h3>
                <div className="space-y-4">
                  {[
                    { name: "Dental Checkup",   count: 42, color: "bg-teal-500",   total: 50 },
                    { name: "Tooth Extraction",  count: 31, color: "bg-blue-500",   total: 50 },
                    { name: "General Checkup",  count: 21, color: "bg-orange-500", total: 50 },
                    { name: "Eye Exam",     count: 17, color: "bg-amber-500",  total: 50 },
                  ].map((service) => (
                    <div key={service.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-slate-700">{service.name}</span>
                        <span className="text-xs font-bold text-slate-400">{service.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${service.color} rounded-full`} style={{ width: `${(service.count / service.total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

         {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* QUICK ACTIONS */}
          <section className="bg-healthcon-blue rounded-2xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-teal-400 rounded-full" />
                <h3 className="font-bold text-sm">Quick Actions</h3>
              </div>
              <div className="space-y-2.5">
                <button 
                  onClick={() => setIsApptModalOpen(true)}
                  className="w-full bg-teal-500 hover:bg-teal-400 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> New Appointment
                </button>
                <button 
                  onClick={() => setIsDoctorModalOpen(true)}
                  className="w-full bg-teal-500 hover:bg-teal-400 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} /> Add a New Doctor
                </button>
                <Link href="/clinic/settings" className="block w-full bg-white/10 hover:bg-white/20 border border-white/15 py-2.5 rounded-xl font-bold text-sm text-center transition-all">
                  Manage Schedule
                </Link>
              </div>
            </div>
          </section>

          {/* FUNCTIONAL RECENT INQUIRIES */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Recent Inquiries</h3>
              <div className="flex items-center gap-2">
                {inquiries.some(i => i.unread) && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                <span className="text-[10px] font-bold text-red-500 uppercase">
                  {inquiries.filter(i => i.unread).length} New
                </span>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {inquiries.map((inq) => (
                <div 
                  key={inq.id} 
                  onClick={() => handleOpenReply(inq)}
                  className={`p-4 cursor-pointer transition-colors group ${inq.unread ? "bg-teal-50/30 hover:bg-teal-50/60" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${inq.unread ? "bg-healthcon-blue text-white" : "bg-slate-100 text-slate-500"}`}>
                      {inq.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-xs font-bold truncate ${inq.unread ? "text-slate-800" : "text-slate-500"}`}>{inq.user}</p>
                        <span className="text-[9px] text-slate-400 shrink-0 ml-2">{inq.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{inq.msg}</p>
                      {inq.unread && (
                        <button className="mt-1.5 text-[10px] font-bold text-teal-600 hover:text-teal-500 uppercase tracking-wide">
                          Quick Reply →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/clinic/inquiries" className="block px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400 hover:text-teal-600 text-center transition-colors">
                View All Inquiries →
            </Link>
          </section>
        </div>
      </div>

      {/* ── MODAL 1: QUICK REPLY ── */}
      <Modal 
        isOpen={isInquiryModalOpen} 
        onClose={() => setIsInquiryModalOpen(false)} 
        title={`Inquiry from ${selectedInquiry?.user}`}
      >
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Message:</p>
            <p className="text-sm text-slate-700 italic">"{selectedInquiry?.msg}"</p>
          </div>
          <textarea 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your response..."
            className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-teal-500 h-32 resize-none"
          />
          <button onClick={handleSendReply} className="w-full bg-healthcon-blue text-white py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2">
            <Send size={14} /> Send Reply
          </button>
        </div>
      </Modal>

      {/* ── MODAL 2: NEW APPOINTMENT ── */}
      <Modal 
        isOpen={isApptModalOpen} 
        onClose={() => setIsApptModalOpen(false)} 
        title="Create New Appointment"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsApptModalOpen(false); }}>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Patient Name</label>
            <input required type="text" placeholder="Enter full name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Date</label>
              <input required type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Time</label>
              <input required type="time" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Service Type</label>
            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-400">
              <option>General Check-up</option>
              <option>Consultation</option>
              <option>Laboratory</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold text-xs uppercase mt-2 shadow-lg shadow-teal-600/20">
            Confirm Booking
          </button>
        </form>
      </Modal>

      {/* ── MODAL 3: ADD DOCTOR ── */}
      <Modal 
        isOpen={isDoctorModalOpen} 
        onClose={() => setIsDoctorModalOpen(false)} 
        title="Register New Doctor"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsDoctorModalOpen(false); }}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 border-2 border-dashed border-teal-200">
              <Stethoscope size={32} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Doctor's Full Name</label>
            <input required type="text" placeholder="Dr. Name Surname" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Specialization</label>
            <input required type="text" placeholder="e.g. Pediatrics, Cardiology" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Duty Schedule</label>
            <input required type="text" placeholder="e.g. Mon-Fri, 8AM - 5PM" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
          </div>
          <button type="submit" className="w-full bg-healthcon-blue text-white py-3 rounded-xl font-bold text-xs uppercase mt-2 shadow-lg shadow-blue-900/20">
            Add to Registry
          </button>
        </form>
      </Modal>
    </main>
  );
}
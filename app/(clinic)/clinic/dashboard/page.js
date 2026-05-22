"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useClinicDashboard } from "@/hooks/useClinicDashboard";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import PulseCard from "@/components/ui/PulseCard";
import {
  CalendarCheck,
  Clock,
  MessageCircle,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";

const STATUS_STYLE = {
  Completed: "bg-green-100 text-green-700 border-green-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  Waiting: "bg-amber-100 text-amber-700 border-amber-200",
  "In Session": "bg-indigo-100 text-indigo-700 border-indigo-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    stats,
    todayAppointments,
    inquiries,
    upcomingAppointments,
    loading,
    sendInquiryReply,
  } = useClinicDashboard(user?.uid);

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleOpenReply = (inq) => {
    setSelectedInquiry(inq);
    setIsInquiryModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedInquiry) return;
    const ok = await sendInquiryReply({
      inquiryId: selectedInquiry.id,
      text: replyText,
      sender: "clinic",
    });
    if (ok) {
      setReplyText("");
      setIsInquiryModalOpen(false);
    } else {
      alert("Failed to send reply");
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-500" size={40} />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-400 font-medium italic">Welcome back to your health command center</p>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/clinic/daily-schedule" className="block">
          <PulseCard title="Today's Appointments" value={stats.todayTotal.toString()} subtext="Confirmed for today" icon={<CalendarCheck size={22} />} color="text-blue-600" iconBg="bg-blue-50" border="border-blue-100" />
        </Link>
        <Link href="/clinic/pending-requests" className="block">
          <PulseCard title="Pending Requests" value={stats.pendingCount.toString()} subtext="Needs your review" icon={<Clock size={22} />} color="text-amber-600" iconBg="bg-amber-50" border="border-amber-100" />
        </Link>
        <Link href="/clinic/inquiries" className="block">
          <PulseCard title="Inquiries" value={stats.unreadInquiries.toString()} subtext="Unread messages" icon={<MessageCircle size={22} />} color="text-teal-600" iconBg="bg-teal-50" border="border-teal-100" />
        </Link>
        <Link href="/clinic/daily-schedule?status=Completed" className="block">
          <PulseCard title="Completed Today" value={stats.completedToday.toString()} subtext={`of ${stats.todayTotal} total`} icon={<CheckCircle2 size={22} />} color="text-green-600" iconBg="bg-green-50" border="border-green-100" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: TODAY'S QUEUE */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-slate-800 tracking-tight">Today's Queue</h2>
                <span className="bg-[#1a355d] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  {todayAppointments.length}
                </span>
              </div>
              <Link href="/clinic/daily-schedule" className="text-xs font-bold text-teal-600 hover:text-teal-700 shrink-0">
                View Full Schedule →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[420px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-4 sm:px-6 py-3">Time</th>
                    <th className="px-4 sm:px-6 py-3">Patient</th>
                    <th className="px-4 sm:px-6 py-3 hidden sm:table-cell">Service</th>
                    <th className="px-4 sm:px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <Loader2 className="animate-spin mx-auto text-slate-200" />
                      </td>
                    </tr>
                  ) : todayAppointments.length > 0 ? (
                    todayAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 sm:px-6 py-4 font-bold text-slate-700 text-sm whitespace-nowrap">{apt.time}</td>
                        <td className="px-4 sm:px-6 py-4 font-semibold text-slate-800 text-sm">{apt.patientName}</td>
                        <td className="px-4 sm:px-6 py-4 text-slate-500 text-xs uppercase font-medium hidden sm:table-cell">{apt.service}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-[9px] font-black uppercase border ${STATUS_STYLE[apt.status] || "bg-slate-100"}`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-20 text-center text-slate-400 text-xs italic">
                        No active queue for today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT: INQUIRIES + UPCOMING */}
        <div className="space-y-5">

          {/* Recent Inquiries */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Recent Inquiries</h3>
              <span className="text-[10px] font-black text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded-md">
                {inquiries.filter((i) => i.unreadByClinic).length} NEW
              </span>
            </div>
            <div className="divide-y divide-slate-50 max-h-[360px] overflow-y-auto">
              {inquiries.length > 0 ? (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => handleOpenReply(inq)}
                    className={`p-4 cursor-pointer transition-colors group ${inq.unreadByClinic ? "bg-teal-50/30 hover:bg-teal-50/60" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${inq.unreadByClinic ? "bg-[#1a355d] text-white" : "bg-slate-100 text-slate-400"}`}>
                        {inq.patientName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${inq.unreadByClinic ? "text-slate-800" : "text-slate-500"}`}>
                          {inq.patientName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate leading-relaxed">{inq.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-300 text-xs italic">No inquiries found.</div>
              )}
            </div>
            <Link href="/clinic/inquiries" className="block px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-[10px] font-black text-slate-400 hover:text-teal-600 text-center uppercase tracking-widest">
              Open Message Center
            </Link>
          </section>

          {/* Upcoming Appointments */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Upcoming Appointments</h3>
              <Link href="/clinic/bookings" className="text-[10px] font-bold text-teal-600">View All →</Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-slate-300" size={24} />
                </div>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                    <div className="min-w-[54px] text-center shrink-0">
                      <p className="text-xs font-bold text-slate-700">{apt.shortDate}</p>
                      <p className="text-[9px] text-slate-400">{apt.dayName}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{apt.patientName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{apt.service}</p>
                    </div>
                    <p className="text-[10px] font-medium text-teal-600 shrink-0">{apt.time}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs italic">No upcoming appointments</div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* MODAL: QUICK REPLY */}
      <Modal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} title={`Reply to ${selectedInquiry?.patientName}`}>
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Last Message:</p>
            <p className="text-sm text-slate-600 italic">"{selectedInquiry?.lastMessage}"</p>
          </div>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your response..."
            className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-teal-500 h-32 resize-none shadow-inner"
          />
          <button
            onClick={handleSendReply}
            disabled={!replyText.trim()}
            className="w-full bg-[#1a355d] hover:bg-blue-900 text-white py-3.5 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            <Send size={14} /> Send Quick Reply
          </button>
        </div>
      </Modal>
    </main>
  );
}

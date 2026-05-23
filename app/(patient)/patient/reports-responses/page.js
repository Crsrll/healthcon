"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { usePatientReports } from "@/hooks/usePatientReports";
import Modal from "@/components/ui/Modal";
import { useRealtimeUnreadResponses } from "@/hooks/useRealtimeUnreadResponses";
import {
  Flag, MessageCircle,
  ChevronRight, Calendar, User,
  Stethoscope, Send, Bell,
} from "lucide-react";

export default function PatientReportsPage() {
  const { user } = useAuth();
  const {
    reports,
    loading,
    refreshReports,
    fetchMessages,
    getReplyThread,
    sendReply: hookSendReply,
    markAsRead,
  } = usePatientReports(user?.uid);

  const { unreadReportIds, unreadCount } = useRealtimeUnreadResponses(user?.uid);

  const [selectedReport, setSelectedReport] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [selectedReplyId, setSelectedReplyId] = useState(null);
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const openReport = async (report) => {
    setSelectedReport(report);
    setHasMarkedAsRead(false);
    setReplyText("");
    setMessages([]);
    setSelectedReplyId(null);

    try {
      const threadData = await getReplyThread(report.id);
      if (threadData?.reply) {
        const replyId = threadData.reply.id;
        setSelectedReplyId(replyId);
        const msgs = await fetchMessages(replyId);
        setMessages(msgs);
        setShowChat(true);
        await markAsRead(replyId);
        setHasMarkedAsRead(true);
      } else {
        setShowChat(true);
      }
    } catch (err) {
      console.error("Error opening report:", err);
      setShowChat(true);
    }
  };

  const closeChat = () => {
    setShowChat(false);
    setSelectedReport(null);
    setMessages([]);
    setSelectedReplyId(null);
    setReplyText("");
    setHasMarkedAsRead(false);
    refreshReports();
  };

  const sendReply = async () => {
    if (!replyText.trim() || sendingReply || !selectedReport) return;
    setSendingReply(true);

    const currentReport = selectedReport;
    const currentReplyId = selectedReplyId;

    try {
      let replyId = currentReplyId;

      if (!replyId) {
        const result = await hookSendReply({
          reportId: currentReport.id,
          text: replyText.trim(),
          sender: "patient",
          senderName: user?.displayName || "Patient",
          report: {
            ...currentReport,
            reporterID: user?.uid,
            reporterName: user?.displayName || "Patient",
          },
        });

        if (result.success) {
          replyId = result.replyId;
          setSelectedReplyId(replyId);
        } else {
          console.error("Failed to create thread");
          return;
        }
      } else {
        await hookSendReply({
          replyId,
          text: replyText.trim(),
          sender: "patient",
          senderName: user?.displayName || "Patient",
        });
      }

      setReplyText("");

      if (replyId) {
        const msgs = await fetchMessages(replyId);
        setMessages(msgs);
      }
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending:  { color: "bg-amber-100 text-amber-700",  text: "Pending"  },
      reviewed: { color: "bg-blue-100 text-blue-700",    text: "Reviewed" },
      resolved: { color: "bg-green-100 text-green-700",  text: "Resolved" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getSeverityBadge = (message) => {
    const lowerMsg = message?.toLowerCase() || "";
    if (lowerMsg.includes("urgent") || lowerMsg.includes("emergency") || lowerMsg.includes("critical")) {
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">High Priority</span>;
    }
    if (lowerMsg.includes("delay") || lowerMsg.includes("waiting") || lowerMsg.includes("issue")) {
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">Medium Priority</span>;
    }
    return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">Low Priority</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 font-sans">

      {/* HEADER — matches profile page */}
      <div className="bg-[#1a365d] text-white pt-10 pb-14 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
              <Link href="/patient/dashboard" className="hover:text-white transition-colors">Patient</Link>
              <ChevronRight size={10} />
              <span className="text-white/60">Reports</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold">My Reports</h1>
            <p className="text-blue-200/70 text-sm mt-1">
              Track your submitted reports and communicate with clinics.
            </p>
          </div>

          {unreadCount > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-bold">
              <Bell size={13} /> {unreadCount} unread {unreadCount === 1 ? "response" : "responses"}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 mt-8">

        {reports.length === 0 ? (
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Flag size={28} className="text-slate-300" />
            </div>
            <h3 className="text-base font-black text-slate-700 mb-1">No Reports Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-4">
              You haven't submitted any reports. Visit a clinic page to report an issue.
            </p>
            <Link
              href="/clinics"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95"
            >
              Browse Clinics
            </Link>
          </section>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const hasUnread = unreadReportIds.has(report.id);
              return (
                <div
                  key={report.id}
                  onClick={() => openReport(report)}
                  className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer group p-5
                    ${hasUnread ? "border-red-300 bg-red-50/20" : "border-slate-200"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">

                      {/* badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {getSeverityBadge(report.message)}
                        {getStatusBadge(report.status)}
                        {hasUnread && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500 text-white">
                            <Bell size={10} /> New Response
                          </span>
                        )}
                      </div>

                      {/* subject */}
                      <h3 className={`font-black text-base ${hasUnread ? "text-red-700" : "text-slate-800"}`}>
                        {report.subject}
                      </h3>

                      {/* message preview */}
                      <p className={`text-sm line-clamp-2 ${hasUnread ? "text-slate-700 font-medium" : "text-slate-500"}`}>
                        {report.message}
                      </p>

                      {/* meta */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Calendar size={11} />
                          {report.createdAt?.toDate
                            ? new Date(report.createdAt.toDate()).toLocaleDateString()
                            : report.timestamp
                            ? new Date(report.timestamp).toLocaleDateString()
                            : "Recent"}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <User size={11} /> {report.clinicName}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      size={18}
                      className={`shrink-0 mt-1 transition ${hasUnread ? "text-red-400" : "text-slate-300 group-hover:text-teal-500"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CHAT MODAL */}
      <Modal
        isOpen={showChat}
        onClose={closeChat}
        title={`Conversation with ${selectedReport?.clinicName || "Clinic"}`}
      >
        {selectedReport && (
          <div className="flex flex-col h-[450px]">

            {/* report summary */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3 shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Your Report</p>
              <p className="text-sm font-semibold text-slate-700 break-words">{selectedReport.subject}</p>
              <p className="text-xs text-slate-500 mt-1 break-words line-clamp-2">{selectedReport.message}</p>
              {selectedReport.doctorName && (
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                  <Stethoscope size={10} /> Doctor: Dr. {selectedReport.doctorName}
                </p>
              )}
              {(selectedReport.preferredDate || selectedReport.preferredTime) && (
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                  <Calendar size={10} /> Preferred: {selectedReport.preferredDate}{" "}
                  {selectedReport.preferredDate && selectedReport.preferredTime && "at"}{" "}
                  {selectedReport.preferredTime}
                </p>
              )}
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto mb-3 space-y-2 pr-2 min-h-[150px]">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-2.5 rounded-2xl ${
                      msg.sender === "patient"
                        ? "bg-teal-600 text-white rounded-tr-sm"
                        : "bg-slate-100 text-slate-700 rounded-tl-sm"
                    }`}>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-0.5 opacity-80">
                        {msg.sender === "patient" ? "You" : msg.senderName || "Clinic"}
                      </p>
                      <p className="text-xs whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                      <p className="text-[9px] opacity-60 mt-1 text-right">
                        {msg.createdAt?.toDate
                          ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : ""}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-slate-400">
                    <MessageCircle size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-semibold text-slate-500">No messages yet</p>
                    <p className="text-[10px] text-slate-400">Send a message to start the conversation</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* input */}
            <div className="border-t border-slate-100 pt-3 space-y-2 shrink-0">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
                placeholder="Type your message..."
                rows={2}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500 transition-all resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={closeChat}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim() || sendingReply}
                  className="flex-1 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {sendingReply ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Send size={14} /> Send</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
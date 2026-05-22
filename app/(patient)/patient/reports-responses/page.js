"use client";
import { useState, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { usePatientReports } from "@/hooks/usePatientReports";
import { useRealtimeUnreadResponses } from "@/hooks/useRealtimeUnreadResponses";
import {
  Flag, MessageCircle, Clock,
  ChevronRight, Calendar, User,
  Stethoscope, Send, Bell,
} from "lucide-react";
import Modal from "@/components/ui/Modal";

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

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openReport = async (report) => {
    setSelectedReport(report);
    setHasMarkedAsRead(false);
    setReplyText("");

    const threadData = await getReplyThread(report.id);
    if (threadData?.reply) {
      const replyId = threadData.reply.id;
      setSelectedReplyId(replyId);
      const msgs = await fetchMessages(replyId);
      setMessages(msgs);
      setShowChat(true);
      if (!hasMarkedAsRead) {
        setHasMarkedAsRead(true);
        await markAsRead(replyId);
      }
    } else {
      setMessages([]);
      setSelectedReplyId(null);
      setShowChat(true);
    }

    setTimeout(scrollToBottom, 100);
  };

  const sendReply = async () => {
    if (!replyText.trim() || sendingReply || !selectedReport) return;
    setSendingReply(true);
    try {
      let replyId = selectedReplyId;
      if (!replyId) {
        const threadData = await getReplyThread(selectedReport.id);
        replyId = threadData?.reply?.id;
        if (replyId) setSelectedReplyId(replyId);
      }
      if (replyId) {
        await hookSendReply({ replyId, text: replyText.trim(), sender: "patient" });
      } else {
        await hookSendReply({
          reportId: selectedReport.id,
          text: replyText.trim(),
          sender: "patient",
        });
      }
      setReplyText("");
      if (replyId) {
        const msgs = await fetchMessages(replyId);
        setMessages(msgs);
      }
      await refreshReports();
      setTimeout(scrollToBottom, 100);
    } finally {
      setSendingReply(false);
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-amber-100 text-amber-700", text: "Pending" },
      reviewed: { color: "bg-blue-100 text-blue-700", text: "Reviewed" },
      resolved: { color: "bg-green-100 text-green-700", text: "Resolved" },
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
              <Flag size={20} className="text-teal-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">My Reports & Responses</h1>
          </div>
          <p className="text-sm text-slate-500 ml-0 sm:ml-13">
            Track your submitted reports and communicate with clinics
          </p>
          {unreadCount > 0 && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs">
              <Bell size={12} /> {unreadCount} unread {unreadCount === 1 ? "response" : "responses"}
            </div>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-12 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Flag size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Reports Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              You haven't submitted any reports. Visit a clinic page to report an issue.
            </p>
            <button
              onClick={() => (window.location.href = "/clinics")}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
            >
              Browse Clinics
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const hasUnread = unreadReportIds.has(report.id);
              return (
                <div
                  key={report.id}
                  onClick={() => openReport(report)}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                    hasUnread ? "border-red-300 bg-red-50/20" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getSeverityBadge(report.message)}
                        {getStatusBadge(report.status)}
                        {hasUnread && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500 text-white shadow-sm">
                            <Bell size={10} /> New Response
                          </span>
                        )}
                      </div>
                      <h3 className={`font-bold text-lg ${hasUnread ? "text-red-700" : "text-slate-800"}`}>
                        {report.subject}
                      </h3>
                      <p className={`text-sm line-clamp-2 ${hasUnread ? "text-slate-700 font-medium" : "text-slate-600"}`}>
                        {report.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {report.createdAt?.toDate
                            ? new Date(report.createdAt.toDate()).toLocaleDateString()
                            : report.timestamp
                            ? new Date(report.timestamp).toLocaleDateString()
                            : "Recent"}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={12} /> {report.clinicName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ChevronRight size={18} className={`transition ${hasUnread ? "text-red-500" : "text-slate-300 group-hover:text-teal-500"}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      <Modal
        isOpen={showChat}
        onClose={closeChat}
        title={`Conversation with ${selectedReport?.clinicName || "Clinic"}`}
      >
        {selectedReport && (
          <div className="flex flex-col h-[400px]">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3 shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Your Report</p>
              <p className="text-sm font-medium text-slate-700 break-words mt-0.5">{selectedReport.subject}</p>
              <p className="text-xs text-slate-600 mt-1 break-words line-clamp-2">{selectedReport.message}</p>
              {selectedReport.doctorName && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-200">
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Stethoscope size={10} /> Doctor: Dr. {selectedReport.doctorName}
                  </p>
                </div>
              )}
              {(selectedReport.preferredDate || selectedReport.preferredTime) && (
                <div className="mt-1">
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar size={10} /> Preferred:{" "}
                    {selectedReport.preferredDate}{" "}
                    {selectedReport.preferredDate && selectedReport.preferredTime && "at"}{" "}
                    {selectedReport.preferredTime}
                  </p>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto mb-3 space-y-2 pr-2 min-h-[150px]">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-2.5 rounded-2xl ${
                      msg.sender === "patient"
                        ? "bg-teal-600 text-white rounded-tr-sm"
                        : "bg-slate-100 text-slate-700 rounded-tl-sm"
                    }`}>
                      <p className="text-[10px] font-medium mb-0.5">
                        {msg.sender === "patient" ? "You" : msg.senderName || "Clinic"}
                      </p>
                      <p className="text-xs whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                      <p className="text-[9px] opacity-70 mt-1 text-right">
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
                    <p className="text-xs">No messages yet</p>
                    <p className="text-[10px]">Send a message to start the conversation</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t pt-3 space-y-2 shrink-0">
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
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-200 outline-none resize-none"
              />
              <div className="flex gap-2">
                <button onClick={closeChat} className="flex-1 py-1.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                  Close
                </button>
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim() || sendingReply}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-1.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
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

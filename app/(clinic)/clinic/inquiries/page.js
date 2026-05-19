"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Send, Loader2, MessageSquare, Clock, CheckCheck, Check } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function ClinicInquiriesPage() {
  const { user, loading: authLoading } = useAuth();

  const [inquiries,   setInquiries]   = useState([]);
  const [activeId,    setActiveId]    = useState(null);
  const [messages,    setMessages]    = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [replyText,   setReplyText]   = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  // ── 1. Real-time Listener for Sidebar (All Inquiries) ──
  useEffect(() => {
    if (!user?.uid || authLoading) return;

    const q = query(
      collection(db, "inquiries"),
      where("clinicID", "==", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiries(data);
      if (data.length > 0 && !activeId) setActiveId(data[0].id);
      setLoadingList(false);
    }, (error) => {
      console.error("Inquiries Listener Error:", error);
      setLoadingList(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  // ── 2. Real-time Listener for Active Chat Messages ──
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }

    setLoadingChat(true);
    const messagesRef = collection(db, "inquiries", activeId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(data);
      setLoadingChat(false);
    }, (error) => {
      console.error("Messages Listener Error:", error);
      setLoadingChat(false);
    });

    return () => unsubscribe();
  }, [activeId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeId) return;
    const tempText = replyText;
    setReplyText("");
    
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "message", inquiryId: activeId, text: tempText, sender: "clinic" }),
      });
    } catch (e) { alert("Failed to send"); }
  };

  const handleSelect = async (id) => {
    setActiveId(id);
    try {
      await fetch("/api/inquiries/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId: id, role: "clinic" }),
      });
    } catch (e) { console.error(e); }
  };

  const activeInquiry     = inquiries.find(i => i.id === activeId);
  const filteredInquiries = inquiries.filter(i =>
    i.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const unreadCount = inquiries.filter(i => i.unreadByClinic).length;

  function getInitials(name = "") {
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  }

  function formatTime(ts) {
    if (!ts) return "";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
  }

  if (authLoading || loadingList) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-[3px] border-[#1a355d] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading inquiries...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f0f4f8] flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black text-[#1a355d] tracking-tight">Patient Inquiries</h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage and respond to patient messages</p>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 px-4 py-2 rounded-2xl">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold">{unreadCount} unread</span>
            </div>
          )}
        </div>

        {/* ── Main Layout ── */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6" 
          style={{ height: "calc(100vh - 220px)", minHeight: 560 }}
        >

          {/* ── Sidebar ── */}
          <div className="bg-white rounded-3xl border border-slate-200/80 flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search patients..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1a355d]/30 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col">
              {filteredInquiries.length === 0 ? (
                /* Centered Sidebar Empty State */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <MessageSquare size={20} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-400">No inquiries yet</p>
                </div>
              ) : (
                filteredInquiries.map(inq => (
                  <button
                    key={inq.id}
                    onClick={() => handleSelect(inq.id)}
                    className={`w-full text-left px-4 py-4 transition-all border-b border-slate-50 last:border-0
                      ${inq.id === activeId ? "bg-[#1a355d]/5 border-l-4 border-l-[#1a355d]" : "border-l-4 border-l-transparent hover:bg-slate-50"}`}
                  >
                    <div className="flex gap-3 items-start">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${inq.unreadByClinic ? "bg-[#1a355d] text-white" : "bg-slate-100 text-slate-500"}`}>
                        {getInitials(inq.patientName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className={`text-xs truncate ${inq.unreadByClinic ? "font-bold text-slate-800" : "font-semibold text-slate-600"}`}>{inq.patientName}</p>
                          <span className="text-[10px] text-slate-400 shrink-0"><Clock size={9} className="inline mr-1" />{formatTime(inq.updatedAt)}</span>
                        </div>
                        <p className={`text-[11px] truncate ${inq.unreadByClinic ? "text-slate-600 font-medium" : "text-slate-400"}`}>{inq.lastMessage}</p>
                      </div>
                      {inq.unreadByClinic && <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Chat Panel ── */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
            {!activeInquiry ? (
              /* Centered Chat Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                  <MessageSquare size={28} className="text-slate-300" />
                </div>
                <div>
                  <p className="font-bold text-slate-500">No conversation selected</p>
                  <p className="text-sm text-slate-400 mt-1">Choose a patient from the list to view their messages</p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-4 bg-white shrink-0">
                  <div className="w-11 h-11 rounded-full bg-[#1a355d] text-white flex items-center justify-center font-bold text-sm">
                    {getInitials(activeInquiry.patientName)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1a355d] text-sm">{activeInquiry.patientName}</p>
                    <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest">Patient</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/40">
                  {loadingChat ? (
                    <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-slate-300" size={24} /></div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((m, idx) => {
                        const isClinic = m.sender === "clinic";
                        const isLast   = idx === messages.length - 1;
                        return (
                          <div key={m.id} className={`flex flex-col ${isClinic ? "items-end" : "items-start"}`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] shadow-sm ${isClinic ? "bg-[#1a355d] text-white rounded-tr-none" : "bg-white border text-slate-700 rounded-tl-none"}`}>
                              {m.text}
                            </div>
                            {isClinic && isLast && (
                              <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                {m.seen ? <><CheckCheck size={11} className="text-teal-500" /> Seen</> : <><Check size={11} /> Delivered</>}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} className="h-2" />
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white shrink-0">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:bg-white focus-within:border-[#1a355d]/40 transition-all">
                    <input
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder={`Reply to ${activeInquiry.patientName}...`}
                      className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                    />
                    <button type="submit" disabled={!replyText.trim()} className="w-10 h-10 bg-[#1a355d] text-white rounded-xl flex items-center justify-center disabled:opacity-30">
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
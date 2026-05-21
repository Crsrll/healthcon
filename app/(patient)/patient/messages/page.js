"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Send, Building2, ChevronRight, Loader2, MessageSquare, Clock, Check, CheckCheck } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { db } from "@/lib/firebase"; // Ensure this points to your firebase config
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function PatientInquiriesPage() {
  const { user, loading: authLoading } = useAuth();

  const [inquiries, setInquiries] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat only
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  // ── 1. Real-time Listener for Conversation List (Sidebar) ──
  useEffect(() => {
    if (!user?.uid || authLoading) return;

    const q = query(
      collection(db, "inquiries"),
      where("patientID", "==", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiries(data);
      
      // Auto-select first conversation if none selected
      if (data.length > 0 && !activeId) {
        setActiveId(data[0].id);
      }
      setLoadingList(false);
    }, (error) => {
      console.error("Sidebar Listener Error:", error);
      setLoadingList(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  // ── 2. Real-time Listener for Specific Messages ──
  useEffect(() => {
    if (!activeId) {
        setMessages([]);
        return;
    };

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

  // Place it right after the messages listener useEffect

  useEffect(() => {
    if (!activeId) return;

    const role = user?.role === "clinic" ? "clinic" : "patient";

    fetch("/api/inquiries/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryId: activeId, role }),
    }).catch(e => console.error(e));
  }, [activeId]);

  // ── Send Message logic remains the same (POST to API) ──
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeId) return;
    const tempText = replyText;
    setReplyText("");

    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "message",
          inquiryId: activeId,
          text: tempText,
          sender: "patient",
        }),
      });
    } catch (e) {
      alert("Failed to send message");
    }
  };

  const activeInquiry = inquiries.find(i => i.id === activeId);
  const filteredInquiries = inquiries.filter(i =>
    i.clinicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const unreadCount = inquiries.filter(i => i.unreadByPatient).length;

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
        <p className="text-sm text-slate-400 font-medium">Loading your messages...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f0f4f8] flex flex-col">
      {/* ── Header ── */}
      <div className="bg-[#1a355d] text-white pt-10 pb-10 px-6 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
              <Link href="/patient/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <ChevronRight size={10} />
              <span className="text-white/50">Messages</span>
            </nav>
            <h1 className="text-3xl font-black tracking-tight">Clinic Messages</h1>
            <p className="text-white/50 text-sm mt-1">Your conversations with clinics</p>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-2xl">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold">{unreadCount} unread</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        <div
          className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6"
          style={{ height: "calc(100vh - 350px)", minHeight: "550px" }}
        >

          {/* ── Sidebar ── */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search clinics..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1a355d]/30 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col">
              {filteredInquiries.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                    <MessageSquare size={24} className="text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500">No conversations yet</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">Message a clinic from their<br/>profile page to start.</p>
                  </div>
                </div>
              ) : (
                filteredInquiries.map(inq => (
                  <button
                    key={inq.id}
                    onClick={() => setActiveId(inq.id)}
                    className={`w-full text-left px-4 py-4 transition-all border-b border-slate-50 last:border-0
                      ${inq.id === activeId ? "bg-[#1a355d]/5 border-l-4 border-l-[#1a355d]" : "border-l-4 border-l-transparent hover:bg-slate-50"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${inq.unreadByPatient ? "bg-[#1a355d] text-white" : "bg-slate-100 text-slate-400"}`}>
                        <Building2 size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className={`text-xs truncate ${inq.unreadByPatient ? "font-bold text-slate-800" : "font-semibold text-slate-500"}`}>{inq.clinicName}</p>
                          <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1"><Clock size={9} />{formatTime(inq.updatedAt)}</span>
                        </div>
                        <p className={`text-[11px] truncate ${inq.unreadByPatient ? "text-slate-600 font-medium" : "text-slate-400"}`}>{inq.lastMessage}</p>
                      </div>
                      {inq.unreadByPatient && <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Chat Panel ── */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            {!activeInquiry ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6">
                  <MessageSquare size={32} className="text-slate-200" />
                </div>
                <h3 className="text-lg font-bold text-slate-600">No conversation selected</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-[280px]">Choose a clinic from the list on the left to view messages.</p>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-4 bg-white shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-[#1a355d] text-white flex items-center justify-center shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1a355d] text-sm truncate">{activeInquiry.clinicName}</p>
                    <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest">Official Clinic Account</p>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/30">
                  {loadingChat ? (
                    <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-slate-300" size={24} /></div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((m, idx) => {
                        const isPatient = m.sender === "patient";
                        const isLast    = idx === messages.length - 1;
                        return (
                          <div key={m.id} className={`flex flex-col ${isPatient ? "items-end" : "items-start"}`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] shadow-sm ${
                              isPatient
                                ? "bg-[#1a355d] text-white rounded-br-none"
                                : "bg-white border border-slate-200 text-slate-700 rounded-bl-none"
                            }`}>
                              {m.text}
                            </div>
                            {isPatient && isLast && (
                              <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                {m.seen
                                  ? <><CheckCheck size={11} className="text-teal-500" /> Seen</>
                                  : <><Check size={11} /> Delivered</>
                                }
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
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                    />
                    <button type="submit" disabled={!replyText.trim()} className="w-10 h-10 bg-[#1a355d] text-white rounded-xl flex items-center justify-center disabled:opacity-30 transition-all">
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
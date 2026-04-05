"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Send, Building2, ChevronRight, Clock } from "lucide-react";

export default function PatientInquiriesPage() {
  const [inquiries, setInquiries] = useState([
    { id: 1, clinic: 'Joseph Community Health', initials: 'JH', msg: 'Your appointment is confirmed.', time: '10 mins ago', unread: true },
    { id: 2, clinic: 'CDO Outpatient Clinic', initials: 'CD', msg: 'Please bring your ID.', time: '1 hour ago', unread: false },
    { id: 3, clinic: 'Iligan Medical Center', initials: 'IM', msg: 'We are closed on holidays.', time: 'Yesterday', unread: false },
  ]);

  const [chatHistories, setChatHistories] = useState({
    1: [
      { id: 1, sender: 'patient', text: 'Are you open on Saturdays?', time: '10:14 AM' },
      { id: 2, sender: 'clinic', text: 'Yes, we are open from 8:00 AM to 12:00 PM.', time: '10:17 AM' },
      { id: 3, sender: 'patient', text: 'Great! Can I book for this Saturday morning?', time: '10:18 AM' },
    ],
    2: [{ id: 1, sender: 'patient', text: 'What are the requirements for a check-up?', time: '09:00 AM' }],
    3: [{ id: 1, sender: 'clinic', text: 'Hello! How can we help you today?', time: 'Yesterday' }],
  });

  const [activeId, setActiveId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState("");

  // Derived Data
  const activeClinic = inquiries.find(i => i.id === activeId);
  const currentMessages = chatHistories[activeId] || [];

  const filteredInquiries = inquiries.filter(i => 
    i.clinic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleSelect = (id) => {
    setActiveId(id);
    setInquiries(prev => prev.map(inq => 
      inq.id === id ? { ...inq, unread: false } : inq
    ));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'patient', // Patient is the user here
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistories(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMessage]
    }));

    setInquiries(prev => prev.map(inq => 
      inq.id === activeId ? { ...inq, msg: replyText, time: 'Just now' } : inq
    ));

    setReplyText("");
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12 font-sans">
      
      {/* ── HEADER ── */}
      <div className="bg-[#1a365d] text-white pt-10 pb-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <Link href="/patient/dashboard" className="hover:text-white transition-colors">Patient</Link>
              <ChevronRight size={10} />
              <span className="text-white/60">Inquiries</span>
            </nav>
            <h1 className="text-3xl font-bold">Clinic Inquiries</h1>
            <p className="text-teal-300 text-sm mt-1">Message clinics directly for questions and support.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
          
          {/* LEFT: CLINIC LIST */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search clinics..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:bg-white focus:border-teal-400 transition-all" 
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-50 no-scrollbar">
              {filteredInquiries.map(inq => (
                <div 
                  key={inq.id} 
                  onClick={() => handleSelect(inq.id)}
                  className={`p-4 cursor-pointer transition-all border-l-4 ${inq.id === activeId ? 'bg-teal-50/50 border-teal-500' : 'hover:bg-slate-50 border-transparent'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${inq.unread ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <Building2 size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold truncate ${inq.unread ? 'text-slate-800' : 'text-slate-500'}`}>{inq.clinic}</p>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">{inq.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{inq.msg}</p>
                    </div>
                    {inq.unread && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CHAT WINDOW */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a365d] text-white flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">{activeClinic?.clinic}</p>
                  <p className="text-[10px] text-teal-500 font-bold uppercase tracking-tight">Official Clinic Account</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-slate-50/30 no-scrollbar">
              {currentMessages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md px-4 py-3 rounded-2xl shadow-sm text-sm ${
                    m.sender === 'patient' 
                    ? 'bg-[#1a365d] text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed">{m.text}</p>
                    <p className={`text-[9px] mt-1.5 font-bold uppercase ${m.sender === 'patient' ? 'text-blue-200' : 'text-slate-400'}`}>
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-slate-100 flex items-center gap-3 bg-white">
              <input 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type a message to the clinic..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm outline-none focus:bg-white focus:border-teal-400 transition-all shadow-inner" 
              />
              <button 
                type="submit"
                disabled={!replyText.trim()}
                className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white p-3 rounded-2xl transition-all shadow-lg shadow-teal-500/20"
              >
                <Send size={20} strokeWidth={2.5} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
"use client";
import { useState } from "react";
import { Search, Send } from "lucide-react";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([
    { id: 1, user: 'Peter Parker', initials: 'PP', msg: 'Are you open on Saturdays?', time: '10 mins ago', unread: true },
    { id: 2, user: 'Diana Prince', initials: 'DP', msg: 'Can I reschedule my check-up?', time: '1 hour ago', unread: true },
    { id: 3, user: 'Clark Kent', initials: 'CK', msg: 'What are your available slots?', time: '3 hours ago', unread: false },
    { id: 4, user: 'Natasha R.', initials: 'NR', msg: 'Is Dr. Villanueva available Mon?', time: 'Yesterday', unread: false },
    { id: 5, user: 'Tony Stark', initials: 'TS', msg: 'Do you accept PhilHealth?', time: 'Yesterday', unread: false },
  ]);

  // 2. Mock Database for Messages (Keyed by Inquiry ID)
  const [chatHistories, setChatHistories] = useState({
    1: [
      { id: 1, sender: 'patient', text: 'Are you open on Saturdays?', time: '10:14 AM' },
      { id: 2, sender: 'clinic', text: 'Yes, we are open from 8:00 AM to 12:00 PM.', time: '10:17 AM' },
      { id: 3, sender: 'patient', text: 'Great! Can I book for this Saturday morning?', time: '10:18 AM' },
    ],
    2: [{ id: 1, sender: 'patient', text: 'Can I reschedule my check-up?', time: '09:00 AM' }],
    3: [{ id: 1, sender: 'patient', text: 'What are your available slots?', time: 'Yesterday' }],
  });

  const [activeId, setActiveId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState("");

  // 3. Derived State: Current Chat Data
  const activeInquiry = inquiries.find(i => i.id === activeId);
  const currentMessages = chatHistories[activeId] || [];

  // 4. Logic: Filtered Sidebar List
  const filteredInquiries = inquiries.filter(i => 
    i.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.msg.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 5. Action: Select an Inquiry
  const handleSelect = (id) => {
    setActiveId(id);
    // Mark as read locally
    setInquiries(prev => prev.map(inq => 
      inq.id === id ? { ...inq, unread: false } : inq
    ));
  };

  // 6. Action: Send Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'clinic',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update Chat History
    setChatHistories(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMessage]
    }));

    // Update last message in sidebar
    setInquiries(prev => prev.map(inq => 
      inq.id === activeId ? { ...inq, msg: replyText, time: 'Just now' } : inq
    ));

    setReplyText("");
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Inquiries</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Patient Messages & Support
          </p>
        </div>
        <div className="bg-teal-50 text-teal-600 px-4 py-2 rounded-xl border border-teal-100">
           <p className="text-[10px] font-bold uppercase tracking-widest">
             {inquiries.filter(i => i.unread).length} Unread Conversations
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:bg-white focus:border-teal-400 transition-all" 
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-50 no-scrollbar">
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map(inq => (
                <div 
                  key={inq.id} 
                  onClick={() => handleSelect(inq.id)}
                  className={`p-4 cursor-pointer transition-all border-l-4 ${inq.id === activeId ? 'bg-teal-50/50 border-teal-500' : 'hover:bg-slate-50 border-transparent'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${inq.unread ? 'bg-healthcon-blue text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {inq.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold truncate ${inq.unread ? 'text-slate-800' : 'text-slate-500'}`}>{inq.user}</p>
                        <span className="text-[9px] text-slate-400 shrink-0 font-bold uppercase">{inq.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{inq.msg}</p>
                    </div>
                    {inq.unread && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-400 italic text-sm">No conversations found.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-healthcon-blue text-white font-black text-xs flex items-center justify-center">
                {activeInquiry?.initials}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">{activeInquiry?.user}</p>
                <p className="text-[10px] text-teal-500 font-bold uppercase tracking-tight">Active Conversation</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-slate-50/30 no-scrollbar">
            {currentMessages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'clinic' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md px-4 py-3 rounded-2xl shadow-sm text-sm ${
                  m.sender === 'clinic' 
                  ? 'bg-healthcon-blue text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed">{m.text}</p>
                  <p className={`text-[9px] mt-1.5 font-bold uppercase ${m.sender === 'clinic' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {m.time} {m.sender === 'clinic' && '· Read'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-slate-100 flex items-center gap-3 bg-white">
            <input 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response..." 
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
    </main>
  );
}
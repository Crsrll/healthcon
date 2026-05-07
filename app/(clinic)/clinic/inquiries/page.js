"use client";
import { useState, useEffect } from "react";
import { Search, Send, Loader2, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function InquiriesPage() {
  const { user, loading: authLoading } = useAuth();
  
  // States
  const [inquiries, setInquiries] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState("");

  // 1. Fetch Conversations (Sidebar)
  const fetchInquiries = async () => {
    if (!user?.uid) return;
    try {
      const res = await fetch(`/api/inquiries?clinicID=${user.uid}`);
      const json = await res.json();
      if (json.success) {
        setInquiries(json.data);
        if (json.data.length > 0 && !activeId) setActiveId(json.data[0].id);
      }
    } catch (e) { console.error(e); }
    setLoadingList(false);
  };

  // 2. Fetch Messages for active chat
  const fetchMessages = async (id) => {
    setLoadingChat(true);
    try {
      const res = await fetch(`/api/inquiries?inquiryId=${id}`);
      const json = await res.json();
      if (json.success) setMessages(json.data);
    } catch (e) { console.error(e); }
    setLoadingChat(false);
  };

  useEffect(() => {
    if (!authLoading) fetchInquiries();
  }, [user, authLoading]);

  useEffect(() => {
    if (activeId) fetchMessages(activeId);
  }, [activeId]);

  // 3. Send Reply
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeId) return;

    const tempText = replyText;
    setReplyText("");

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: activeId,
          text: tempText,
          sender: 'clinic',
          clinicID: user.uid
        })
      });

      if (res.ok) {
        fetchMessages(activeId); // Refresh chat
        fetchInquiries(); // Refresh sidebar preview
      }
    } catch (e) { alert("Failed to send"); }
  };

  const activeInquiry = inquiries.find(i => i.id === activeId);
  const filteredInquiries = inquiries.filter(i => 
    i.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loadingList) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-teal-500" /></div>;

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Inquiries</h2>
        <div className="bg-teal-50 text-teal-600 px-4 py-2 rounded-xl text-[10px] font-bold uppercase">
          {inquiries.filter(i => i.unreadByClinic).length} New Messages
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        
        {/* SIDEBAR */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search chats..." className="w-full bg-slate-50 border rounded-xl pl-9 pr-4 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
            {filteredInquiries.map(inq => (
              <div key={inq.id} onClick={() => setActiveId(inq.id)} className={`p-4 cursor-pointer transition-all border-l-4 ${inq.id === activeId ? 'bg-teal-50/50 border-teal-500' : 'border-transparent hover:bg-slate-50'}`}>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-500">
                    {inq.patientName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{inq.patientName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{inq.lastMessage}</p>
                  </div>
                  {inq.unreadByClinic && <div className="w-2 h-2 bg-red-500 rounded-full mt-1" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a355d] text-white flex items-center justify-center font-bold text-xs">
              {activeInquiry?.patientName?.[0] || "?"}
            </div>
            <p className="font-bold text-sm">{activeInquiry?.patientName || "Select a chat"}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {loadingChat ? <Loader2 className="animate-spin mx-auto mt-10 text-slate-300" /> : 
              messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'clinic' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md px-4 py-2 rounded-2xl text-sm ${m.sender === 'clinic' ? 'bg-[#1a355d] text-white' : 'bg-white border text-slate-700'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
            <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type a reply..." className="flex-1 bg-slate-50 border rounded-xl px-4 py-2 text-sm outline-none focus:bg-white" />
            <button type="submit" className="bg-teal-500 text-white p-2.5 rounded-xl hover:bg-teal-600 transition-all">
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
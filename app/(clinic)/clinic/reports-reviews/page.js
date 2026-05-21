"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Star, Calendar, User, Search, AlertTriangle, CheckCircle2, Clock, X, Mail, Phone, MessageCircle, Flag, Stethoscope } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ClinicReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [tab, setTab] = useState("Reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [sendingResponse, setSendingResponse] = useState(false);
  const [inquiryMessages, setInquiryMessages] = useState([]);
  const [showInquiry, setShowInquiry] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [clinicID, setClinicID] = useState(null);

  // Get clinic ID from user or localStorage
  useEffect(() => {
    if (user) {
      const id = user.clinicId || user.clinicID || user.uid || user.clinic?.id;
      if (id) {
        setClinicID(id);
      } else {
        const savedClinicId = localStorage.getItem('clinicId');
        if (savedClinicId) {
          setClinicID(savedClinicId);
        } else {
          setClinicID("clinic_demo_123");
        }
      }
    }
  }, [user]);

  // Fetch Reports
  const fetchReports = async () => {
    if (!clinicID) return;
    try {
      const res = await fetch(`/api/reports/to-clinic?clinicID=${clinicID}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  // Fetch Reviews
  const fetchReviews = async () => {
    if (!clinicID) return;
    try {
      const res = await fetch(`/api/reviews?clinicID=${clinicID}&status=pending`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  // Fetch Reply Messages
  const fetchReplyMessages = async (replyId) => {
    try {
      const res = await fetch(`/api/clinic-replies?replyId=${replyId}`);
      const data = await res.json();
      if (data.success) {
        setInquiryMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    if (clinicID) {
      Promise.all([fetchReports(), fetchReviews()]).finally(() => setLoading(false));
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [clinicID, authLoading]);

  // Handle Report Resolution
  const handleResolveReport = async (report) => {
    try {
      const res = await fetch(`/api/reports/to-clinic`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: report.id,
          status: 'resolved',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchReports();
        setSelectedReport(null);
      }
    } catch (error) {
      console.error("Failed to resolve report:", error);
    }
  };

  // Handle Response to Report
  const handleSendResponse = async () => {
    if (!respondingTo || !responseText.trim()) return;

    setSendingResponse(true);
    try {
      const replyRes = await fetch(`/api/clinic-replies?reportId=${respondingTo.id}`);
      const replyData = await replyRes.json();
      
      let replyId = replyData.reply?.id;
      
      if (!replyId) {
        const createRes = await fetch('/api/clinic-replies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            clinicID: respondingTo.clinicID,
            clinicName: respondingTo.clinicName,
            patientID: respondingTo.reporterID,
            patientName: respondingTo.reporterName,
            firstMessage: responseText.trim(),
            reportId: respondingTo.id,
          }),
        });
        const createJson = await createRes.json();
        if (createJson.success) {
          replyId = createJson.replyId;
        }
      } else {
        await fetch('/api/clinic-replies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'message',
            replyId,
            text: responseText.trim(),
            sender: 'clinic',
            senderName: 'Clinic Staff',
          }),
        });
      }

      setResponseText("");
      setRespondingTo(null);
      await fetchReports();
    } catch (error) {
      console.error("Failed to send response:", error);
    } finally {
      setSendingResponse(false);
    }
  };

  // Open Reply Thread
  const openReply = async (report) => {
    try {
      const res = await fetch(`/api/clinic-replies?reportId=${report.id}`);
      const data = await res.json();
      if (data.success && data.reply) {
        setSelectedInquiryId(data.reply.id);
        await fetchReplyMessages(data.reply.id);
        setShowInquiry(true);
      } else {
        setInquiryMessages([]);
        setShowInquiry(true);
      }
    } catch (error) {
      console.error("Failed to load reply thread:", error);
    }
  };

  const severityStyles = {
    high: "bg-red-50 text-red-600 border-red-100",
    medium: "bg-amber-50 text-amber-600 border-amber-100",
    low: "bg-blue-50 text-blue-600 border-blue-100",
  };

  const filteredReports = reports.filter((r) => {
    const query = searchQuery.toLowerCase();
    return (
      (r.reporterName || '').toLowerCase().includes(query) ||
      (r.subject || '').toLowerCase().includes(query) ||
      (r.message || '').toLowerCase().includes(query) ||
      (r.doctorName || '').toLowerCase().includes(query)
    );
  });

  const filteredReviews = reviews.filter((r) => {
    const query = searchQuery.toLowerCase();
    return (
      (r.patientName || '').toLowerCase().includes(query) ||
      (r.review || '').toLowerCase().includes(query)
    );
  });

  if (authLoading || loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  if (!clinicID && !user) {
    return (
      <div className="p-6 max-w-5xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Unable to Load Clinic Data</h3>
          <p className="text-sm text-slate-400 max-w-sm">
            Please make sure you are logged in as a clinic administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Feedback & Quality</h2>
          <p className="text-sm text-slate-500">Monitor patient satisfaction and resolve reported issues</p>
        </div>
        
        <div className="relative group md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
          <input 
            type="text"
            placeholder={`Search ${tab.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all w-full"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        {["Reports", "Reviews"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl transition-all
              ${tab === t ? "bg-white text-teal-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-teal-50 text-teal-600' : 'bg-slate-200 text-slate-500'}`}>
              {t === "Reports" ? filteredReports.length : filteredReviews.length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {tab === "Reports" ? (
          <div className="divide-y divide-slate-100">
            {filteredReports.length > 0 ? filteredReports.map((r) => (
              <div key={r.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={12} /> {r.createdAt?.toDate ? new Date(r.createdAt.toDate()).toLocaleDateString() : r.timestamp ? new Date(r.timestamp).toLocaleDateString() : 'Recent'}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        r.status === 'resolved' ? 'bg-green-100 text-green-700' : 
                        r.status === 'reviewed' ? 'bg-blue-100 text-blue-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status || 'pending'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <User size={14} className="text-slate-400" /> {r.reporterName || 'Anonymous'}
                    </h4>
                    <p className="text-sm font-medium text-slate-700">Subject: {r.subject}</p>
                    {r.doctorName && (
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Stethoscope size={12} /> Doctor: Dr. {r.doctorName}
                      </p>
                    )}
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{r.message?.substring(0, 150)}{r.message?.length > 150 ? '...' : ''}"
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => openReply(r)} 
                      className="text-xs font-medium text-teal-600 px-3 py-2 bg-teal-50 rounded-lg hover:bg-teal-100 transition flex items-center gap-1"
                    >
                      <MessageCircle size={12} /> Chat
                    </button>
                    <button 
                      onClick={() => setRespondingTo(r)} 
                      className="text-xs font-bold text-teal-600 px-4 py-2 bg-teal-50 rounded-lg hover:bg-teal-100 transition"
                    >
                      Respond
                    </button>
                    <button 
                      onClick={() => setSelectedReport(r)} 
                      className="text-xs font-medium text-slate-600 px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Flag size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Reports Yet</h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  When patients submit reports about your clinic, they will appear here.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReviews.length > 0 ? filteredReviews.map((r) => (
              <div key={r.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {r.patientName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{r.patientName || 'Anonymous'}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar size={10} /> {r.createdAt?.toDate ? new Date(r.createdAt.toDate()).toLocaleDateString() : r.timestamp ? new Date(r.timestamp).toLocaleDateString() : 'Recent'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">"{r.review}"</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Star size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Reviews Yet</h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  When patients leave reviews about your clinic, they will appear here for moderation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      <Modal isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} title="Report Details">
        {selectedReport && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Patient Info - Centered */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-2xl font-bold text-teal-600 mb-3">
                {selectedReport.reporterName?.[0]?.toUpperCase() || 'U'}
              </div>
              <h4 className="text-xl font-bold text-slate-800">{selectedReport.reporterName || 'Anonymous'}</h4>
              {selectedReport.reporterEmail && (
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <Mail size={14} /> {selectedReport.reporterEmail}
                </div>
              )}
            </div>

            {/* Subject - Centered */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <AlertTriangle size={14} className="text-amber-500" /> Subject
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 text-center break-words">
                {selectedReport.subject}
              </div>
            </div>

            {/* Report Details - Centered */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Flag size={14} className="text-red-500" /> Report Details
              </div>
              <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl text-sm text-slate-700 leading-relaxed text-center break-words">
                {selectedReport.message}
              </div>
            </div>

            {/* Doctor Information - Centered */}
            {selectedReport.doctorName && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Stethoscope size={14} className="text-blue-500" /> Doctor Concerned
                </div>
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-sm font-medium text-slate-700 text-center">
                  Dr. {selectedReport.doctorName}
                </div>
              </div>
            )}

            {/* Appointment Details - Centered */}
            {(selectedReport.appointmentType || selectedReport.preferredDate || selectedReport.preferredTime) && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar size={14} className="text-green-500" /> Appointment Request
                </div>
                <div className="p-4 bg-green-50/50 border border-green-100 rounded-2xl">
                  <div className="space-y-2 text-center">
                    {selectedReport.appointmentType && (
                      <div className="text-sm">
                        <span className="text-slate-500">Type: </span>
                        <span className="font-medium text-slate-700">{selectedReport.appointmentType}</span>
                      </div>
                    )}
                    {selectedReport.preferredDate && (
                      <div className="text-sm">
                        <span className="text-slate-500">Preferred Date: </span>
                        <span className="font-medium text-slate-700">{selectedReport.preferredDate}</span>
                      </div>
                    )}
                    {selectedReport.preferredTime && (
                      <div className="text-sm">
                        <span className="text-slate-500">Preferred Time: </span>
                        <span className="font-medium text-slate-700">{selectedReport.preferredTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Metadata - Centered */}
            <div className="grid grid-cols-2 gap-y-4 pt-4 border-t border-slate-100">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Reported On</p>
                <p className="text-sm font-semibold text-slate-700">
                  {selectedReport.createdAt?.toDate ? new Date(selectedReport.createdAt.toDate()).toLocaleDateString() : selectedReport.timestamp ? new Date(selectedReport.timestamp).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                <p className={`text-sm font-semibold ${
                  selectedReport.status === 'resolved' ? 'text-green-600' : 
                  selectedReport.status === 'reviewed' ? 'text-blue-600' : 'text-amber-600'
                }`}>
                  {selectedReport.status || 'pending'}
                </p>
              </div>
            </div>

            {/* Action Buttons - Centered */}
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedReport(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm transition-all"
              >
                Close
              </button>
              {selectedReport.status !== 'resolved' && (
                <button 
                  onClick={() => handleResolveReport(selectedReport)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-500/20"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Response Modal */}
      <Modal isOpen={!!respondingTo} onClose={() => setRespondingTo(null)} title="Respond to Patient">
        {respondingTo && (
          <div className="space-y-5">
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Original Report:</p>
              <p className="text-sm text-slate-700 font-medium">{respondingTo.subject}</p>
              <p className="text-sm text-slate-600 mt-2">{respondingTo.message}</p>
              {respondingTo.doctorName && (
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Stethoscope size={12} /> Doctor: Dr. {respondingTo.doctorName}
                </p>
              )}
              {respondingTo.preferredDate && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar size={12} /> Preferred: {respondingTo.preferredDate} {respondingTo.preferredTime && `at ${respondingTo.preferredTime}`}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Your Response</label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={5}
                placeholder="Write your response to the patient..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-200 outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setRespondingTo(null)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendResponse}
                disabled={!responseText.trim() || sendingResponse}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50"
              >
                {sendingResponse ? 'Sending...' : 'Send Response'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Inquiry Chat Modal */}
      <Modal isOpen={showInquiry} onClose={() => setShowInquiry(false)} title="Patient Conversation">
        {showInquiry && (
          <div className="space-y-4 h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-3">
              {inquiryMessages.length > 0 ? inquiryMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'clinic' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === 'clinic' 
                      ? 'bg-teal-600 text-white rounded-tr-sm' 
                      : 'bg-slate-100 text-slate-700 rounded-tl-sm'
                  }`}>
                    <p className="text-xs font-medium mb-1">
                      {msg.sender === 'clinic' ? 'You (Clinic)' : msg.senderName || 'Patient'}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className="text-[10px] opacity-70 mt-1">
                      {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString() : ''}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-slate-400 py-8">
                  No messages yet. Start the conversation by responding to the report.
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <button 
                onClick={() => setShowInquiry(false)}
                className="w-full py-3 bg-slate-100 rounded-xl text-sm font-medium text-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
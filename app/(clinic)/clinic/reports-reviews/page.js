"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal"; // Ensure path is correct (@/ refers to root)
import { Star, Calendar, User, Search, AlertTriangle, CheckCircle2, Clock, X} from "lucide-react";

const REPORTS = [
  {
    id: 1,
    patient: "John Doe",
    issue: "Doctor was late for over 45 minutes without notice.",
    date: "Mar 20, 2024",
    severity: "high",
    status: "Pending",
    doctor: "Dr. Aris Thorne",
    email: "john.doe@example.com",
    phone: "0912-345-6789"        
  },
  {
    id: 2,
    patient: "Mark Vergel",
    issue: "Prescription not appearing in the digital portal.",
    date: "Mar 18, 2024",
    severity: "medium",
    status: "Resolved",
    doctor: "Dr. Sarah Lee",
    email: "mark.v@example.com",   
    phone: "0998-765-4321"         
  },
];

const REVIEWS = [
  {
    id: 1,
    patient: "Jane Smith",
    rating: 4,
    comment: "The clinic was very clean and the staff were helpful. Waiting time was a bit long though.",
    date: "Mar 19, 2024",
    doctor: "Dr. Aris Thorne"
  },
  {
    id: 2,
    patient: "Robert Fox",
    rating: 5,
    comment: "Excellent experience. Dr. Lee was very thorough with the explanation.",
    date: "Mar 15, 2024",
    doctor: "Dr. Sarah Lee"
  },
];

export default function ClinicReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [tab, setTab] = useState("Reports");
  const [searchQuery, setSearchQuery] = useState("");

  const severityStyles = {
    high: "bg-red-50 text-red-600 border-red-100",
    medium: "bg-amber-50 text-amber-600 border-amber-100",
    low: "bg-blue-50 text-blue-600 border-blue-100",
  };

  // ── FILTER LOGIC ──
  const filteredReports = REPORTS.filter((r) => {
    const query = searchQuery.toLowerCase();
    return (
      r.patient.toLowerCase().includes(query) ||
      r.doctor.toLowerCase().includes(query) ||
      r.issue.toLowerCase().includes(query)
    );
  });

  const filteredReviews = REVIEWS.filter((r) => {
    const query = searchQuery.toLowerCase();
    return (
      r.patient.toLowerCase().includes(query) ||
      r.doctor.toLowerCase().includes(query) ||
      r.comment.toLowerCase().includes(query)
    );
  });

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6 min-h-screen">
      
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

      {/* ── TABS ── */}
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

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {tab === "Reports" ? (
          <div className="divide-y divide-slate-100">
            {filteredReports.length > 0 ? filteredReports.map((r) => (
              <div key={r.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${severityStyles[r.severity]}`}>
                        {r.severity} Priority
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400 italic"><Clock size={12} /> {r.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2"><User size={14} className="text-slate-400" /> {r.patient}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 italic">"{r.issue}"</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span>Concerned: <b className="text-slate-700">{r.doctor}</b></span>
                      <span className={`flex items-center gap-1 ${r.status === 'Resolved' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {r.status === 'Resolved' ? <CheckCircle2 size={12} /> : <Clock size={12} />} Status: {r.status}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedReport(r)} 
                    className="text-xs font-bold text-teal-600 px-4 py-2 bg-teal-50 rounded-lg hover:bg-teal-100 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )) : <EmptyState message={`No reports found for "${searchQuery}"`} />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {filteredReviews.length > 0 ? filteredReviews.map((r) => (
              <div key={r.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">{r.patient[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{r.patient}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1"><Calendar size={10} /> {r.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4 italic leading-relaxed">"{r.comment}"</p>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-3 border-t border-slate-50">
                   Consulted with <span className="font-semibold text-slate-600">{r.doctor}</span>
                </div>
              </div>
            )) : <EmptyState message={`No reviews found for "${searchQuery}"`} />}
          </div>
        )}
      </div>

       {/* ── DETAIL MODAL (UTILIZING REUSABLE MODAL COMPONENT) ── */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Report Details"
      >
        {selectedReport && (
          <div className="space-y-8">
            {/* Patient Identity */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-2xl font-bold text-teal-600 mb-3 shadow-inner">
                {selectedReport.patient[0]}
              </div>
              <h4 className="text-xl font-bold text-slate-800">{selectedReport.patient}</h4>
              <div className="flex gap-4 mt-2">
                 <div className="text-center">
                   <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Email</p>
                   <p className="text-xs font-medium text-slate-600">{selectedReport.email}</p>
                 </div>
                 <div className="text-center border-l pl-4 border-slate-100">
                   <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Contact</p>
                   <p className="text-xs font-medium text-slate-600">{selectedReport.phone}</p>
                 </div>
              </div>
            </div>

            {/* The Complaint */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <AlertTriangle size={14} className="text-amber-500" /> Reported Issue
              </div>
              <div className="p-6 bg-red-50/50 border border-red-100 rounded-2xl text-sm text-slate-700 leading-relaxed italic text-center">
                "{selectedReport.issue}"
              </div>
            </div>

            {/* Admin Metadata */}
            <div className="grid grid-cols-2 gap-y-4 pt-4 border-t border-slate-50">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Doctor Assigned</p>
                  <p className="text-sm font-semibold text-slate-700">{selectedReport.doctor}</p>
                </div>
                <div className="text-center border-l border-slate-50">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Incident Date</p>
                  <p className="text-sm font-semibold text-slate-700">{selectedReport.date}</p>
                </div>
            </div>

            {/* Footer Action */}
            <div className="pt-2">
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-teal-500/20"
              >
                {selectedReport.status === "Resolved" ? "Close Details" : "Mark as Resolved"}
              </button>
            </div>
          </div>
        )}
      </Modal>

    </main>
  );
}

// ── EMPTY STATE COMPONENT ──
function EmptyState({ message }) {
  return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400 text-center">
      <Search size={40} className="mb-4 opacity-20" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
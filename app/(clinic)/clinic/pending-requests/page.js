"use client";
import { useState } from "react";
import { Clock} from "lucide-react";

// 1. Mock Data for Pending Requests
const INITIAL_REQUESTS = [
  { id: 1, patient: "Peter Parker", service: "General Check-up", date: "Mar 28, 2026", time: "09:00 AM" },
  { id: 2, patient: "Diana Prince", service: "Laboratory Test", date: "Mar 28, 2026", time: "10:30 AM" },
  { id: 3, patient: "Wanda Maximoff", service: "Consultation", date: "Mar 29, 2026", time: "02:00 PM" },
  { id: 4, patient: "Bruce Wayne", service: "Follow-up", date: "Mar 30, 2026", time: "11:00 AM" },
  { id: 5, patient: "Clark Kent", service: "Prenatal Check-up", date: "Mar 30, 2026", time: "03:00 PM" },
];

export default function PendingRequestsPage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  // 2. Action Handlers
  const handleAction = (id, patientName, action) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    alert(`${patientName} has been ${action === 'approve' ? 'Approved' : 'Declined'}`);
  };

  return (
    <main className="p-6 space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pending Requests</h2>
        <p className="text-sm text-slate-400 font-medium">Review and manage incoming appointment requests</p>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Requested Schedule</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100">
                        {req.patient.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-sm text-slate-800">{req.patient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      {req.service}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{req.date}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{req.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                        <button 
                        onClick={() => handleAction(req.id, req.patient, 'approve')}
                        className="text-xs font-semibold text-white bg-teal-500 hover:bg-teal-400 px-3 py-1.5 rounded-lg transition-colors"
                        >
                        Approve
                        </button>

                        <button 
                        onClick={() => handleAction(req.id, req.patient, 'decline')}
                        className="text-xs font-semibold text-red-500 bg-slate-100 hover:text-red-600 hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                        Reject
                        </button>
                    </div>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Clock size={40} className="text-slate-200" />
                    <p className="text-slate-400 font-medium italic">No pending requests at the moment.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
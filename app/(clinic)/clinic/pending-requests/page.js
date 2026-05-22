"use client";
import { Clock, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePendingRequests } from "@/hooks/usePendingRequests";

export default function PendingRequestsPage() {
  const { user, loading: authLoading } = useAuth();
  const { requests, loading, handleAction } = usePendingRequests(user?.uid);

  const onAction = async (id, patientName, action) => {
    const result = await handleAction(id, action);
    if (result.success) {
      alert(`${patientName} has been ${action === "approve" ? "Confirmed" : "Rejected"}`);
    } else {
      alert("Failed to update status");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-xs font-bold uppercase tracking-widest">Fetching Requests...</p>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Pending Requests</h2>
        <p className="text-sm text-slate-400 font-medium">Review and manage incoming appointment requests</p>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[560px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 sm:px-6 py-4">Patient</th>
                <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">Service</th>
                <th className="px-4 sm:px-6 py-4 hidden md:table-cell">Doctor</th>
                <th className="px-4 sm:px-6 py-4">Schedule</th>
                <th className="px-4 sm:px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 sm:px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100 shrink-0">
                          {req.patientName ? req.patientName.substring(0, 2).toUpperCase() : "PT"}
                        </div>
                        <span className="font-semibold text-sm text-slate-800">{req.patientName}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-5 hidden sm:table-cell">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                        {req.service}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-5 font-bold text-sm text-slate-800 hidden md:table-cell">
                      {req.doctorName}
                    </td>
                    <td className="px-4 sm:px-6 py-5 text-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{req.date}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{req.time}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-5">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => onAction(req.id, req.patientName, "approve")}
                          className="flex items-center gap-1.5 text-xs font-bold text-white bg-teal-500 hover:bg-teal-600 px-3 sm:px-4 py-2 rounded-xl transition-all shadow-md shadow-teal-500/20"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => onAction(req.id, req.patientName, "decline")}
                          className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 sm:px-4 py-2 rounded-xl transition-all"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Clock size={40} className="text-slate-200" />
                      <p className="text-slate-400 font-medium italic">No pending requests at the moment.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

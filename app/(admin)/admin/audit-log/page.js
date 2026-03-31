"use client";

const auditLogs = [
  { action: "Clinic Approved — City Care Plus", time: "1h ago",  dot: "bg-teal-400"  },
  { action: "New User Registered",              time: "2h ago",  dot: "bg-blue-400"  },
  { action: "High Traffic Alert",               time: "3h ago",  dot: "bg-red-400"   },
  { action: "DB Backup Completed",              time: "5h ago",  dot: "bg-teal-400"  },
  { action: "Doctor Flagged for Review",        time: "6h ago",  dot: "bg-amber-400" },
  { action: "System Settings Updated",          time: "8h ago",  dot: "bg-slate-400" },
];

export default function AuditLogPage() {
  return (
    <main className="p-6 space-y-6">
      
      {/* Header Section: Title on Left, Legends on Right */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">Audit Log</h2>
          <p className="text-xs text-slate-400 mt-0.5">Recent system activities and changes</p>
        </div>

        {/* Smaller, compact legends */}
        <div className="flex flex-col items-start md:items-end">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Activity Legends
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Clinics & Data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">User Activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">System Alerts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Review/Flagged</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">General</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-10">
                Status
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Activity / Action
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Time
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                Node
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {auditLogs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className={`w-2 h-2 rounded-full ${log.dot} shadow-sm`}></div>
                </td>
                <td className="px-5 py-4 font-semibold text-sm text-slate-800">
                  {log.action}
                </td>
                <td className="px-5 py-4 text-sm text-slate-500 italic">
                  {log.time}
                </td>
                <td className="px-5 py-4 text-[10px] font-bold text-slate-300 uppercase text-right">
                  System_Node_01
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="bg-slate-50/50 px-5 py-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
            Showing all {auditLogs.length} system events
          </p>
        </div>
      </section>
    </main>
  );
}
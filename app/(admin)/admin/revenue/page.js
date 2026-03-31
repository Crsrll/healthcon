"use client";
import { useState } from "react";
import { Banknote, TrendingUp, CreditCard, Wallet, ArrowUpRight, Download } from "lucide-react";

const RECENT_TRANSACTIONS = [
  { id: "TXN-8829", clinic: "City Care Plus", date: "Mar 26, 02:45 PM", amount: "₱1,500", type: "Subscription", status: "paid" },
  { id: "TXN-8830", clinic: "Dermacare Cebu", date: "Mar 26, 11:20 AM", amount: "₱420", type: "Commission", status: "paid" },
  { id: "TXN-8831", clinic: "Metro Health", date: "Mar 25, 09:15 AM", amount: "₱2,500", type: "Subscription", status: "pending" },
  { id: "TXN-8832", clinic: "Joseph Community", date: "Mar 25, 04:30 PM", amount: "₱850", type: "Premium Ads", status: "paid" },
  { id: "TXN-8833", clinic: "Iligan Medical", date: "Mar 24, 01:00 PM", amount: "₱310", type: "Commission", status: "failed" },
  { id: "TXN-8834", clinic: "CDO Outpatient", date: "Mar 24, 10:00 AM", amount: "₱1,200", type: "Subscription", status: "paid" },
  { id: "TXN-8835", clinic: "Sheila Community", date: "Mar 23, 03:45 PM", amount: "₱500", type: "Ads & Listings", status: "pending" },
];

const STATUS_STYLE = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  failed: "bg-red-50 text-red-700 border-red-100",
};

export default function RevenuePage() {
  const [filter, setFilter] = useState("All");

  // 1. FILTER LOGIC
  const filteredTransactions = RECENT_TRANSACTIONS.filter((txn) => {
    if (filter === "All") return true;
    return txn.status.toLowerCase() === filter.toLowerCase();
  });

  // 2. DYNAMIC STATS FOR HEADER
  const stats = {
    paid: RECENT_TRANSACTIONS.filter(t => t.status === 'paid').length,
    pending: RECENT_TRANSACTIONS.filter(t => t.status === 'pending').length,
    failed: RECENT_TRANSACTIONS.filter(t => t.status === 'failed').length,
  };

  return (
    <main className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Platform Revenue</h2>
          <p className="text-sm text-slate-400 font-medium">Financial overview and transaction history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[560px] relative">
            <div className="sticky top-0 z-20 bg-white px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-800">Recent Transactions</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">
                   {stats.paid} Settled · {stats.pending} Waiting · {stats.failed} Issues
                </p>
              </div>

              {/* 3. FUNCTIONAL FILTER BUTTONS */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {["All", "Paid", "Pending", "Failed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}  
                    className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                      filter === tab 
                        ? "bg-white text-slate-800 shadow-sm" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10 bg-slate-50">
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-7.5 py-4">Transaction ID</th>
                    <th className="px-7.5 py-4">Clinic</th>
                    <th className="px-7.5 py-4">Amount</th>
                    <th className="px-7.5 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {/* 4. MAP OVER FILTERED DATA */}
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5 text-xs font-mono text-slate-400">{txn.id}</td>
                        <td className="px-8 py-5">
                          <p className="font-bold text-slate-700 text-sm group-hover:text-teal-600 transition-colors">{txn.clinic}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{txn.type} · {txn.date}</p>
                        </td>
                        <td className="px-8 py-5 font-black text-slate-800 text-sm">{txn.amount}</td>
                        <td className="px-8 py-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${STATUS_STYLE[txn.status]}`}>
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-20 text-center text-slate-400 font-medium italic text-sm">
                        No transactions found for "{filter}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {/* Revenue Mix (Doughnut) */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 text-sm mb-6 uppercase tracking-tight">Revenue Mix</h3>
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full shrink-0 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#14b8a6" strokeWidth="3" strokeDasharray="59 41"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="29 71" strokeDashoffset="-59"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="12 88" strokeDashoffset="-88"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-xl font-black text-slate-800 leading-none">59%</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Subscriptions</p>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              {[
                { label: "Subscriptions", amt: "₱148.2k", pct: "59%", color: "bg-teal-500" },
                { label: "Commissions", amt: "₱72.4k", pct: "29%", color: "bg-blue-500" },
                { label: "Ads & Listings", amt: "₱30.2k", pct: "12%", color: "bg-indigo-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-[11px] font-bold text-slate-600">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-slate-800">{item.amt}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full transition-all`} style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Info Card */}
          <div className="bg-healthcon-blue rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <ArrowUpRight className="absolute -top-2 -right-2 text-white/10" size={80} />
             <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-2">Projected Growth</p>
             <h4 className="text-xl font-bold leading-tight mb-4">Estimated ₱300k by end of Quarter</h4>
             <p className="text-xs text-blue-200 leading-relaxed opacity-80 italic font-medium">Based on current clinic onboarding rates.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
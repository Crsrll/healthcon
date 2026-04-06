"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { 
  CreditCard, 
  Search, 
  ChevronRight, 
  Download, 
  Wallet, 
  Receipt, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  Banknote
} from "lucide-react";

export default function BillingPage() {
  // --- STATES ---
  const [filter, setFilter] = useState("All");
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // --- MOCK DATA ---
  const [invoices, setInvoices] = useState([
    { id: "INV-2024-001", clinic: "Joseph Community Health", service: "General Consultation", date: "Apr 02, 2026", amount: 500, status: "Unpaid" },
    { id: "INV-2024-002", clinic: "CDO Outpatient Clinic", service: "Blood Panel Test", date: "Mar 28, 2026", amount: 1250, status: "Paid" },
    { id: "INV-2024-003", clinic: "Iligan Medical Center", service: "X-Ray Chest", date: "Mar 15, 2026", amount: 850, status: "Paid" },
    { id: "INV-2024-004", clinic: "Joseph Community Health", service: "Follow-up Visit", date: "Mar 10, 2026", amount: 300, status: "Paid" },
  ]);

  // --- LOGIC: FILTERING ---
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => filter === "All" || inv.status === filter);
  }, [filter, invoices]);

  const totalBalance = invoices
    .filter(inv => inv.status !== "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // --- HANDLERS ---
  const handlePayNow = (invoice) => {
    setSelectedInvoice(invoice);
    setIsPayModalOpen(true);
  };

  const confirmPayment = () => {
    setInvoices(prev => prev.map(inv => 
      inv.id === selectedInvoice.id ? { ...inv, status: "Paid" } : inv
    ));
    setIsPayModalOpen(false);
    alert("Payment Successful! Your receipt has been generated.");
  };

  const statusStyles = {
    Paid: "bg-teal-50 text-teal-700 border-teal-100",
    Unpaid: "bg-amber-50 text-amber-700 border-amber-100",
    Overdue: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      
      {/* ── HEADER ── */}
      <div className="bg-[#1a365d] text-white pt-12 pb-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <Link href="/patient/dashboard" className="hover:text-white transition-colors">Patient</Link>
              <ChevronRight size={10} />
              <span className="text-white/60">Billing</span>
            </nav>
            <h1 className="text-3xl font-bold">Bills & Payments</h1>
            <p className="text-teal-300 text-sm mt-1">Manage your clinical invoices and payment history.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-right">
            <p className="text-[13px] font-black text-teal-400 uppercase tracking-widest mt-1">Total Outstanding: <span className="text-xl font-black text-white mt-1">₱{totalBalance.toLocaleString()}</span></p>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-6 space-y-8">
        
        {/* ── 1. SUMMARY CARDS ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 flex items-center">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Receipt size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid this Month</p>
              <p className="text-xl font-black text-slate-800">₱2,100.00</p>
            </div>
          </div>
          <div className="bg-[#1a365d] p-6 rounded-2xl shadow-lg flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white/10 text-teal-400 rounded-xl flex items-center justify-center shrink-0">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Payment Method</p>
                <p className="text-sm font-bold text-white">GCash •••• 8829</p>
              </div>
            </div>
            <ArrowUpRight className="text-white/40 group-hover:text-teal-400 transition-colors" />
          </div>
        </section>

        {/* ── 2. INVOICE TABLE ── */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Transaction History</h3>
            
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              {["All", "Paid", "Unpaid"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                    filter === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-4">Invoice ID</th>
                  <th className="px-8 py-4">Clinic & Service</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-mono text-xs text-slate-400">{inv.id}</td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-800 text-sm">{inv.clinic}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{inv.service} · {inv.date}</p>
                    </td>
                    <td className="px-8 py-5 font-black text-slate-900 text-sm">₱{inv.amount.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${statusStyles[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {inv.status === "Paid" ? (
                        <button className="p-2 text-slate-300 hover:text-teal-600 transition-colors">
                          <Download size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handlePayNow(inv)}
                          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-teal-900/20"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── PAYMENT MODAL ── */}
      <Modal 
        isOpen={isPayModalOpen} 
        onClose={() => setIsPayModalOpen(false)} 
        title="Complete Payment"
      >
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount to Pay</p>
            <h2 className="text-3xl font-black text-slate-900">₱{selectedInvoice?.amount.toLocaleString()}</h2>
            <p className="text-xs text-slate-500 mt-2 font-medium">{selectedInvoice?.service} at {selectedInvoice?.clinic}</p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Payment Method</p>
            <div className="p-4 border-2 border-teal-500 bg-teal-50/30 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-blue-600 font-black text-xs italic">G</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">GCash Wallet</p>
                  <p className="text-[10px] text-slate-500 font-medium">Balance: ₱5,240.00</p>
                </div>
              </div>
              <CheckCircle2 className="text-teal-500" size={20} />
            </div>
            <div className="p-4 border border-slate-200 rounded-2xl flex items-center gap-3 opacity-50 grayscale">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Banknote className="text-slate-400" size={20} />
              </div>
              <p className="text-sm font-bold text-slate-400">Credit / Debit Card</p>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button 
              onClick={confirmPayment}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-teal-900/20 transition-all active:scale-95"
            >
              Confirm & Pay Now
            </button>
            <button 
              onClick={() => setIsPayModalOpen(false)}
              className="w-full text-slate-400 py-2 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancel Transaction
            </button>
          </div>
        </div>
      </Modal>

    </main>
  );
}
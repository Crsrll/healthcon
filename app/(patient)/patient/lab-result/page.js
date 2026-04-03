"use client";
import Link from "next/link";
import { Clipboard, ChevronRight, Plus } from "lucide-react";

export default function LabResultsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12 font-sans">
      
      {/* ── HEADER (Consistent with your other pages) ── */}
      <div className="bg-[#1a365d] text-white pt-10 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <Link href="/patient/dashboard" className="hover:text-white transition-colors">
              Patient
            </Link>
            <ChevronRight size={10} />
            <span className="text-white/60">Lab Results</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Laboratory Results</h1>
              <p className="text-teal-300 text-sm mt-1">View and download your medical test reports.</p>
            </div>
            {/* Optional: Keep the button for UI consistency */}
            <button className="bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-900/40 active:scale-95">
              <Plus size={18} strokeWidth={3} /> Request Test
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT (The Empty State) ── */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="bg-white py-24 rounded-3xl border-2 border-dashed border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clipboard className="text-slate-300" size={32} />
          </div>
          <h3 className="text-slate-800 font-bold text-lg">No lab results found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
            Your laboratory reports will appear here once they are released by the clinic.
          </p>
          
          <div className="mt-8">
            <Link href="/patient/dashboard">
              <button className="text-teal-600 font-bold text-xs uppercase tracking-widest hover:underline">
                Return to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

    </main>
  );
}
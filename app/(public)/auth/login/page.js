"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MockLoginPage() {
  const router = useRouter();

  const handleQuickLogin = () => {
    // This simulates the login and pushes the user to the patient route
    // Your Navbar will automatically switch because the URL starts with /patient
    router.push("/patient/dashboard");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#1a365d] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <img src="/logo.png" alt="Healthcon" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Health<span className="text-teal-600">con</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-semibold">
            Prototype Login
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Click the button below to enter the platform as 
            <span className="font-bold text-slate-800"> Melissa (Patient)</span>.
          </p>

          {/* THE ONE CLICK BUTTON */}
          <button
            onClick={handleQuickLogin}
            className="w-full bg-[#1a365d] hover:bg-[#254a7c] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span>Enter Dashboard</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <div className="pt-4">
            <Link 
              href="/" 
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium underline underline-offset-4"
            >
              Back to Landing Page
            </Link>
          </div>
        </div>

        {/* Mock Info Footer */}
        <div className="mt-10 pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 italic">
            Note: This is a front-end mock-up. No actual database credentials are required.
          </p>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputStyle = {
    paddingLeft: '40px',
    paddingRight: '20px',
    paddingTop: '14px',
    paddingBottom: '14px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    background: 'transparent',
    border: 'none',
    color: '#374151'
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-row w-full h-full bg-white font-sans overflow-hidden">
      
      {/* ── LEFT PANEL ── */}
      <div className="relative hidden lg:flex lg:w-[45%] bg-[#0f2035] flex-col justify-center overflow-hidden"
        style={{ paddingLeft: 80, paddingRight: 80 }}>
        
        {/* Background Glows */}
        <div className="absolute w-[800px] h-[800px] rounded-full bg-blue-600/10 -top-[200px] -left-[200px] blur-[120px]" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-400/10 -bottom-[100px] -right-[100px] blur-[100px]" />
        
        <div className="relative z-10">
          <p className="text-blue-400 font-bold text-xs uppercase tracking-[6px] mb-3">HealthCon Platform</p>
          <h2 className="text-white font-black text-5xl uppercase leading-none tracking-tighter mb-4">
            WELCOME
          </h2>
          <div className="w-16 h-1 bg-blue-500 mb-6"></div>
          <p className="text-white/40 text-base leading-relaxed max-w-sm font-medium">
            Join thousands of patients using the smart clinic queue platform to connect with licensed doctors instantly.
          </p>
        </div>

        {/* Logo bottom left */}
        <div className="absolute bottom-12 z-10 flex items-center gap-3" style={{ left: 80 }}>
          <img src="/logo.png" alt="HealthCon" style={{ height: 36, objectFit: "contain" }} /> 
             <span>Health<span className="text-healthcon-teal">con</span></span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-[520px]">
          
          <header className="mb-10 text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Sign up</h1>
            <p className="text-gray-400 text-base font-medium">Create your patient account to get started</p>
          </header>

          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* First Name */}
            <div className="bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
              <input type="text" placeholder="First Name" style={inputStyle} />
            </div>

            {/* M.I. & Last Name */}
            <div className="flex flex-row gap-5">
              <div className="w-28 bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
                <input type="text" placeholder="M.I." maxLength={2} style={{...inputStyle, paddingLeft: '0', textAlign: 'center'}} />
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
                <input type="text" placeholder="Last Name" style={inputStyle} />
              </div>
            </div>

            {/* Phone Number */}
            <div className="bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
              <input type="tel" placeholder="Phone Number" style={inputStyle} />
            </div>

            {/* Email */}
            <div className="bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
              <input type="email" placeholder="Email Address" style={inputStyle} />
            </div>

            {/* Password */}
            <div className="relative bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
              <input type={showPass ? 'text' : 'password'} placeholder="Password" style={{...inputStyle, paddingRight: '80px'}} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
              <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm Password" style={{...inputStyle, paddingRight: '80px'}} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-4 py-2 px-2">
              <input type="checkbox" id="terms" className="w-6 h-6 rounded-md accent-blue-600 cursor-pointer" />
              <label htmlFor="terms" className="text-sm text-gray-500 font-medium cursor-pointer select-none">
                I agree to the <span className="text-blue-600 font-bold hover:underline">Terms of Service</span>
              </label>
            </div>

            {/* Submit */}
            <button className="w-full mt-4 rounded-2xl bg-[#0f2035] text-white font-black text-lg shadow-xl shadow-blue-900/20 hover:bg-blue-600 active:scale-[0.98] transition-all duration-300" style={{ paddingTop: 20, paddingBottom: 20 }}>
              Create Account
            </button>

            {/* Clinic Button */}
            <button
              onClick={() => router.push('/auth/register-clinic')}
              className="w-full rounded-2xl border-2 border-blue-600 text-blue-600 font-black text-base hover:bg-blue-600 hover:text-white active:scale-[0.98] transition-all duration-300"
              style={{ paddingTop: 16, paddingBottom: 16 }}
            >
              Are you a Clinic? Register here
            </button>
          </form>

          {/* Bottom Links */}
          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-base text-gray-400 font-medium">
              Already have an account? <button onClick={() => router.push('/auth/login')} className="text-blue-600 font-black ml-1">Sign in</button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
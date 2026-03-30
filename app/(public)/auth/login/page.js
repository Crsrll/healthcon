"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PatientLoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  return (
    <>
      <style>{`
        .login-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          color: #374151;
          font-family: inherit;
        }
        .login-input::placeholder { color: #9ca3af; }

        .input-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f3f4f6;
          border-radius: 16px;
          padding: 14px 18px;
          border: 2px solid transparent;
          transition: border-color 0.2s ease, background 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .input-row:focus-within {
          border-color: #3b82f6;
          background: #fff;
        }

        .show-btn {
          background: none;
          border: none;
          color: #2563eb;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
          padding: 0;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .show-btn:hover { color: #1d4ed8; }

        .login-btn {
          width: 100%;
          padding: 20px;
          border-radius: 16px;
          border: none;
          background: #0f2035;
          color: white;
          font-weight: 900;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(15,32,53,0.3);
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .login-btn:hover { background: #2f80d0; transform: translateY(-1px); }
        .login-btn:active { transform: scale(0.98); }

        .clinic-btn {
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          border: 2px solid #2563eb;
          background: transparent;
          color: #2563eb;
          font-weight: 900;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .clinic-btn:hover { background: #2563eb; color: #fff; transform: translateY(-1px); }
        .clinic-btn:active { transform: scale(0.98); }
      `}</style>

      <div className="fixed inset-0 z-[100] flex w-full h-full bg-white font-sans overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <div className="relative hidden lg:flex lg:w-[45%] bg-[#0f2035] flex-col justify-center overflow-hidden"
          style={{ paddingLeft: 80, paddingRight: 80 }}>

          {/* Background Glows */}
          <div className="absolute w-[800px] h-[800px] rounded-full bg-blue-600/10 -top-[200px] -left-[200px] blur-[120px]" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-400/10 -bottom-[100px] -right-[100px] blur-[100px]" />

          <div className="relative z-10">
            <p className="text-blue-400 font-bold text-xs uppercase tracking-[6px] mb-3">HealthCon Platform</p>
            <h2 className="text-white font-black text-5xl uppercase leading-none tracking-tighter mb-4">
              WELCOME<br />BACK
            </h2>
            <div className="w-16 h-1 bg-blue-500 mb-6" />
            <p className="text-white/40 text-base leading-relaxed max-w-sm font-medium">
              Sign in to your patient account and connect with licensed doctors instantly — no waiting rooms needed.
            </p>
          </div>

          {/* Logo */}
          <div className="absolute bottom-12 z-10 flex items-center gap-3" style={{ left: 80 }}>
            <img src="/logo.png" alt="HealthCon" style={{ height: 36, objectFit: "contain" }} /> 
             <span>Health<span className="text-healthcon-teal">con</span></span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto bg-white" style={{ padding: 48 }}>
          <div className="w-full" style={{ maxWidth: 460 }}>

            <header className="mb-10 text-left">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Sign in</h1>
              <p className="text-gray-400 text-base font-medium">Welcome back! Please enter your details.</p>
            </header>

            <div className="flex flex-col gap-4">

              {/* Email */}
              <div className="input-row">
                <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <input type="email" placeholder="Email Address" className="login-input" />
              </div>

              {/* Password */}
              <div className="input-row">
                <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" />
                </svg>
                <input type={showPass ? "text" : "password"} placeholder="Password" className="login-input" />
                <button className="show-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 accent-blue-600 cursor-pointer" />
                  <span className="text-gray-400 font-medium" style={{ fontSize: 13 }}>Remember me</span>
                </label>
                <button className="text-blue-600 font-bold hover:underline bg-transparent border-none cursor-pointer p-0" style={{ fontSize: 13 }}>
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button className="login-btn mt-2">Sign In</button>

              {/* Clinic Login */}
              <button className="clinic-btn" onClick={() => router.push('/auth/login-clinic')}>
                Are you a Clinic? Sign in here
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-gray-300 font-medium" style={{ fontSize: 12 }}>or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Social */}
              <button className="w-full flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl font-semibold text-slate-600 hover:bg-gray-100 transition-colors" style={{ padding: "13px 18px", fontSize: 14 }}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </button>

            </div>

            {/* Sign Up Link */}
            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-400 font-medium" style={{ fontSize: 14 }}>
                Don't have an account?{" "}
                <button onClick={() => router.push('/auth/register')} className="text-blue-600 font-black hover:underline bg-transparent border-none cursor-pointer p-0 ml-1" style={{ fontSize: 14 }}>
                  Sign up free
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
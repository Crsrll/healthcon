"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterClinicPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <style>{`
        .clinic-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          color: #374151;
          font-family: inherit;
        }
        .clinic-input::placeholder { color: #9ca3af; }

        .input-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f3f4f6;
          border-radius: 12px;
          padding: 14px 18px;
          border: 2px solid transparent;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .input-row:focus-within {
          border-color: #3b82f6;
          background: #fff;
        }

        .register-btn {
          width: 100%;
          padding: 20px;
          border-radius: 16px;
          border: none;
          background: #0f2035;
          color: white;
          font-weight: 900;
          font-size: 18px;
          letter-spacing: 0.5px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(15,32,53,0.3);
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .register-btn:hover { background: #2f80d0; transform: translateY(-1px); }
        .register-btn:active { transform: scale(0.98); }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          padding: 8px 14px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-bottom: 40px;
        }
        .back-btn:hover { background: rgba(255,255,255,0.2); }

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
      `}</style>

      <div className="fixed inset-0 flex font-sans overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <div className="relative hidden lg:flex w-[45%] flex-col justify-center overflow-hidden bg-[#0f2035]"
          style={{ paddingLeft: 64, paddingRight: 64 }}>

          {/* Background Glows */}
          <div className="absolute w-[800px] h-[800px] rounded-full bg-blue-600/10 -top-[200px] -left-[200px] blur-[120px]" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-400/10 -bottom-[100px] -right-[100px] blur-[100px]" />

          <div className="relative z-10">
            <button className="back-btn" onClick={() => router.push('/auth/register')}>
              ← Back to Patient Sign Up
            </button>

            <h2 className="text-white font-black uppercase leading-none tracking-tighter m-0" style={{ fontSize: 48 }}>
              CLINIC<br />SIGN UP
            </h2>
            <p className="font-bold uppercase mt-2 mb-4" style={{ color: "#60a5fa", fontSize: 11, letterSpacing: "6px" }}>
              HealthCon Platform
            </p>
            <p className="leading-relaxed m-0" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, maxWidth: 260, lineHeight: 1.7 }}>
              Register your clinic on HealthCon. Manage your patient queue, reduce wait times, and grow your practice digitally.
            </p>
          </div>

          {/* Bottom Logo */}
          <div className="absolute bottom-12 z-10 flex items-center gap-3" style={{ left: 64 }}>
            <img src="/logo.png" alt="HealthCon" style={{ height: 36, objectFit: "contain" }} /> 
             <span>Health<span className="text-healthcon-teal">con</span></span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 bg-white flex items-center justify-center overflow-y-auto" style={{ padding: 48 }}>
          <div className="w-full" style={{ maxWidth: 420 }}>

            <h1 className="font-bold text-slate-900 m-0 mb-1" style={{ fontSize: 28 }}>Register your Clinic</h1>
            <p className="text-gray-400 mt-0 mb-7" style={{ fontSize: 13 }}>Fill in your clinic details to get started</p>

            <div className="flex flex-col gap-3">

              {/* Clinic Name */}
              <div className="input-row">
                <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 10H8v-1c0-2 4-3.1 4-3.1s4 1.1 4 3.1v1z" />
                </svg>
                <input type="text" placeholder="Clinic Name" className="clinic-input" />
              </div>

              {/* Phone */}
              <div className="input-row">
                <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                </svg>
                <input type="tel" placeholder="Phone Number" className="clinic-input" />
              </div>

              {/* Email */}
              <div className="input-row">
                <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <input type="email" placeholder="Email Address" className="clinic-input" />
              </div>

              {/* DOH LTO */}
              <div>
                <div className="input-row">
                  <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path d="M20 6h-2.18c.07-.31.18-.62.18-.95C18 3.37 16.63 2 14.95 2c-.96 0-1.86.48-2.48 1.24L12 3.89l-.47-.65C10.9 2.48 10 2 9.05 2 7.37 2 6 3.37 6 5.05c0 .33.11.64.18.95H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5.05-2c.55 0 1.05.45 1.05 1.05 0 .64-.5 1.07-1.05 1.07S13.9 5.69 13.9 5.05C13.9 4.45 14.4 4 14.95 4zM9.05 4c.55 0 1.05.45 1.05 1.05 0 .64-.5 1.07-1.05 1.07S8 5.69 8 5.05C8 4.45 8.5 4 9.05 4zM20 19H4V8h16v11z" />
                  </svg>
                  <input type="text" placeholder="DOH License to Operate (LTO) Number" className="clinic-input" />
                </div>
                <p className="text-gray-400 ml-1 mt-1 mb-0" style={{ fontSize: 11, lineHeight: 1.5 }}>
                  Your LTO number is issued by the Philippine DOH. It verifies your clinic is legally authorized to operate.
                </p>
              </div>

              {/* Password */}
              <div className="input-row">
                <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" />
                </svg>
                <input type={showPass ? "text" : "password"} placeholder="Password" className="clinic-input" />
                <button className="show-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="input-row">
                <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" />
                </svg>
                <input type={showConfirm ? "text" : "password"} placeholder="Confirm Password" className="clinic-input" />
                <button className="show-btn" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 py-1">
                <input type="checkbox" id="clinic-terms" className="w-4 h-4 mt-0.5 cursor-pointer accent-blue-600 flex-shrink-0" />
                <label htmlFor="clinic-terms" className="text-gray-400 cursor-pointer select-none" style={{ fontSize: 12, lineHeight: 1.6 }}>
                  I agree to the{" "}
                  <span className="text-blue-600 font-bold hover:underline cursor-pointer">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-blue-600 font-bold hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              {/* Register Button */}
              <button className="register-btn mt-2">
                Register Clinic
              </button>

              {/* Sign In */}
              <p className="text-center text-gray-400 m-0" style={{ fontSize: 12 }}>
                Already have an account?{" "}
                <button onClick={() => router.push('/auth/login')} className="text-blue-600 font-black hover:underline bg-transparent border-none cursor-pointer p-0 ml-1" style={{ fontSize: 12 }}>
                  Sign in
                </button>
              </p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
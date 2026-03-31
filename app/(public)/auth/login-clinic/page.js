"use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function ClinicLoginPage() {
//   const router = useRouter();
//   const [showPass, setShowPass] = useState(false);

//   return (
//     <>
//       <style>{`
//         .clinic-login-input {
//           flex: 1;
//           background: transparent;
//           border: none;
//           outline: none;
//           font-size: 14px;
//           color: #374151;
//           font-family: inherit;
//         }
//         .clinic-login-input::placeholder { color: #9ca3af; }

//         .input-row {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           background: #f3f4f6;
//           border-radius: 16px;
//           padding: 14px 18px;
//           border: 2px solid transparent;
//           transition: border-color 0.2s ease, background 0.2s ease;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.04);
//         }
//         .input-row:focus-within {
//           border-color: #3b82f6;
//           background: #fff;
//         }

//         .show-btn {
//           background: none;
//           border: none;
//           color: #2563eb;
//           font-size: 10px;
//           font-weight: 900;
//           cursor: pointer;
//           padding: 0;
//           text-transform: uppercase;
//           letter-spacing: 0.1em;
//         }
//         .show-btn:hover { color: #1d4ed8; }

//         .login-btn {
//           width: 100%;
//           padding: 20px;
//           border-radius: 16px;
//           border: none;
//           background: #0f2035;
//           color: white;
//           font-weight: 900;
//           font-size: 18px;
//           cursor: pointer;
//           box-shadow: 0 4px 14px rgba(15,32,53,0.3);
//           transition: background 0.3s ease, transform 0.2s ease;
//         }
//         .login-btn:hover { background: #2f80d0; transform: translateY(-1px); }
//         .login-btn:active { transform: scale(0.98); }

//         .patient-btn {
//           width: 100%;
//           padding: 16px;
//           border-radius: 16px;
//           border: 2px solid #2563eb;
//           background: transparent;
//           color: #2563eb;
//           font-weight: 900;
//           font-size: 15px;
//           cursor: pointer;
//           transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
//         }
//         .patient-btn:hover { background: #2563eb; color: #fff; transform: translateY(-1px); }
//         .patient-btn:active { transform: scale(0.98); }

//         .back-btn {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           background: rgba(255,255,255,0.1);
//           border: 1px solid rgba(255,255,255,0.2);
//           border-radius: 8px;
//           padding: 8px 14px;
//           color: white;
//           font-size: 12px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: background 0.2s ease;
//           margin-bottom: 40px;
//         }
//         .back-btn:hover { background: rgba(255,255,255,0.2); }
//       `}</style>

//       <div className="fixed inset-0 z-[100] flex w-full h-full bg-white font-sans overflow-hidden">

//         {/* ── LEFT PANEL ── */}
//         <div className="relative hidden lg:flex lg:w-[45%] bg-[#0f2035] flex-col justify-center overflow-hidden"
//           style={{ paddingLeft: 80, paddingRight: 80 }}>

//           {/* Background Glows */}
//           <div className="absolute w-[800px] h-[800px] rounded-full bg-blue-600/10 -top-[200px] -left-[200px] blur-[120px]" />
//           <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-400/10 -bottom-[100px] -right-[100px] blur-[100px]" />

//           <div className="relative z-10">
//             {/* Back Button */}
//             <button className="back-btn" onClick={() => router.push('/auth/login')}>
//               ← Back to Patient Sign In
//             </button>


//             <p className="text-blue-400 font-bold text-xs uppercase tracking-[6px] mb-3">HealthCon Platform</p>
//             <h2 className="text-white font-black text-5xl uppercase leading-none tracking-tighter mb-4">
//               CLINIC<br />SIGN IN
//             </h2>
//             <div className="w-16 h-1 bg-blue-500 mb-6" />
//             <p className="text-white/40 text-base leading-relaxed max-w-sm font-medium">
//               Sign in to your clinic dashboard. Manage your queue, track appointments, and serve patients efficiently.
//             </p>
//           </div>

//           {/* Logo */}
//           <div className="absolute bottom-12 z-10 flex items-center gap-3" style={{ left: 80 }}>
//             <img src="/logo.png" alt="HealthCon" style={{ height: 36, objectFit: "contain" }} /> 
//              <span>Health<span className="text-healthcon-teal">con</span></span>
//           </div>
//         </div>

//         {/* ── RIGHT PANEL ── */}
//         <div className="flex-1 flex items-center justify-center overflow-y-auto bg-white" style={{ padding: 48 }}>
//           <div className="w-full" style={{ maxWidth: 460 }}>

//             <header className="mb-10 text-left">
//               <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Clinic Sign In</h1>
//               <p className="text-gray-400 text-base font-medium">Access your clinic dashboard below.</p>
//             </header>

//             <div className="flex flex-col gap-4">

//               {/* Email */}
//               <div className="input-row">
//                 <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
//                   <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
//                 </svg>
//                 <input type="email" placeholder="Clinic Email Address" className="clinic-login-input" />
//               </div>

//               {/* Password */}
//               <div className="input-row">
//                 <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
//                   <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" />
//                 </svg>
//                 <input type={showPass ? "text" : "password"} placeholder="Password" className="clinic-login-input" />
//                 <button className="show-btn" onClick={() => setShowPass(!showPass)}>
//                   {showPass ? "Hide" : "Show"}
//                 </button>
//               </div>

//               {/* Remember & Forgot */}
//               <div className="flex items-center justify-between px-1">
//                 <label className="flex items-center gap-2 cursor-pointer select-none">
//                   <input type="checkbox" className="w-4 h-4 accent-blue-600 cursor-pointer" />
//                   <span className="text-gray-400 font-medium" style={{ fontSize: 13 }}>Remember me</span>
//                 </label>
//                 <button className="text-blue-600 font-bold hover:underline bg-transparent border-none cursor-pointer p-0" style={{ fontSize: 13 }}>
//                   Forgot password?
//                 </button>
//               </div>

//               {/* Sign In Button */}
//               <button className="login-btn mt-2" onClick={() => router.push("/clinic/dashboard")}>Sign In Clinic</button>

//               {/* Patient Login */}
//               <button className="patient-btn" onClick={() => router.push('/auth/login')}>
//                 Are you a Patient? Sign in here
//               </button>

//             </div>

//             {/* Register + Sign Up Links */}
//             <div className="mt-8 pt-8 border-t border-gray-100 text-center flex flex-col gap-3">
//               <p className="text-gray-400 font-medium m-0" style={{ fontSize: 14 }}>
//                 Don't have a clinic account?{" "}
//                 <button onClick={() => router.push('/auth/register-clinic')} className="text-blue-600 font-black hover:underline bg-transparent border-none cursor-pointer p-0 ml-1" style={{ fontSize: 14 }}>
//                   Register your clinic
//                 </button>
//               </p>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClinicLoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="fixed inset-0 z-100 flex w-full h-full bg-white font-sans overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="relative hidden lg:flex lg:w-[45%] bg-[#0f2035] flex-col justify-center overflow-hidden px-20">

        {/* Background Glows */}
        <div className="absolute w-200 h-200 rounded-full bg-blue-600/10 -top-50 -left-50 blur-[120px]" />
        <div className="absolute w-125 h-125 rounded-full bg-blue-400/10 -bottom-25 -right-25 blur-[100px]" />

        <div className="relative z-10">

          {/* Back Button */}
          <button
            onClick={() => router.push('/auth/login')}
            className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-xs font-semibold hover:bg-white/20 mb-10"
          >
            ← Back to Patient Sign In
          </button>

          <p className="text-blue-400 font-bold text-xs uppercase tracking-[6px] mb-3">
            HealthCon Platform
          </p>

          <h2 className="text-white font-black text-5xl uppercase leading-none tracking-tighter mb-4">
            CLINIC<br />SIGN IN
          </h2>

          <div className="w-16 h-1 bg-blue-500 mb-6" />

          <p className="text-white/40 text-base leading-relaxed max-w-sm font-medium">
            Sign in to your clinic dashboard. Manage your queue, track appointments, and serve patients efficiently.
          </p>
        </div>

        {/* Logo */}
        <div className="absolute bottom-12 left-20 z-10 flex items-center gap-3">
          <img src="/logo.png" alt="HealthCon" className="h-9 object-contain" />
          <span className="text-white font-bold">
            Health<span className="text-cyan-300">con</span>
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto bg-white p-12">

        <div className="w-full max-w-115">

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Clinic Sign In
            </h1>
            <p className="text-gray-400 text-base font-medium">
              Access your clinic dashboard below.
            </p>
          </header>

          <div className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-5 py-4 border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white shadow-sm">
              <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <input
                type="email"
                placeholder="Clinic Email Address"
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-5 py-4 border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white shadow-sm">
              <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" />
              </svg>

              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              />

              <button
                onClick={() => setShowPass(!showPass)}
                className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:text-blue-700"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                <span className="text-gray-400 text-sm font-medium">
                  Remember me
                </span>
              </label>

              <button className="text-blue-600 text-sm font-bold hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={() => router.push("/clinic/dashboard")}
              className="w-full py-5 rounded-2xl bg-[#0f2035] text-white font-black text-lg shadow-[0_4px_14px_rgba(15,32,53,0.3)]
                         transition-all duration-200 hover:bg-[#2f80d0] hover:-translate-y-px active:scale-[0.98]"
            >
              Sign In Clinic
            </button>

            {/* Patient Button */}
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full py-4 rounded-2xl border-2 border-blue-600 text-blue-600 font-black text-sm
                         transition-all duration-200 hover:bg-blue-600 hover:text-white hover:-translate-y-px active:scale-[0.98]"
            >
              Are you a Patient? Sign in here
            </button>

          </div>

          {/* Register */}
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Don't have a clinic account?
              <button
                onClick={() => router.push('/auth/register-clinic')}
                className="ml-1 text-blue-600 font-black hover:underline"
              >
                Register your clinic
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
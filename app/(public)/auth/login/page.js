"use client";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function MockLoginPage() {
//   const router = useRouter();

//   const handleQuickLogin = () => {
//     // This simulates the login and pushes the user to the patient route
//     // Your Navbar will automatically switch because the URL starts with /patient
//     router.push("/patient/dashboard");
//   };

//   return (
//     <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
//       <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center">
        
//         {/* Logo Section */}
//         <div className="flex flex-col items-center mb-8">
//           <div className="w-16 h-16 bg-healthcon-blue rounded-2xl flex items-center justify-center mb-4 shadow-lg">
//             <img src="/logo.png" alt="Healthcon" className="w-10 h-10" />
//           </div>
//           <h1 className="text-2xl font-bold text-slate-800">
//             Health<span className="text-teal-600">con</span>
//           </h1>
//           <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-semibold">
//             Prototype Login
//           </p>
//         </div>

//         <div className="space-y-4">
//           <p className="text-slate-600 text-sm leading-relaxed mb-6">
//             Click the button below to enter the platform as 
//             <span className="font-bold text-slate-800"> Melissa (Patient)</span>.
//           </p>

//           {/* THE ONE CLICK BUTTON */}
//           <button
//             onClick={handleQuickLogin}
//             className="w-full bg-healthcon-blue hover:bg-[#254a7c] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
//           >
//             <span>Enter Dashboard</span>
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
//             </svg>
//           </button>

//           <div className="pt-4">
//             <Link 
//               href="/" 
//               className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium underline underline-offset-4"
//             >
//               Back to Landing Page
//             </Link>
//           </div>
//         </div>

//         {/* Mock Info Footer */}
//         <div className="mt-10 pt-6 border-t border-slate-100">
//           <p className="text-[10px] text-slate-400 italic">
//             Note: This is a front-end mock-up. No actual database credentials are required.
//           </p>
//         </div>
//       </div>
//     </main>
//   );
// }

import { useState } from "react";
import { useAuth } from "@/context/authContext";
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login({ username, password });

    if (success) {
      if (user.role === "patient") {
        router.push("../../patient/dashboard");
      }

      else if (user.role === "clinic"){
        router.push("../../clinic/dashboard");
      }

      else if (user.role === "admin"){
        router.push("../../admin/dashboard");}}

      // else{
      //   setError("Unknown user role");
      // }}

    else{
      setError("Invalid username or password");
      }
  }

  return(
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 font-sans">

      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-4 p-2 border border-slate-300 rounded" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4 p-2 border border-slate-300 rounded" />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Login
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}



    </form>
  )
}
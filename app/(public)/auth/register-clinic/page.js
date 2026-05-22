"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegisterClinic } from "@/hooks/useRegisterClinic";
import { Shield, Clock, X } from "lucide-react";

export default function RegisterClinicPage() {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    clinicName: "",
    phone: "",
    email: "",
    ltoNumber: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const { registerClinic, loading, error } = useRegisterClinic();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async () => {
    if (!form.clinicName || !form.phone || !form.email || !form.ltoNumber || !form.password || !form.confirmPassword) return;
    if (form.password !== form.confirmPassword) return;
    if (!form.terms) return;

    const result = await registerClinic(form);
    if (result.success) {
      setShowSuccessModal(true);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push("/auth/login");
  };

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
    <div className="flex w-full min-h-screen bg-white font-sans overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div
        className="relative hidden lg:flex lg:w-[45%] bg-[#0f2035] flex-col justify-center overflow-hidden"
        style={{ paddingLeft: 80, paddingRight: 80 }}
      >
        <div className="absolute w-200 h-200 rounded-full bg-blue-600/10 -top-50 -left-50 blur-[120px]" />
        <div className="absolute w-125 h-125 rounded-full bg-blue-400/10 -bottom-25 -right-25 blur-[100px]" />

        <div className="relative z-10">
          <p className="text-blue-400 font-bold text-xs uppercase tracking-[6px] mb-3">HealthCon Platform</p>
          <h2 className="text-white font-black text-5xl uppercase leading-none tracking-tighter mb-4">
            JOIN AS<br />A CLINIC
          </h2>
          <div className="w-16 h-1 bg-blue-500 mb-6"></div>
          <p className="text-white/40 text-base leading-relaxed max-w-sm font-medium">
            Register your clinic and start managing appointments, doctors, and patients with HealthCon's smart queue platform.
          </p>
        </div>

        <div className="absolute bottom-12 z-10 flex items-center gap-3" style={{ left: 80 }}>
          <img src="/logo.png" alt="HealthCon" style={{ height: 36, objectFit: "contain" }} />
          <span className="text-white font-bold">Health<span className="text-cyan-300">con</span></span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-130">

          <header className="mb-10 text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Register Clinic</h1>
            <p className="text-gray-400 text-base font-medium">Fill in your clinic details to get started</p>
          </header>

          {/* Error Message */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">

            {/* Clinic Name */}
            <div className="bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
              <input
                name="clinicName"
                type="text"
                placeholder="Clinic Name"
                value={form.clinicName}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Phone & LTO Number */}
            <div className="flex flex-row gap-5">
              <div className="flex-1 bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
                <input
                  name="ltoNumber"
                  type="text"
                  placeholder="DOH LTO Number"
                  value={form.ltoNumber}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Email */}
            <div className="bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                autoComplete="off"
              />
            </div>

            {/* Password */}
            <div className="relative bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={{ ...inputStyle, paddingRight: '80px' }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-600 text-[10px] font-black uppercase tracking-widest"
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
              <input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                style={{ ...inputStyle, paddingRight: '80px' }}
                autoComplete="new-password"
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-600 text-[10px] font-black uppercase tracking-widest"
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-4 py-2 px-2">
              <input
                name="terms"
                type="checkbox"
                id="terms"
                checked={form.terms}
                onChange={handleChange}
                className="w-6 h-6 rounded-md accent-blue-600 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-500 font-medium cursor-pointer select-none">
                I agree to the <span className="text-blue-600 font-bold hover:underline">Terms of Service</span>
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="cursor-pointer w-full mt-4 rounded-2xl bg-[#0f2035] text-white font-black text-lg shadow-xl shadow-blue-900/20 hover:bg-blue-600 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ paddingTop: 20, paddingBottom: 20 }}
            >
              {loading ? "Registering..." : "Register Clinic"}
            </button>

            {/* Patient Button */}
            <button
              onClick={() => router.push('/auth/register')}
              className="cursor-pointer w-full rounded-2xl border-2 border-blue-600 text-blue-600 font-black text-base hover:bg-blue-600 hover:text-white active:scale-[0.98] transition-all duration-300"
              style={{ paddingTop: 16, paddingBottom: 16 }}
            >
              Are you a Patient? Register here
            </button>

          </div>

          {/* Bottom Links */}
          <div className="mt-10 pt-3 border-t border-gray-100 text-center">
            <p className="text-base text-gray-400 font-medium">
              Already have an account?{" "}
              <button
                onClick={() => router.push('/auth/login')}
                className="cursor-pointer text-blue-600 font-black ml-1"
              >
                Sign in
              </button>
            </p>
          </div>

        </div>
      </div>

      {/* Success Modal - Admin Verification */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden">
            <div className="relative">
              <button
                onClick={handleModalClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Shield size={40} className="text-amber-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Registration Submitted
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Thank you for registering <strong className="text-blue-600">{form.clinicName}</strong>
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-amber-800 text-sm font-medium mb-1">
                        Pending Admin Verification
                      </p>
                      <p className="text-amber-700 text-xs leading-relaxed">
                        Your clinic registration requires approval from our administrative team. 
                        This process typically takes <strong>2-5 business days</strong>. You'll receive an email 
                        notification once your account is verified.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                  <p className="text-blue-800 text-xs leading-relaxed">
                    <strong className="font-bold">📋 What happens next?</strong><br />
                    1. Admin reviews your DOH LTO Number and clinic credentials<br />
                    2. You'll receive a verification email upon approval<br />
                    3. Once verified, you can log in and start managing your clinic
                  </p>
                </div>
                
                <button
                  onClick={handleModalClose}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all"
                >
                  Return to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, logout, resetPassword, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot password state
  const [view, setView] = useState("login"); // "login" | "forgot" | "forgot-sent"
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    const result = await login(email, password, rememberMe);
    if (!result.success) return;

    const roleRoutes = {
      admin: "/admin/dashboard",
      clinic: "/clinic/dashboard",
      patient: "/patient/dashboard",
    };

    const route = roleRoutes[result.user?.role];
    if (route) {
      router.push(route);
      router.refresh();
    } else {
      console.error("Unknown role:", result.user?.role);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) return;
    setResetLoading(true);
    setResetError("");

    const result = await resetPassword(resetEmail); // ← use this
    if (result.success) {
      setView("forgot-sent");
    } else {
      setResetError(result.error || "Something went wrong.");
    }
    setResetLoading(false);
  };

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
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .back-btn {
          background: none;
          border: none;
          color: #6b7280;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 24px;
          transition: color 0.2s;
        }
        .back-btn:hover { color: #374151; }

        .sent-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="flex w-full min-h-screen bg-white font-sans overflow-hidden">
        {/* LEFT PANEL */}
        <div
          className="relative hidden lg:flex lg:w-[45%] bg-[#0f2035] flex-col justify-center overflow-hidden"
          style={{ paddingLeft: 80, paddingRight: 80 }}
        >
          <div className="absolute w-200 h-200 rounded-full bg-blue-600/10 -top-50 -left-50 blur-[120px]" />
          <div className="absolute w-125 h-125 rounded-full bg-blue-400/10 -bottom-25 -right-25 blur-[100px]" />

          <div className="relative z-10">
            <p className="text-blue-400 font-bold text-xs uppercase tracking-[6px] mb-3">
              HealthCon Platform
            </p>
            <h2 className="text-white font-black text-5xl uppercase leading-none tracking-tighter mb-4">
              WELCOME
              <br />
              BACK
            </h2>
            <div className="w-16 h-1 bg-blue-500 mb-6" />
            <p className="text-white/40 text-base leading-relaxed max-w-sm font-medium">
              Sign in to your account and continue your healthcare experience.
            </p>
          </div>

          <div
            className="absolute bottom-12 z-10 flex items-center gap-3"
            style={{ left: 80 }}
          >
            <img src="/logo.png" alt="HealthCon" style={{ height: 36 }} />
            <span className="text-white font-bold">
              Health<span className="text-cyan-300">con</span>
            </span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="flex-1 flex items-center justify-center overflow-y-auto bg-white"
          style={{ padding: 48 }}
        >
          <div className="w-full" style={{ maxWidth: 460 }}>
            {/* ── LOGIN VIEW ── */}
            {view === "login" && (
              <>
                <header className="mb-10 text-left">
                  <h1 className="text-3xl font-black text-slate-900 mb-2">
                    Sign in
                  </h1>
                  <p className="text-gray-400 text-base">
                    Welcome back! Please enter your details.
                  </p>
                </header>

                <div className="flex flex-col gap-4">
                  {error && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="input-row">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Email Address"
                      className="login-input"
                    />
                  </div>

                  <div className="input-row">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      type={showPass ? "text" : "password"}
                      placeholder="Password"
                      className="login-input"
                    />
                    <button
                      className="show-btn"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Remember Me + Forgot Password row */}
                  <div className="flex items-center justify-between">
                    <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-500">
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      Remember me
                    </label>
                    <button
                      onClick={() => {
                        setResetEmail(email);
                        setView("forgot");
                        setResetError("");
                      }}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer bg-transparent border-none"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    className="login-btn"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <button
                      onClick={() => router.push("/auth/register")}
                      className="cursor-pointer text-blue-600 font-bold bg-transparent border-none"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </>
            )}

            {/* ── FORGOT PASSWORD VIEW ── */}
            {view === "forgot" && (
              <>
                <button className="back-btn" onClick={() => setView("login")}>
                  ← Back to Sign In
                </button>

                <header className="mb-10 text-left">
                  <h1 className="text-3xl font-black text-slate-900 mb-2">
                    Reset password
                  </h1>
                  <p className="text-gray-400 text-base">
                    Enter your email and we'll send you a link to reset your
                    password.
                  </p>
                </header>

                <div className="flex flex-col gap-4">
                  {resetError && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      {resetError}
                    </div>
                  )}

                  <div className="input-row">
                    <input
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleForgotPassword()
                      }
                      type="email"
                      placeholder="Email Address"
                      className="login-input"
                      autoFocus
                    />
                  </div>

                  <button
                    className="login-btn"
                    onClick={handleForgotPassword}
                    disabled={resetLoading || !resetEmail}
                  >
                    {resetLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </>
            )}

            {/* ── FORGOT PASSWORD SENT VIEW ── */}
            {view === "forgot-sent" && (
              <>
                <div className="sent-icon">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>

                <header className="mb-6 text-left">
                  <h1 className="text-3xl font-black text-slate-900 mb-2">
                    Check your email
                  </h1>
                  <p className="text-gray-400 text-base">
                    We sent a password reset link to{" "}
                    <span className="font-semibold text-slate-700">
                      {resetEmail}
                    </span>
                    . Check your inbox and follow the instructions.
                  </p>
                </header>

                <div className="flex flex-col gap-3">
                  <button
                    className="login-btn"
                    onClick={() => setView("login")}
                  >
                    Back to Sign In
                  </button>
                  <button
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="w-full py-3 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer disabled:opacity-50"
                  >
                    {resetLoading
                      ? "Resending..."
                      : "Didn't get it? Resend email"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

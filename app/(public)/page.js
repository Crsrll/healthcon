"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const styles = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-text { animation: fadeSlideUp 0.7s ease both; }
  .hero-text-1 { animation-delay: 0.1s; }
  .hero-text-2 { animation-delay: 0.25s; }
  .hero-text-3 { animation-delay: 0.4s; }
  .hero-text-4 { animation-delay: 0.55s; }

  .btn-primary {
    background-color: #2f80d0; color: #fff; border: none;
    padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    box-shadow: 0 4px 14px rgba(47,128,208,0.35);
  }
  .btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 28px rgba(47,128,208,0.5); background-color: #1a6dbf; }

  .btn-secondary {
    background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.25);
    padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
  }
  .btn-secondary:hover { transform: translateY(-3px); background-color: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.5); }

  .btn-cta {
    background-color: #2f80d0; color: #fff; border: none;
    padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 17px; cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    box-shadow: 0 8px 24px rgba(47,128,208,0.35);
  }
  .btn-cta:hover { transform: translateY(-4px) scale(1.04); box-shadow: 0 16px 36px rgba(47,128,208,0.5); background-color: #1a6dbf; }

  .nav-link {
    color: #fff; text-decoration: none; font-size: 12px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em; position: relative;
    padding-bottom: 3px; transition: color 0.2s ease; cursor: pointer;
  }
  .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: #5bbfff; transition: width 0.25s ease; }
  .nav-link:hover { color: #93c5fd; }
  .nav-link:hover::after { width: 100%; }

  .feature-card {
    border: 1px solid #f1f5f9; border-radius: 16px; background: #f8fafc; padding: 28px;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease; cursor: default;
  }
  .feature-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(18,40,68,0.12); border-color: #bfdbfe; background: #fff; }

  .step-card { display: flex; flex-direction: column; gap: 12px; padding: 24px; border-radius: 16px; transition: background 0.25s ease, transform 0.25s ease; cursor: default; }
  .step-card:hover { background: rgba(255,255,255,0.06); transform: translateY(-4px); }

  .stat-item { transition: transform 0.2s ease; }
  .stat-item:hover { transform: scale(1.08); }
`;

const container = { maxWidth: 1280, margin: "0 auto", paddingLeft: 48, paddingRight: 48 };

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAboutClick = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLearnMoreClick = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden" style={{ boxSizing: "border-box" }}>
      <style>{styles}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: "#122844",
        padding: scrolled ? "12px 0" : "18px 0",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={container} className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-bold cursor-pointer" style={{ fontSize: 20 }} onClick={() => router.push("/")}>
            <span style={{ color: "#60a5fa" }}>✚</span> HealthCon
          </div>
          <div className="flex items-center gap-8">
            <span className="nav-link" onClick={handleAboutClick}>About</span>
            <span className="nav-link" onClick={() => router.push("/auth/register")}>Sign Up</span>
            <button className="btn-primary" style={{ padding: "9px 22px", fontSize: 14 }} onClick={() => router.push("/auth/login")}>
              Log In
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[#122844] text-white" style={{ paddingTop: 130, paddingBottom: 90 }}>
        <div style={container} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-6">
            <div className="hero-text hero-text-1 inline-block bg-white/10 px-3 py-1 rounded-full font-bold text-blue-300 uppercase tracking-widest w-fit" style={{ fontSize: 11 }}>
              Now available 24/7
            </div>
            <h1 className="hero-text hero-text-2 font-bold leading-tight m-0" style={{ fontSize: 52 }}>
              Connect with Doctors<br />
              <span style={{ color: "#5bbfff" }}>ANYWHERE,</span><br />
              ANYTIME.
            </h1>
            <p className="hero-text hero-text-3 text-blue-100/70 leading-relaxed m-0" style={{ fontSize: 17, maxWidth: 440 }}>
              HealthCon is your smart clinic queue platform — skip the waiting room and get real medical care from licensed doctors, wherever you are.
            </p>
            <div className="hero-text hero-text-4 flex gap-3 flex-wrap pt-1">
              <button className="btn-primary" onClick={() => router.push("/signup")}>Book Appointments Now ↗</button>
              <button className="btn-secondary" onClick={handleLearnMoreClick}>Learn more</button>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl italic text-white/20" style={{ height: 300, fontSize: 15 }}>
            Doctor consultation image placeholder
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-b border-slate-100" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div style={container} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "50K+", label: "Patients Served" },
            { value: "1,200+", label: "Licensed Doctors" },
            { value: "4.9★", label: "Average Rating" },
            { value: "< 5 min", label: "Avg. Wait Time" },
          ].map((stat) => (
            <div key={stat.label} className="stat-item">
              <div className="font-bold text-[#122844]" style={{ fontSize: 34 }}>{stat.value}</div>
              <div className="text-slate-400 font-bold uppercase tracking-wide mt-1" style={{ fontSize: 12 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY HEALTHCON ── */}
      <section id="about" className="bg-white" style={{ paddingTop: 88, paddingBottom: 88 }}>
        <div style={container} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <h5 className="font-bold text-blue-600 uppercase tracking-widest m-0" style={{ fontSize: 11 }}>Why HealthCon</h5>
            <h2 className="font-bold text-[#122844] leading-tight m-0" style={{ fontSize: 32 }}>Healthcare that works around your life</h2>
            <p className="text-slate-500 leading-relaxed m-0" style={{ fontSize: 15 }}>
              We've rebuilt the clinic experience from the ground up — faster, simpler, and built for real people.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: "🩺", title: "Virtual Consultations", desc: "Connect with licensed doctors via video, voice, or chat — no waiting rooms, no commute." },
              { icon: "📅", title: "Easy Scheduling", desc: "Book same-day or future appointments 24/7, fitting your schedule perfectly." },
              { icon: "🔒", title: "Secure & Private", desc: "End-to-end encrypted records keep your health data safe and fully under control." },
              { icon: "💊", title: "Digital Prescriptions", desc: "Receive e-prescriptions instantly, sent directly to your preferred pharmacy." },
            ].map((item) => (
              <div key={item.title} className="feature-card">
                <div style={{ fontSize: 24, marginBottom: 14 }}>{item.icon}</div>
                <h4 className="font-bold m-0 mb-2" style={{ fontSize: 17 }}>{item.title}</h4>
                <p className="text-slate-500 leading-relaxed m-0" style={{ fontSize: 13 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-[#122844] text-white" style={{ paddingTop: 88, paddingBottom: 88 }}>
        <div style={container}>
          <div style={{ marginBottom: 52 }}>
            <h5 className="font-bold text-blue-400 uppercase tracking-widest m-0 mb-2" style={{ fontSize: 11 }}>How It Works</h5>
            <h2 className="font-bold m-0 mb-2" style={{ fontSize: 34 }}>Three steps to your doctor</h2>
            <p className="text-blue-200/50 m-0" style={{ fontSize: 15 }}>Getting care has never been this simple.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Create Your Account", desc: "Sign up in under a minute. No paperwork, no insurance headaches — just your basic details." },
              { num: "02", title: "Choose a Doctor", desc: "Browse verified specialists by specialty, availability, and rating. Filter by language or concern." },
              { num: "03", title: "Get Seen Instantly", desc: "Join a secure video or chat session. Receive your diagnosis, notes, and prescription right away." },
            ].map((step) => (
              <div key={step.num} className="step-card">
                <div className="font-bold text-white/10" style={{ fontSize: 36 }}>{step.num}</div>
                <h3 className="font-bold m-0" style={{ fontSize: 20 }}>{step.title}</h3>
                <p className="text-blue-100/40 leading-relaxed m-0" style={{ fontSize: 14 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white text-center" style={{ paddingTop: 100, paddingBottom: 100, paddingLeft: 48, paddingRight: 48 }}>
        <div style={{ maxWidth: 660, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>
          <h5 className="font-bold text-blue-600 uppercase tracking-widest m-0" style={{ fontSize: 11 }}>Get Started Today</h5>
          <h2 className="font-bold text-[#122844] leading-tight m-0" style={{ fontSize: 46 }}>Your health can't wait.</h2>
          <p className="text-slate-400 leading-relaxed m-0" style={{ fontSize: 17 }}>
            Join thousands of patients who've already made the switch to smarter, faster healthcare with HealthCon.
          </p>
          <div className="pt-2">
            <button className="btn-cta" onClick={() => router.push("/signup")}>Book Appointments Now ↗</button>
          </div>
        </div>
      </section>

    </div>
  );
}
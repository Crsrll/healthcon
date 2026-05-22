"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, HeartPulse } from "lucide-react";

// ── Color tokens matching the site palette ──────────────────────
const C = {
  navy:   "#0f2540",
  navyMid:"#1a355d",
  blue:   "#1a365d",
  teal:   "#2dd4bf",
  bright: "#38bdf8",
  slate:  "#64748b",
};

// ── Counter animation ───────────────────────────────────────────
function Counter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(value / 40);
      const t = setInterval(() => {
        start = Math.min(start + step, value);
        setCount(start);
        if (start >= value) clearInterval(t);
      }, 28);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Member card ─────────────────────────────────────────────────
function MemberCard({ name, role, initials, image, responsibilities, index = 0 }) {
  const roleColors = ["#2dd4bf", "#38bdf8", "#818cf8"];
  const accentColor = roleColors[index % roleColors.length];

  return (
    <div
      className="member-card"
      style={{
        background: "#fff",
        borderRadius: 32, // Slightly more rounded for larger scale
        overflow: "hidden",
        border: "1px solid rgba(26,53,93,0.08)",
        boxShadow: "0 10px 40px rgba(15,37,64,0.08)",
        transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease",
        animationDelay: `${index * 0.12}s`,
        display: "flex",
        flexDirection: "column",
        minHeight: 520, // Forces the card to be longer
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "0 24px 60px rgba(15,37,64,0.18)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 40px rgba(15,37,64,0.08)";
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 6, background: `linear-gradient(90deg, ${accentColor}, ${C.bright})` }} />

      {/* Avatar area - Enlarged */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`,
        padding: "48px 32px 32px", // Increased padding
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%", // Enlarged avatar from 72 to 88
          border: `4px solid ${accentColor}`,
          overflow: "hidden", flexShrink: 0,
          background: C.navyMid,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}>
          {image ? (
            <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ color: accentColor, fontWeight: 800, fontSize: 28 }}>{initials}</span>
          )}
        </div>
        <div>
          <p style={{ color: "#fff", fontWeight: 800, fontSize: 20, lineHeight: 1.2, margin: 0 }}>{name}</p>
          <p style={{
            color: accentColor, fontWeight: 700, fontSize: 13, // Slightly larger role font
            textTransform: "uppercase", letterSpacing: "0.14em", marginTop: 8,
          }}>{role}</p>
        </div>
      </div>

      {/* Responsibilities - Font size and spacing increased */}
      <div style={{ padding: "40px 32px 48px", flexGrow: 1 }}>
        <p style={{
          fontSize: 12, fontWeight: 800, color: C.slate,
          textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 20,
          borderBottom: "1px solid #f1f5f9", paddingBottom: 12
        }}>Responsibilities</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          {responsibilities.map((r, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
               {/* Custom bullet for larger text */}
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, marginTop: 9, flexShrink: 0 }} />
              <span style={{ 
                fontSize: 15, // Increased font size from 13 to 15
                color: "#1e293b", 
                fontWeight: 500,
                lineHeight: 1.6 
              }}>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Section header ──────────────────────────────────────────────
function SectionHeader({ title, subtitle, light = false }) {
  return (
    <div>
      <h2 style={{
        fontSize: "clamp(32px, 5vw, 48px)", // Larger Header
        fontWeight: 900, lineHeight: 1.1,
        color: light ? "#fff" : C.navy,
        letterSpacing: "-0.04em", margin: "0 0 20px",
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          fontSize: 18, lineHeight: 1.7, // Larger Subtitle
          color: light ? "rgba(224,242,254,0.65)" : C.slate,
          maxWidth: 500, margin: 0,
        }}>{subtitle}</p>
      )}
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────
export default function AboutDevelopersPage() {
  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f8fafc" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-2 { animation-delay: 0.15s; }
        .fade-up-3 { animation-delay: 0.3s; }
        .member-card { animation: fadeUp 0.6s ease both; }
        .grid-lines {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="grid-lines" style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, #1e4a7a 100%)`,
        minHeight: 520, position: "relative", overflow: "hidden",
      }}>
        {/* Decorative elements... */}
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 65%)", top: -200, right: -100, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "50px 40px 100px", position: "relative" }}>
          <nav className="fade-in" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48, fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            <Link href="/" style={{ color: C.teal, textDecoration: "none" }}>Back</Link>
            <ChevronRight size={12} color="rgba(255,255,255,0.3)" />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>About Developers</span>
          </nav>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 60, alignItems: "end" }}>
            <div>
              <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 100, padding: "8px 18px", marginBottom: 32 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal }} />
                <span style={{ color: C.teal, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>HealthCon · Student Project</span>
              </div>

              <h1 className="fade-up fade-up-2" style={{ fontSize: "clamp(48px, 7vw, 84px)", fontWeight: 900, lineHeight: 1.0, color: "#fff", letterSpacing: "-0.04em", margin: "0 0 24px" }}>
                Meet the<br />
                <span style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundImage: `linear-gradient(90deg, ${C.teal} 0%, ${C.bright} 100%)`, backgroundClip: "text" }}>Developers</span>
              </h1>

              <p className="fade-up fade-up-3" style={{ fontSize: 20, lineHeight: 1.75, maxWidth: 600, color: "rgba(224,242,254,0.7)", margin: 0 }}>
                Three Computer Science students from Jose Rizal Memorial State University — Main Campus, building HealthCon from the ground up.
              </p>
            </div>

            <div className="fade-up fade-up-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "32px 40px", display: "flex", flexDirection: "column", gap: 32, backdropFilter: "blur(12px)", minWidth: 220 }}>
              {[
                { n: 3,   s: "",  label: "Team Members" },
                { n: 100, s: "%", label: "Full-Stack"   },
                { n: 1,   s: "",  label: "Shared Vision"},
              ].map(({ n, s, label }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 44, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                    <Counter value={n} suffix={s} />
                  </p>
                  <p style={{ margin: "8px 0 0", fontSize: 11, fontWeight: 800, color: "rgba(224,242,254,0.4)", textTransform: "uppercase", letterSpacing: "0.14em" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR JOURNEY ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <SectionHeader
            title="Our Collective Journey"
            subtitle="As Computer Science students at JRMSU Main Campus, we combined our technical strengths to solve real-world healthcare fragmentation."
          />

          <div style={{ background: `linear-gradient(135deg, ${C.navyMid} 0%, #1e4a7a 100%)`, borderRadius: 40, padding: "48px 40px", position: "relative", overflow: "hidden", boxShadow: "0 20px 50px rgba(15,37,64,0.15)" }}>
            <HeartPulse style={{ position: "absolute", right: -32, bottom: -32, color: "rgba(255,255,255,0.05)" }} size={240} />
            <p style={{ fontSize: 12, fontWeight: 800, color: C.teal, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 32 }}>Team Structure</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              {["Backend & Database Architecture", "Frontend & UI/UX Development", "Documentation & Branding", "Integration & Testing"].map((text, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ChevronRight size={14} color={C.teal} />
                  </div>
                  <span style={{ color: "rgba(224,242,254,0.85)", fontSize: 16, fontWeight: 700 }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── TEAM PROFILES ── */}
      <section style={{ background: "#fff", borderTop: "1px solid rgba(26,53,93,0.07)", borderBottom: "1px solid rgba(26,53,93,0.07)", padding: "120px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: C.teal, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>The People Behind It</p>
            <SectionHeader title="Technical Profiles" />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", // Increased minimum width to fit 3 cards side-by-side perfectly on desktop
            gap: 40, // More space between cards
          }}>
            <MemberCard
              index={0}
              name="Joseph Christian R. Zorrilla"
              role="Backend Lead · Firebase Architect"
              initials="JZ"
              image="/joseph.jpg"
              responsibilities={[
                "API Routes & Server Logic",
                "Firestore Data Models",
                "Clinic UI & Filtering Logic",
                "Security Rules & Route Protection",
                "Database Connection & Configuration",
              ]}
            />
            <MemberCard
              index={1}
              name="Melissa A. Oria"
              role="Full-Stack Dev · Dashboard Engineer"
              initials="MA"
              image="/mels.jpg"
              responsibilities={[
                "Admin & Clinic Dashboards",
                "Data Enrichment Handlers",
                "Appointment Flow Logic",
                "System-Wide Debugging Lead",
                "Full-Stack Data Integration",
              ]}
            />
            <MemberCard
              index={2}
              name="Nova Grace B. Enojo"
              role="UI/UX Designer · Frontend Developer"
              initials="NE"
              image="/nova.png"
              responsibilities={[
                "Visual Branding & Logo",
                "Landing Page & Footer Interface",
                "Technical Documentation",
                "Accessibility Compliance",
                "User Authentication UI Design",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: C.slate, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 40 }}>Powering HealthCon with</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 80 }}>
          {["Next.js", "Firebase", "Tailwind CSS", "Lucide Icons", "Vercel", "JavaScript"].map((name) => (
            <span key={name} style={{ padding: "14px 28px", background: "#fff", border: "1px solid rgba(26,53,93,0.1)", borderRadius: 16, fontSize: 15, fontWeight: 800, color: C.navyMid, letterSpacing: "0.04em", boxShadow: "0 4px 12px rgba(15,37,64,0.06)" }}>{name}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center", marginBottom: 24 }}>
          <div style={{ width: 64, height: 1, background: "rgba(26,53,93,0.12)" }} />
          <span style={{ fontSize: 12, fontWeight: 900, color: "rgba(26,53,93,0.3)", letterSpacing: "0.3em", textTransform: "uppercase" }}>MEJONO TEAM</span>
          <div style={{ width: 64, height: 1, background: "rgba(26,53,93,0.12)" }} />
        </div>
        <p style={{ fontSize: 16, color: C.slate, fontWeight: 500 }}>Built with care by three students who believed healthcare could be better.</p>
      </section>
    </main>
  );
}
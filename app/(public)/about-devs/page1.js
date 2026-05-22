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
        borderRadius: 24,
        overflow: "hidden",
        border: "1px solid rgba(26,53,93,0.08)",
        boxShadow: "0 4px 24px rgba(15,37,64,0.07)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        animationDelay: `${index * 0.12}s`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 16px 48px rgba(15,37,64,0.14)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(15,37,64,0.07)";
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${accentColor}, ${C.bright})` }} />

      {/* Avatar area */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`,
        padding: "32px 28px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          border: `3px solid ${accentColor}`,
          overflow: "hidden", flexShrink: 0,
          background: C.navyMid,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {image ? (
            <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ color: accentColor, fontWeight: 800, fontSize: 22 }}>{initials}</span>
          )}
        </div>
        <div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, lineHeight: 1.2, margin: 0 }}>{name}</p>
          <p style={{
            color: accentColor, fontWeight: 600, fontSize: 11,
            textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 6,
          }}>{role}</p>
        </div>
      </div>

      {/* Responsibilities */}
      <div style={{ padding: "20px 24px 24px" }}>
        <p style={{
          fontSize: 10, fontWeight: 700, color: C.slate,
          textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 12,
        }}>Responsibilities</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {responsibilities.map((r, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: accentColor, flexShrink: 0, marginTop: 6,
              }} />
              <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{r}</span>
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
        fontSize: "clamp(28px, 4vw, 40px)",
        fontWeight: 800, lineHeight: 1.1,
        color: light ? "#fff" : C.navy,
        letterSpacing: "-0.025em", margin: "0 0 16px",
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          fontSize: 16, lineHeight: 1.7,
          color: light ? "rgba(224,242,254,0.65)" : C.slate,
          maxWidth: 460, margin: 0,
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
          from { opacity: 0; transform: translateY(28px); }
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
          background-size: 48px 48px;
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="grid-lines" style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, #1e4a7a 100%)`,
        minHeight: 480, position: "relative", overflow: "hidden",
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 65%)",
          top: -180, right: -100, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: 360, height: 360, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 65%)",
          bottom: -100, left: 80, pointerEvents: "none",
        }} />
        {/* Decorative pill shapes */}
        <div style={{
          position: "absolute", width: 220, height: 220,
          border: "1px solid rgba(45,212,191,0.12)", borderRadius: "50%",
          top: "10%", right: "12%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: 120, height: 120,
          border: "1px solid rgba(56,189,248,0.1)", borderRadius: "50%",
          top: "25%", right: "18%", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 80px", position: "relative" }}>
          {/* Breadcrumb */}
          <nav className="fade-in" style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 48,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            <Link href="/" style={{ color: C.teal, textDecoration: "none" }}>Home</Link>
            <ChevronRight size={11} color="rgba(255,255,255,0.3)" />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>About Developers</span>
          </nav>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "end" }}>
            <div>
              <div className="fade-up" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.2)",
                borderRadius: 100, padding: "6px 14px", marginBottom: 24,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: C.teal, display: "inline-block",
                }} />
                <span style={{
                  color: C.teal, fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                }}>HealthCon · Student Project</span>
              </div>

              <h1 className="fade-up fade-up-2" style={{
                fontSize: "clamp(40px, 6vw, 68px)",
                fontWeight: 900, lineHeight: 1.0,
                color: "#fff", letterSpacing: "-0.035em",
                margin: "0 0 20px",
              }}>
                Meet the<br />
                <span style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage: `linear-gradient(90deg, ${C.teal} 0%, ${C.bright} 100%)`,
                  backgroundClip: "text",
                }}>Developers</span>
              </h1>

              <p className="fade-up fade-up-3" style={{
                fontSize: 17, lineHeight: 1.75, maxWidth: 520,
                color: "rgba(224,242,254,0.65)", margin: 0,
              }}>
                Three Computer Science students from Jose Rizal Memorial State University
                — Main Campus, building HealthCon from the ground up.
              </p>
            </div>

            {/* Stats panel */}
            <div className="fade-up fade-up-3" style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20, padding: "28px 32px",
              display: "flex", flexDirection: "column", gap: 24,
              backdropFilter: "blur(8px)", minWidth: 180,
            }}>
              {[
                { n: 3,   s: "",  label: "Team Members" },
                { n: 100, s: "%", label: "Full-Stack"   },
                { n: 1,   s: "",  label: "Shared Vision"},
              ].map(({ n, s, label }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                    <Counter value={n} suffix={s} />
                  </p>
                  <p style={{
                    margin: "6px 0 0", fontSize: 10, fontWeight: 700,
                    color: "rgba(224,242,254,0.4)", textTransform: "uppercase", letterSpacing: "0.14em",
                  }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR JOURNEY ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "88px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <SectionHeader
            title="Our Collective Journey"
            subtitle="As Computer Science students at JRMSU Main Campus, we combined our technical strengths to solve real-world healthcare fragmentation."
          />

          <div style={{
            background: `linear-gradient(135deg, ${C.navyMid} 0%, #1e4a7a 100%)`,
            borderRadius: 28, padding: "36px 32px",
            position: "relative", overflow: "hidden",
          }}>
            <HeartPulse style={{
              position: "absolute", right: -24, bottom: -24,
              color: "rgba(255,255,255,0.05)",
            }} size={200} />
            <p style={{
              fontSize: 10, fontWeight: 700, color: C.teal,
              letterSpacing: "0.2em", textTransform: "uppercase",
              marginBottom: 20,
            }}>Team Structure</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Backend & Database Architecture",
                "Frontend & UI/UX Development",
                "Documentation & Branding",
                "Integration & Testing",
              ].map((text, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(45,212,191,0.15)",
                    border: "1px solid rgba(45,212,191,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <ChevronRight size={13} color={C.teal} />
                  </div>
                  <span style={{ color: "rgba(224,242,254,0.85)", fontSize: 14, fontWeight: 600 }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── TEAM PROFILES ── */}
      <section style={{
        background: "#fff",
        borderTop: "1px solid rgba(26,53,93,0.07)",
        borderBottom: "1px solid rgba(26,53,93,0.07)",
        padding: "88px 0",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: C.teal,
              letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12,
            }}>The People Behind It</p>
            <SectionHeader title="Technical Profiles" />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
          }}>
            <MemberCard
              index={0}
              name="Joseph Christian R. Zorrilla"
              role="Backend Lead · Architect"
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
              role="Full-Stack · Dashboard Engineer"
              initials="MA"
              image="/mels.jpg"
              responsibilities={[
                "Admin & Clinic Dashboards",
                "Patient Portal Development",
                "Appointment Flow Logic",
                "System-Wide Debugging Lead",
                "Full-Stack Data Integration",
              ]}
            />
            <MemberCard
              index={2}
              name="Nova Grace B. Enojo"
              role="UI/UX Designer · Frontend"
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
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: C.slate,
          letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 32,
        }}>Powering HealthCon with</p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 56 }}>
          {[
            { name: "Next.js",       icon: "⬡" },
            { name: "Firebase",      icon: "🔥" },
            { name: "Tailwind CSS",  icon: "✦" },
            { name: "Lucide",        icon: "◈" },
            { name: "Vercel",        icon: "▲" },
            { name: "JavaScript",    icon: "⬡" },
          ].map(({ name }) => (
            <span key={name} style={{
              padding: "10px 20px",
              background: "#fff",
              border: "1px solid rgba(26,53,93,0.1)",
              borderRadius: 12,
              fontSize: 13, fontWeight: 700,
              color: C.navyMid,
              letterSpacing: "0.04em",
              boxShadow: "0 2px 8px rgba(15,37,64,0.06)",
            }}>{name}</span>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          justifyContent: "center", marginBottom: 20,
        }}>
          <div style={{ width: 48, height: 1, background: "rgba(26,53,93,0.12)" }} />
          <span style={{
            fontSize: 10, fontWeight: 800, color: "rgba(26,53,93,0.3)",
            letterSpacing: "0.22em", textTransform: "uppercase",
          }}>MEJONO TEAM</span>
          <div style={{ width: 48, height: 1, background: "rgba(26,53,93,0.12)" }} />
        </div>
        <p style={{ fontSize: 13, color: C.slate, margin: 0 }}>
          Built with care by three students who believed healthcare could be better.
        </p>
      </section>

    </main>
  );
}
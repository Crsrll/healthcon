"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

// ── Subcomponents ─────────────────────────────────────────────

function HeroSection() {
  return (
    <section className={styles.hero}>
      {[
        { size: 8, top: "22%", left: "52%", delay: "0s", dur: "4s" },
        { size: 6, top: "40%", left: "60%", delay: "1s", dur: "5s" },
        { size: 10, top: "65%", left: "55%", delay: "0.5s", dur: "6s" },
        { size: 7, top: "55%", left: "75%", delay: "2s", dur: "4.5s" },
        { size: 5, top: "30%", left: "80%", delay: "1.5s", dur: "5.5s" },
      ].map((d, i) => (
        <div key={i} className={styles.dot} style={{
          width: d.size, height: d.size,
          top: d.top, left: d.left,
          animationDelay: d.delay, animationDuration: d.dur,
        }} />
      ))}

      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <div className={styles.heroBadge}>
            <div className={styles.badgeDot} />
            Now available 24/7
          </div>
          <h1>
            Connect with Doctors<br />
            <span>ANYWHERE,</span> ANYTIME.
          </h1>
          <p>
            HealthCon is your smart clinic queue platform — skip the waiting room
            and get real medical care from licensed doctors, wherever you are.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPrimary}>
              Book Appointments Now <span className={styles.btnArrow}>↗</span>
            </button>
            <button className={styles.btnSecondary}>Learn more →</button>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <img
            className={styles.heroVisualImage}
            src="https://images.unsplash.com/photo-1580281657521-34f0774d5f79?auto=format&fit=crop&w=800&q=80"
            alt="Doctor consultation"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Create Your Account", desc: "Sign up in under a minute. No paperwork, no insurance headaches — just your basic details." },
    { n: "02", title: "Choose a Doctor", desc: "Browse verified specialists by specialty, availability, and rating. Filter by language or concern." },
    { n: "03", title: "Get Seen Instantly", desc: "Join a secure video or chat session. Receive your diagnosis, notes, and prescription right away." },
  ];
  return (
    <section className={styles.how}>
      <div className={styles.howInner}>
        <div className={styles.sectionLabel}>How It Works</div>
        <h2 className={styles.sectionTitle}>Three steps to your doctor</h2>
        <p className={styles.sectionSub}>Getting care has never been this simple.</p>
        <div className={styles.steps}>
          {steps.map((s) => (
            <div className={styles.step} key={s.n}>
              <div className={styles.stepNum}>{s.n}</div>
              <div className={styles.stepTitle}>{s.title}</div>
              <p className={styles.stepDesc}>{s.desc}</p>
              <div className={styles.stepLine} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedClinics() {
  const features = [
    { icon: "🩺", title: "Virtual Consultations", desc: "Connect with licensed doctors via video, voice, or chat — no waiting rooms, no commute." },
    { icon: "📅", title: "Easy Scheduling", desc: "Book same-day or future appointments 24/7, fitting your schedule perfectly." },
    { icon: "🔒", title: "Secure & Private", desc: "End-to-end encrypted records keep your health data safe and fully under your control." },
    { icon: "💊", title: "Digital Prescriptions", desc: "Receive e-prescriptions instantly, sent directly to your preferred pharmacy." },
  ];
  return (
      <section id="features" className={styles.features}>
      <div className={styles.sectionLabel}>Why HealthCon</div>
      <h2 className={styles.sectionTitle}>Healthcare that works<br />around your life</h2>
      <p className={styles.sectionSub}>
        We've rebuilt the clinic experience from the ground up — faster, simpler, and built for real people.
      </p>
      <div className={styles.featuresGrid}>
        {features.map((f) => (
          <div className={styles.featureCard} key={f.title}>
            <div className={styles.featureIcon}>{f.icon}</div>
            <div className={styles.featureTitle}>{f.title}</div>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const STATS = [
    { value: "50K+", label: "Patients Served" },
    { value: "1,200+", label: "Licensed Doctors" },
    { value: "4.9★", label: "Average Rating" },
    { value: "< 5 min", label: "Avg. Wait Time" },
  ];

  return (
    <>
      {/* NAV */}
      <nav className={scrolled ? styles.scrolled : ""}>
        <a className={styles.navLogo} href="#">
          <div className={styles.logoCircle}>✚</div>
          HealthCon
        </a>
        <ul className={styles.navLinks}>
          <li><a href="#features">About the Website</a></li>
          <li><a href="#">Sign Up</a></li>
          <li><a href="#" className={styles.navCta}>Log In</a></li>
        </ul>
      </nav>

      {/* SECTIONS */}
      <HeroSection />

      {/* WAVE */}
      <div className={styles.waveDivider}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" fill="var(--off-white)" />
          <path d="M0,80 C240,40 480,120 720,80 C960,40 1200,120 1440,80 L1440,120 L0,120 Z" fill="var(--navy-mid)" opacity="0.1" />
        </svg>
      </div>

      {/* STATS */}
      <div className={styles.statsBar}>
        <div className={styles.statsGrid}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <FeaturedClinics />
      <HowItWorks />

      {/* CTA */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <div className={styles.sectionLabel}>Get Started Today</div>
          <h2 className={styles.sectionTitle}>Your health can't wait.</h2>
          <p>Join thousands of patients who've already made the switch to smarter, faster healthcare with HealthCon.</p>
          <div className={styles.ctaBtns}>
            <button className={styles.btnPrimary}>
              Book Appointments Now <span className={styles.btnArrow}>↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>✚ HealthCon</div>
        <div className={styles.footerLinks}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
          <a href="#">Careers</a>
        </div>
        <div>© 2026 HealthCon. All rights reserved.</div>
      </footer>
    </>
  );
}
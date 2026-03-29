"use client";

import { useRouter } from "next/navigation";

const sections = [
  { heading: "Acceptance of Terms", body: "By accessing or using HealthCon, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform." },
  { heading: "Medical Disclaimer", body: "HealthCon connects patients with licensed healthcare providers. The platform is not a substitute for emergency medical services. In a medical emergency, call your local emergency number immediately." },
  { heading: "User Accounts", body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information." },
  { heading: "Appointment Cancellations", body: "Appointments may be cancelled up to 2 hours before the scheduled time without penalty. Late cancellations or no-shows may be subject to a cancellation fee as outlined in your plan." },
  { heading: "Prohibited Conduct", body: "Users may not misuse the platform for fraudulent purposes, impersonate healthcare professionals, or submit false medical information. Violations may result in account termination." },
  { heading: "Limitation of Liability", body: "HealthCon shall not be liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid us in the past 12 months." },
  { heading: "Changes to Terms", body: "We reserve the right to update these Terms at any time. Continued use of the platform after changes constitutes acceptance. We will notify registered users of material changes via email." },
];

export default function TermsPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#122844", paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 48, paddingRight: 48 }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#93c5fd", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0, fontWeight: 600 }}>
            ← Back to Home
          </button>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: "#fff", margin: 0 }}>Terms of Service</h1>
          <p style={{ color: "rgba(219,234,254,0.6)", fontSize: 16, marginTop: 10, marginBottom: 0 }}>Please read these terms carefully before using HealthCon.</p>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 48, paddingRight: 48, paddingTop: 64, paddingBottom: 80 }}>
        {sections.map((s) => (
          <div key={s.heading} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#122844", marginBottom: 12 }}>{s.heading}</h2>
            <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
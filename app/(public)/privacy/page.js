"use client";

import { useRouter } from "next/navigation";

const sections = [
  { heading: "Information We Collect", body: "We collect information you provide directly to us, such as your name, email address, and health-related data necessary to facilitate medical consultations. We also collect usage data to improve our platform." },
  { heading: "How We Use Your Information", body: "Your information is used to connect you with licensed physicians, manage your appointments, send you relevant communications, and comply with applicable laws. We never sell your personal data." },
  { heading: "Data Security", body: "HealthCon uses end-to-end encryption and industry-standard security protocols to protect your health records. All data is stored on secure, HIPAA-compliant servers." },
  { heading: "Sharing of Information", body: "We only share your information with the licensed medical professionals treating you, and with third-party service providers bound by strict confidentiality agreements." },
  { heading: "Your Rights", body: "You have the right to access, correct, or delete your personal data at any time. You may also request a copy of the data we hold about you by contacting our support team." },
  { heading: "Cookies", body: "We use cookies to maintain your session and improve platform performance. You can control cookie settings through your browser preferences at any time." },
  { heading: "Contact Us", body: "If you have any questions about this Privacy Policy, please reach out to our privacy team at privacy@healthcon.com." },
];

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#122844", paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 48, paddingRight: 48 }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#93c5fd", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0, fontWeight: 600 }}>
            ← Back to Home
          </button>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: "#fff", margin: 0 }}>Privacy Policy</h1>
          <p style={{ color: "rgba(219,234,254,0.6)", fontSize: 16, marginTop: 10, marginBottom: 0 }}>Last updated: March 2026</p>
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
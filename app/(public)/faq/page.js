"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const faqs = [
  { q: "How do I book an appointment?", a: "Simply create a free account, browse available doctors by specialty or availability, and tap 'Book' on their profile. You'll receive a confirmation instantly." },
  { q: "Are the doctors on HealthCon licensed?", a: "Yes. Every physician on our platform is verified and licensed by the Philippine Medical Association (PMA) or their respective country's medical board before they can see patients." },
  { q: "Is my health data secure?", a: "Absolutely. All data is encrypted end-to-end and stored on HIPAA-compliant servers. Your health records are never shared with third parties without your explicit consent." },
  { q: "What happens if I need to cancel my appointment?", a: "You can cancel or reschedule up to 2 hours before your appointment at no charge. Cancellations made within 2 hours may incur a small fee depending on your plan." },
  { q: "Can I get a prescription through HealthCon?", a: "Yes. After your consultation, your doctor can issue a digital e-prescription sent directly to your preferred pharmacy or to your app for download." },
  { q: "What types of consultations are available?", a: "We offer video, voice, and text-based consultations. Specialties include general medicine, pediatrics, dermatology, mental health, and more." },
  { q: "How much does it cost?", a: "Consultation fees vary by doctor and specialty. We also offer subscription plans that include unlimited consultations. Visit our Pricing page for full details." },
  { q: "Is HealthCon available outside the Philippines?", a: "Currently we primarily serve patients in the Philippines, but we are expanding. International patients may access the platform for select services." },
];

export default function FAQPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#122844", paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 48, paddingRight: 48 }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#93c5fd", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0, fontWeight: 600 }}>
            ← Back to Home
          </button>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: "#fff", margin: 0 }}>Frequently Asked Questions</h1>
          <p style={{ color: "rgba(219,234,254,0.6)", fontSize: 16, marginTop: 10, marginBottom: 0 }}>Everything you need to know about HealthCon.</p>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 48, paddingRight: 48, paddingTop: 64, paddingBottom: 80 }}>
        <div style={{ maxWidth: 780 }}>
          {faqs.map((item, i) => (
            <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{ width: "100%", background: "none", border: "none", textAlign: "left", padding: "20px 24px", fontWeight: 700, fontSize: 16, color: "#122844", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>{item.q}</span>
                <span style={{ fontSize: 20, color: "#2f80d0", transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease", display: "inline-block" }}>+</span>
              </button>
              {openIndex === i && (
                <div style={{ padding: "16px 24px 20px", fontSize: 15, color: "#475569", lineHeight: 1.8, borderTop: "1px solid #f1f5f9" }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
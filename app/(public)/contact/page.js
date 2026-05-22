"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react"; // Added missing import

// Added missing Color tokens
const C = {
  navy: "#0f2540",
  teal: "#2dd4bf",
  slate: "#64748b",
};

export default function ContactPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#122844", paddingTop: 50, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 48, paddingRight: 48 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13 }}>
            <Link href="/" style={{ color: C.teal, textDecoration: "none", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>Back</Link>
            <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>Contact Us</span>
          </nav>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: "#fff", margin: 0 }}>Contact Us</h1>
          <p style={{ color: "rgba(219,234,254,0.6)", fontSize: 16, marginTop: 10, marginBottom: 0 }}>We'd love to hear from you. Our team usually responds within 24 hours.</p>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 48, paddingRight: 48, paddingTop: 64, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          {/* Form */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#122844", marginBottom: 28 }}>Send us a message</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>First Name</label>
                  <input type="text" placeholder="Juan" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>Last Name</label>
                  <input type="text" placeholder="Dela Cruz" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>Email Address</label>
                <input type="email" placeholder="juan@example.com" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>Subject</label>
                <input type="text" placeholder="How can we help you?" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>Message</label>
                <textarea rows={5} placeholder="Tell us more about your concern..." style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
              </div>
              <button style={{ width: "fit-content", backgroundColor: "#2f80d0", color: "#fff", border: "none", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                Send Message ↗
              </button>
            </div>
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#122844", margin: 0 }}>Other ways to reach us</h2>
            {[
              { icon: "📧", label: "Email", value: "support@healthcon.com", sub: "For general inquiries" },
              { icon: "📞", label: "Phone", value: "+63 2 8888 0000", sub: "Mon–Fri, 8AM–6PM PHT" },
              { icon: "💬", label: "Live Chat", value: "Available in the app", sub: "Average response: under 5 min" },
              { icon: "📍", label: "Office", value: "Davao City, Philippines", sub: "By appointment only" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ fontSize: 24, marginTop: 2 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#122844", marginTop: 2 }}>{item.value}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
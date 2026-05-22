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

const sections = [
  { 
    heading: "Information We Collect", 
    body: "We collect information you provide directly to us, such as your name, contact details, and data necessary to facilitate clinic appointments and account management." 
  },
  { 
    heading: "How We Use Your Information", 
    body: "Your information is used to connect you with clinics, manage your booking status, and allow for platform oversight by our system administrators. We never sell your personal data." 
  },
  { 
    heading: "Data Security", 
    body: "HealthCon uses industry-standard security protocols to protect your records. All data is stored on secure servers with restricted access to ensure your privacy." 
  },
  { 
    heading: "Clinic & Admin Access", 
    body: "Your booking information is shared with the specific clinic you choose to visit. System-wide data is managed by our Superadmin to ensure platform integrity and user safety." 
  },
  { 
    heading: "Your Rights", 
    body: "You have the right to access, correct, or delete your personal data through your dashboard at any time. You may also report issues regarding clinic data handling directly to our support team." 
  },
  { 
    heading: "Cookies", 
    body: "We use cookies to maintain your session and improve platform performance. You can control cookie settings through your browser preferences." 
  },
  { 
    heading: "Contact Us", 
    body: "If you have any questions about this Privacy Policy, please reach out to our team at support@healthcon.com." 
  },
];

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", fontFamily: "sans-serif" }}>
      {/* Header Section */}
      <div style={{ backgroundColor: "#122844", paddingTop: 50, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 48, paddingRight: 48 }}>
          
          {/* Fixed Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13 }}>
            <Link href="/" style={{ color: C.teal, textDecoration: "none", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>Back</Link>
            <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>Privacy Policy</span>
          </nav>

          <h1 style={{ fontSize: 48, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: '-0.02em' }}>Privacy Policy</h1>
          <p style={{ color: "rgba(219,234,254,0.5)", fontSize: 15, marginTop: 12, marginBottom: 0 }}>Last updated: March 2026</p>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 48, paddingRight: 48, paddingTop: 64, paddingBottom: 80 }}>
        <div style={{ maxWidth: 800 }}> {/* Constrained width for better readability */}
          {sections.map((s) => (
            <div key={s.heading} style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>{s.heading}</h2>
              <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
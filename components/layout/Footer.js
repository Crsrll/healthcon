"use client";

import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const links = ["privacy", "terms", "contact", "faq"];

  return (
    <footer style={{
      backgroundColor: "#122844",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      paddingTop: 52,
      paddingBottom: 52,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        paddingLeft: 48,
        paddingRight: 48,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 24,
        flexWrap: "wrap",
      }}>

        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          style={{ color: "#fff", fontWeight: 700, fontSize: 17, cursor: "pointer" }}
        >
          <img src="/logo.png" alt="HealthCon" style={{ height: 36, objectFit: "contain" }} /> 
             <span>Health<span className="text-healthcon-teal">con</span></span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 24 }}>
          {links.map((link) => (
            <span
              key={link}
              onClick={() => router.push(`/${link}`)}
              style={{
                color: "#64748b",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => e.target.style.color = "#fff"}
              onMouseLeave={(e) => e.target.style.color = "#64748b"}
            >
              {link === "faq" ? "FAQ" : link.charAt(0).toUpperCase() + link.slice(1)}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <p style={{
          color: "rgba(255,255,255,0.2)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.1em",
          margin: 0,
        }}>
          © {new Date().getFullYear()} HealthCon. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
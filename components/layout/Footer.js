"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const hideOn = ["/auth/login", "/auth/register", "/auth/register-clinic", "/auth/login-clinic"];
  if (hideOn.includes(pathname)) return null;

  const links = ["privacy", "terms", "contact", "faq", "about-devs"];

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

        {/* Logo — fixed: img + text in a flex row */}
        <div
          onClick={() => router.push("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <img src="/logo.png" alt="HealthCon" style={{ height: 36, objectFit: "contain" }} />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>
            Health<span style={{ color: "#0ea5e9" }}>con</span>
          </span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
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
              onMouseEnter={(e) => (e.target.style.color = "#fff")}
              onMouseLeave={(e) => (e.target.style.color = "#64748b")}
            >
              {link === "faq"
                ? "FAQ"
                : link === "about-devs"
                ? "About Devs"
                : link.charAt(0).toUpperCase() + link.slice(1)}
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
"use client";

// src/components/layout/Footer.tsx
import Link from "next/link";
import { SALON, NAV_LINKS } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-sevres">
      <div className="container-sevres">
        {/* Top grid */}
        <div
          className="footer-grid"
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap:                 "3rem",
            marginBottom:        "4rem",
          }}
        >
          {/* Column 1 — Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div
              style={{
                fontFamily:    "'Cormorant Garamond', Georgia, serif",
                fontSize:      "1.75rem",
                fontWeight:    300,
                color:         "#FAF7F2",
                letterSpacing: "0.05em",
                marginBottom:  "1rem",
              }}
            >
              Sèvres & Co.
            </div>
            <div
              style={{
                width:      "2rem",
                height:     "1px",
                background: "linear-gradient(to right, #C4956A, transparent)",
                marginBottom: "1rem",
              }}
            />
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize:   "0.875rem",
                color:      "rgba(250,247,242,0.55)",
                lineHeight: 1.75,
                fontStyle:  "italic",
              }}
            >
              {SALON.tagline}
            </p>

            {/* Social links */}
            <div
              style={{
                display:    "flex",
                gap:        "0.875rem",
                marginTop:  "1.5rem",
              }}
            >
              {[
                { href: SALON.social.instagram, icon: <Instagram size={16} /> },
                { href: SALON.social.facebook,  icon: <Facebook  size={16} /> },
                { href: SALON.social.pinterest,  icon: <Globe     size={16} /> },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width:           "36px",
                    height:          "36px",
                    borderRadius:    "9999px",
                    border:          "1px solid rgba(196,149,106,0.3)",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    color:           "rgba(250,247,242,0.6)",
                    transition:      "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor      = "#C4956A";
                    e.currentTarget.style.color            = "#C4956A";
                    e.currentTarget.style.backgroundColor  = "rgba(196,149,106,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor      = "rgba(196,149,106,0.3)";
                    e.currentTarget.style.color            = "rgba(250,247,242,0.6)";
                    e.currentTarget.style.backgroundColor  = "transparent";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <p className="footer-heading">Navigate</p>
            <nav style={{ display: "flex", flexDirection: "column" }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="footer-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <p className="footer-heading">Contact</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {[
                {
                  icon: <MapPin size={14} />,
                  text: SALON.address.full,
                },
                {
                  icon: <Phone size={14} />,
                  text: SALON.phone,
                },
                {
                  icon: <Mail size={14} />,
                  text: SALON.email,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display:    "flex",
                    gap:        "0.625rem",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color:     "#C4956A",
                      marginTop: "0.2rem",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize:   "0.875rem",
                      color:      "rgba(250,247,242,0.6)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4 — Hours + Newsletter */}
          <div>
            <p className="footer-heading">Hours</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
              {Object.entries(SALON.hours.short).map(([day, hours]) => (
                <div
                  key={day}
                  style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    gap:            "1rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize:   "0.8125rem",
                      color:      "rgba(250,247,242,0.55)",
                    }}
                  >
                    {day}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize:   "0.8125rem",
                      color:      hours === "Closed" ? "#8B7355" : "rgba(250,247,242,0.75)",
                      fontWeight: hours === "Closed" ? 400 : 500,
                    }}
                  >
                    {hours}
                  </span>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <p className="footer-heading" style={{ fontSize: "0.9375rem" }}>
              Stay in the ritual
            </p>
            <p
              style={{
                fontFamily:   "'DM Sans', sans-serif",
                fontSize:     "0.8125rem",
                color:        "rgba(250,247,242,0.5)",
                marginBottom: "0.875rem",
                lineHeight:   1.6,
              }}
            >
              New treatments, seasonal offers, and studio news.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex:            1,
                  padding:         "0.625rem 0.875rem",
                  backgroundColor: "rgba(255,255,255,0.07)",
                  border:          "1px solid rgba(196,149,106,0.25)",
                  borderRadius:    "0.375rem",
                  fontFamily:      "'DM Sans', sans-serif",
                  fontSize:        "0.8125rem",
                  color:           "#FAF7F2",
                  outline:         "none",
                  minWidth:        0,
                }}
              />
              <button
                style={{
                  padding:         "0.625rem 1rem",
                  backgroundColor: "#C4956A",
                  border:          "none",
                  borderRadius:    "0.375rem",
                  fontFamily:      "'DM Sans', sans-serif",
                  fontSize:        "0.75rem",
                  fontWeight:      500,
                  letterSpacing:   "0.08em",
                  textTransform:   "uppercase",
                  color:           "#FAF7F2",
                  cursor:          "pointer",
                  whiteSpace:      "nowrap",
                  transition:      "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B8965A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C4956A")}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-full" style={{ marginBottom: "2rem" }} />

        {/* Bottom bar */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            flexWrap:       "wrap",
            gap:            "1rem",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   "0.8125rem",
              color:      "rgba(250,247,242,0.35)",
            }}
          >
            © {currentYear} Sèvres & Co. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href="#"
                style={{
                  fontFamily:  "'DM Sans', sans-serif",
                  fontSize:    "0.8125rem",
                  color:       "rgba(250,247,242,0.35)",
                  transition:  "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(250,247,242,0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(250,247,242,0.35)")}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
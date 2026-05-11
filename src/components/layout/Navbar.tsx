// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname                = usePathname();
  const { user }                = useAuth();
  const startProgress = () => window.dispatchEvent(new Event("navigation-start"));

  // ── Scroll detection ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Lock body scroll when menu open ──
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // ── Close menu on route change ──
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Floating Pill Navbar ── */}
      <header className={`navbar-pill ${scrolled ? "scrolled" : ""}`}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily:    "'Cormorant Garamond', Georgia, serif",
            fontSize:      "1.25rem",
            fontWeight:    300,
            color:         "#2C1810",
            letterSpacing: "0.08em",
            whiteSpace:    "nowrap",
            flexShrink:    0,
          }}
        >
          Sèvres & Co.
        </Link>

        {/* Desktop center links */}
        <nav
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "0.25rem",
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.filter((l) => l.label !== "My Account").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "0.8rem",
                fontWeight:    isActive(link.href) ? 500 : 400,
                letterSpacing: "0.06em",
                color:         isActive(link.href) ? "#2C1810" : "#8B7355",
                padding:       "0.375rem 0.875rem",
                borderRadius:  "9999px",
                backgroundColor: isActive(link.href)
                  ? "rgba(44,24,16,0.06)"
                  : "transparent",
                transition:    "all 0.25s ease",
                whiteSpace:    "nowrap",
              }}
              onClick={startProgress}
              onMouseEnter={(e) => {
                if (!isActive(link.href)) {
                  e.currentTarget.style.color           = "#2C1810";
                  e.currentTarget.style.backgroundColor = "rgba(44,24,16,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.href)) {
                  e.currentTarget.style.color           = "#8B7355";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* My Account avatar — desktop, logged in only */}
          {user && (
            <Link
              href="/account"
              className="desktop-cta"
              style={{
                display:         "inline-flex",
                alignItems:      "center",
                gap:             "0.5rem",
                fontFamily:      "'DM Sans', sans-serif",
                fontSize:        "0.8rem",
                fontWeight:      500,
                color:           "#2C1810",
                padding:         "0.375rem 0.875rem 0.375rem 0.375rem",
                borderRadius:    "9999px",
                border:          "1.5px solid rgba(44,24,16,0.12)",
                transition:      "all 0.25s ease",
                whiteSpace:      "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(196,149,106,0.5)";
                e.currentTarget.style.color = "#C4956A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(44,24,16,0.12)";
                e.currentTarget.style.color = "#2C1810";
              }}
            >
              <span style={{
                width:           "26px",
                height:          "26px",
                borderRadius:    "9999px",
                background:      "linear-gradient(135deg, #C4956A 0%, #B8965A 100%)",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                color:           "#FAF7F2",
                fontSize:        "0.625rem",
                fontWeight:      600,
                letterSpacing:   "0.05em",
                flexShrink:      0,
              }}>
                {user.email?.slice(0, 2).toUpperCase()}
              </span>
              My Account
            </Link>
          )}

          {/* Book Now CTA — desktop */}
          <Link
            href="/book"
            className="btn-primary btn-sm desktop-cta"
          >
            Book Now
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="hamburger-btn"
            style={{
              width:           "38px",
              height:          "38px",
              borderRadius:    "9999px",
              border:          "1.5px solid rgba(44,24,16,0.15)",
              backgroundColor: menuOpen ? "#2C1810" : "transparent",
              alignItems:      "center",
              justifyContent:  "center",
              color:           menuOpen ? "#FAF7F2" : "#2C1810",
              transition:      "all 0.3s ease",
              flexShrink:      0,
            }}
            onMouseEnter={(e) => {
              if (!menuOpen) {
                e.currentTarget.style.backgroundColor = "rgba(44,24,16,0.06)";
              }
            }}
            onMouseLeave={(e) => {
              if (!menuOpen) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* ── Full Screen Overlay Menu ── */}
      <div
        className={`overlay-menu ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button top right */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          style={{
            position:        "fixed",
            top:             "1.5rem",
            right:           "1.75rem",
            width:           "44px",
            height:          "44px",
            borderRadius:    "9999px",
            border:          "1.5px solid rgba(44,24,16,0.2)",
            backgroundColor: "transparent",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            color:           "#2C1810",
            transition:      "all 0.3s ease",
            zIndex:          61,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2C1810";
            e.currentTarget.style.color           = "#FAF7F2";
            e.currentTarget.style.borderColor     = "#2C1810";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color           = "#2C1810";
            e.currentTarget.style.borderColor     = "rgba(44,24,16,0.2)";
          }}
        >
          <X size={18} />
        </button>

        {/* Brand mark in overlay */}
        <div
          style={{
            position:      "absolute",
            top:           "1.75rem",
            left:          "50%",
            transform:     "translateX(-50%)",
            fontFamily:    "'Cormorant Garamond', Georgia, serif",
            fontSize:      "1.125rem",
            fontWeight:    300,
            color:         "#2C1810",
            letterSpacing: "0.1em",
            opacity:       0.5,
            whiteSpace:    "nowrap",
          }}
        >
          Sèvres & Co.
        </div>

        {/* Nav links */}
        <nav
          style={{
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            gap:            "0.25rem",
            textAlign:      "center",
          }}
        >
          {NAV_LINKS.map((link) => {
            // Hide My Account if not logged in
            if (link.label === "My Account" && !user) return null;

            return (
              <div key={link.href} className="overlay-nav-item">
                <Link
                  href={link.href}
                  className="overlay-menu-link"
                  style={{
                    color: isActive(link.href) ? "#C4956A" : "#2C1810",
                  }}
                >
                  {link.label}
                </Link>
              </div>
            );
          })}

          {/* Auth link in overlay */}
          <div className="overlay-nav-item" style={{ marginTop: "1.5rem" }}>
            {user ? (
              <Link
                href="/account"
                className="btn-primary"
                style={{ fontSize: "0.8125rem" }}
              >
                My Account
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="btn-secondary"
                style={{ fontSize: "0.8125rem" }}
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>

        {/* Bottom bar in overlay */}
        <div
          style={{
            position:   "absolute",
            bottom:     "2.5rem",
            left:       0,
            right:      0,
            textAlign:  "center",
          }}
        >
          <p
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.75rem",
              color:         "#8B7355",
              letterSpacing: "0.1em",
            }}
          >
            14, Linking Road · Bandra West · Mumbai
          </p>
        </div>
      </div>
    </>
  );
}
// src/components/home/HeroSection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* Background image */}
      <div className="hero-image-container">
        <Image
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=90"
          alt="Sèvres & Co. luxury salon interior"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="hero-overlay" />
      </div>

      {/* Content */}
      <div className="hero-content">
        {/* Eyebrow */}
        <div
          className="animate-fade-in-up opacity-0-init"
          style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
        >
          <span
            style={{
              display:       "inline-block",
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.6875rem",
              fontWeight:    500,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color:         "rgba(250,247,242,0.75)",
              marginBottom:  "1.5rem",
            }}
          >
            Bandra West, Mumbai
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up opacity-0-init"
          style={{
            fontFamily:        "'Cormorant Garamond', Georgia, serif",
            fontSize:          "clamp(2.5rem, 7vw, 6.5rem)",
            fontWeight:        300,
            color:             "#FAF7F2",
            lineHeight:        1.05,
            letterSpacing:     "-0.02em",
            marginBottom:      "1.5rem",
            animationDelay:    "0.25s",
            animationFillMode: "forwards",
            padding:           "0 0.5rem",
          }}
        >
          Where refinement
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(250,247,242,0.85)" }}>
            is ritual.
          </em>
        </h1>

        {/* Divider */}
        <div
          className="animate-fade-in opacity-0-init"
          style={{
            width:             "3rem",
            height:            "1px",
            backgroundColor:   "#C4956A",
            margin:            "0 auto 1.5rem",
            animationDelay:    "0.4s",
            animationFillMode: "forwards",
          }}
        />

        {/* Subheadline */}
        <p
          className="animate-fade-in-up opacity-0-init"
          style={{
            fontFamily:        "'DM Sans', sans-serif",
            fontSize:          "clamp(0.875rem, 1.5vw, 1.0625rem)",
            color:             "rgba(250,247,242,0.72)",
            lineHeight:        1.8,
            maxWidth:          "520px",
            margin:            "0 auto 2.5rem",
            padding:           "0 1.5rem",
            animationDelay:    "0.45s",
            animationFillMode: "forwards",
          }}
        >
          Mumbai&apos;s most considered luxury salon and spa.
          Bespoke treatments. Internationally trained specialists.
          A sanctuary designed for those who know the difference.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-in-up opacity-0-init"
          style={{
            display:           "flex",
            alignItems:        "center",
            justifyContent:    "center",
            gap:               "0.75rem",
            flexWrap:          "wrap",
            padding:           "0 1.5rem",
            animationDelay:    "0.6s",
            animationFillMode: "forwards",
          }}
        >
          <Link
            href="/book"
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              padding:         "0.875rem 1.75rem",
              backgroundColor: "#FAF7F2",
              color:           "#2C1810",
              fontFamily:      "'DM Sans', sans-serif",
              fontSize:        "0.8125rem",
              fontWeight:      500,
              letterSpacing:   "0.12em",
              textTransform:   "uppercase",
              borderRadius:    "9999px",
              border:          "1.5px solid #FAF7F2",
              transition:      "all 0.3s ease",
              whiteSpace:      "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#C4956A";
              e.currentTarget.style.borderColor     = "#C4956A";
              e.currentTarget.style.color           = "#FAF7F2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FAF7F2";
              e.currentTarget.style.borderColor     = "#FAF7F2";
              e.currentTarget.style.color           = "#2C1810";
            }}
          >
            Book Your Ritual
          </Link>
          <Link
            href="/services"
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              padding:         "0.875rem 1.75rem",
              backgroundColor: "transparent",
              color:           "rgba(250,247,242,0.85)",
              fontFamily:      "'DM Sans', sans-serif",
              fontSize:        "0.8125rem",
              fontWeight:      500,
              letterSpacing:   "0.12em",
              textTransform:   "uppercase",
              borderRadius:    "9999px",
              border:          "1.5px solid rgba(250,247,242,0.35)",
              transition:      "all 0.3s ease",
              whiteSpace:      "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(250,247,242,0.75)";
              e.currentTarget.style.color       = "#FAF7F2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(250,247,242,0.35)";
              e.currentTarget.style.color       = "rgba(250,247,242,0.85)";
            }}
          >
            Explore Services
          </Link>
        </div>

        {/* Scroll indicator — hidden on mobile */}
        <div
          className="animate-fade-in opacity-0-init hero-scroll-indicator"
          style={{
            position:          "absolute",
            bottom:            "2.5rem",
            left:              "50%",
            transform:         "translateX(-50%)",
            display:           "flex",
            flexDirection:     "column",
            alignItems:        "center",
            gap:               "0.5rem",
            animationDelay:    "1s",
            animationFillMode: "forwards",
          }}
        >
          <span
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color:         "rgba(250,247,242,0.45)",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width:      "1px",
              height:     "40px",
              background: "linear-gradient(to bottom, rgba(250,247,242,0.4), transparent)",
              animation:  "float 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-scroll-indicator {
            display: none !important;
          }
          .hero-content {
            padding: 0 0.5rem;
          }
        }
      `}</style>
    </section>
  );
}
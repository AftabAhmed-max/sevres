"use client";

// src/components/home/HowItWorks.tsx
import Link from "next/link";
import { HOW_IT_WORKS } from "@/lib/constants";

export default function HowItWorks() {
  return (
    <section
      style={{
        backgroundColor: "#FAF7F2",
        padding:         "7rem 0",
      }}
    >
      <div className="container-sevres">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <span className="eyebrow">The Process</span>
          <h2
            style={{
              fontFamily:   "'Cormorant Garamond', Georgia, serif",
              fontSize:     "clamp(2rem, 4vw, 3.25rem)",
              fontWeight:   400,
              color:        "#2C1810",
              lineHeight:   1.15,
              marginBottom: "1rem",
            }}
          >
            How it works
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   "0.9375rem",
              color:      "#8B7355",
              maxWidth:   "480px",
              margin:     "0 auto",
              lineHeight: 1.75,
            }}
          >
            Booking your ritual at Sèvres & Co. takes less than two minutes.
            Here is how.
          </p>
        </div>

        {/* Steps */}
        <div
          className="hiw-grid"
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap:                 "2rem",
            position:            "relative",
          }}
        >
          {/* Connecting line — desktop only */}
          <div
            style={{
              position:        "absolute",
              top:             "3rem",
              left:            "calc(33.33% - 1rem)",
              right:           "calc(33.33% - 1rem)",
              height:          "1px",
              background:      "linear-gradient(to right, transparent, rgba(196,149,106,0.3), rgba(196,149,106,0.3), transparent)",
              pointerEvents:   "none",
            }}
            className="hiw-connector"
          />

          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.step}
              style={{
                textAlign:    "center",
                padding:      "2.5rem 1.5rem",
                position:     "relative",
              }}
            >
              {/* Step number circle */}
              <div
                style={{
                  width:           "5rem",
                  height:          "5rem",
                  borderRadius:    "9999px",
                  border:          "1.5px solid rgba(196,149,106,0.3)",
                  backgroundColor: "#FFFFFF",
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  margin:          "0 auto 2rem",
                  position:        "relative",
                  zIndex:          1,
                  boxShadow:       "0 4px 20px rgba(44,24,16,0.06)",
                }}
              >
                <span
                  style={{
                    fontFamily:   "'Cormorant Garamond', Georgia, serif",
                    fontSize:     "1.5rem",
                    fontWeight:   400,
                    color:        "#C4956A",
                    lineHeight:   1,
                  }}
                >
                  {step.step}
                </span>
              </div>

              {/* Dot accent */}
              <div
                style={{
                  width:           "5px",
                  height:          "5px",
                  borderRadius:    "9999px",
                  backgroundColor: "#C4956A",
                  margin:          "0 auto 1.25rem",
                  opacity:         0.5,
                }}
              />

              <h3
                style={{
                  fontFamily:   "'Cormorant Garamond', Georgia, serif",
                  fontSize:     "1.5rem",
                  fontWeight:   400,
                  color:        "#2C1810",
                  marginBottom: "0.875rem",
                  lineHeight:   1.2,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize:   "0.9rem",
                  color:      "#8B7355",
                  lineHeight: 1.75,
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <Link href="/book" className="btn-primary">
            Begin Your Booking
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hiw-connector { display: none !important; }
          .hiw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
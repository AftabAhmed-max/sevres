// src/components/home/Testimonials.tsx
import { TESTIMONIALS } from "@/lib/constants";
import InitialsAvatar from "@/components/ui/InitialsAvatar";

export default function Testimonials() {
  return (
    <section
      style={{
        backgroundColor: "#FAF7F2",
        padding:         "5rem 0",
      }}
    >
      <div className="container-sevres">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="eyebrow">Client Stories</span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize:   "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: 400,
              color:      "#2C1810",
              lineHeight: 1.15,
            }}
          >
            What our clients say
          </h2>
        </div>

        {/* All testimonials — single responsive grid */}
        <div
          className="testimonials-grid"
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap:                 "1.25rem",
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <span className="quote-mark">&ldquo;</span>
              <div
                style={{
                  display:      "flex",
                  gap:          "0.2rem",
                  marginBottom: "1rem",
                }}
              >
                {Array.from({ length: t.rating }).map((_, si) => (
                  <span key={si} style={{ color: "#C4956A", fontSize: "0.875rem" }}>
                    ★
                  </span>
                ))}
              </div>
              <p
                style={{
                  fontFamily:   "'DM Sans', sans-serif",
                  fontSize:     "0.9375rem",
                  color:        "#2C1810",
                  lineHeight:   1.8,
                  marginBottom: "1.5rem",
                  fontStyle:    "italic",
                }}
              >
                {t.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <InitialsAvatar name={t.name} size={40} />
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize:   "0.875rem",
                      fontWeight: 500,
                      color:      "#2C1810",
                      lineHeight: 1.3,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize:   "0.75rem",
                      color:      "#8B7355",
                    }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
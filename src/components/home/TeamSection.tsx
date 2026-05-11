// src/components/home/TeamSection.tsx
import Link from "next/link";
import { SEED_STYLISTS } from "@/lib/constants";
import InitialsAvatar from "@/components/ui/InitialsAvatar";

export default function TeamSection() {
  return (
    <section
      style={{
        backgroundColor: "#FFFFFF",
        padding:         "7rem 0",
      }}
    >
      <div className="container-sevres">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="eyebrow">The Specialists</span>
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
            Meet the team
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
            Internationally trained. Individually passionate.
            Each specialist brings a distinct mastery to the studio.
          </p>
        </div>

        {/* Grid */}
        <div className="team-grid">
          {SEED_STYLISTS.map((stylist) => (
            <div
              key={stylist.name}
              style={{
                textAlign:  "center",
                padding:    "2rem 1rem",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  position:       "relative",
                  display:        "inline-block",
                  marginBottom:   "1.25rem",
                }}
              >
                <div
                  style={{
                    width:        "88px",
                    height:       "88px",
                    borderRadius: "9999px",
                    border:       "2px solid rgba(196,149,106,0.2)",
                    padding:      "3px",
                    display:      "inline-flex",
                  }}
                >
                  <InitialsAvatar name={stylist.name} size={78} />
                </div>
                {/* Active indicator */}
                <div
                  style={{
                    position:        "absolute",
                    bottom:          "4px",
                    right:           "4px",
                    width:           "12px",
                    height:          "12px",
                    borderRadius:    "9999px",
                    backgroundColor: "#C4956A",
                    border:          "2px solid #FFFFFF",
                  }}
                />
              </div>

              {/* Name */}
              <h3
                style={{
                  fontFamily:   "'Cormorant Garamond', Georgia, serif",
                  fontSize:     "1.25rem",
                  fontWeight:   400,
                  color:        "#2C1810",
                  marginBottom: "0.25rem",
                }}
              >
                {stylist.name}
              </h3>

              {/* Specialties */}
              <p
                style={{
                  fontFamily:    "'DM Sans', sans-serif",
                  fontSize:      "0.6875rem",
                  fontWeight:    500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         "#C4956A",
                  marginBottom:  "0.75rem",
                }}
              >
                {stylist.specialties.slice(0, 2).join(" · ")}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/about" className="btn-secondary">
            About the Studio
          </Link>
        </div>
      </div>
    </section>
  );
}
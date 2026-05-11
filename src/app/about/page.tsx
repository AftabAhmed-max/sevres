// src/app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SALON, SEED_STYLISTS } from "@/lib/constants";
import InitialsAvatar from "@/components/ui/InitialsAvatar";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Sèvres & Co. — Mumbai's most refined luxury salon and spa, and the specialists behind every ritual.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section
          style={{
            backgroundColor: "#FAF7F2",
            paddingTop:      "10rem",
            paddingBottom:   "6rem",
            textAlign:       "center",
          }}
        >
          <div className="container-sevres">
            <span className="eyebrow">Our Story</span>
            <h1
              style={{
                fontFamily:   "'Cormorant Garamond', Georgia, serif",
                fontSize:     "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight:   300,
                color:        "#2C1810",
                lineHeight:   1.15,
                marginBottom: "1.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Refinement as a way of life.
            </h1>
            <div className="divider-rose" />
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize:   "1.0625rem",
                color:      "#8B7355",
                lineHeight: 1.8,
                maxWidth:   "620px",
                margin:     "0 auto",
              }}
            >
              Sèvres & Co. was founded on a single belief — that beauty rituals
              should feel as extraordinary as their results. Named after the
              finest French porcelain, every detail of our studio is crafted
              with the same obsessive care that goes into every treatment.
            </p>
          </div>
        </section>

        {/* ── Philosophy ── */}
        <section
          style={{
            backgroundColor: "#FFFFFF",
            padding:         "6rem 0",
          }}
        >
          <div className="container-sevres">
            <div
              className="about-philosophy-grid"
              style={{
                display:             "grid",
                gridTemplateColumns: "1fr 1fr",
                gap:                 "5rem",
                alignItems:          "center",
              }}
            >
              {/* Image */}
              <div
                className="about-philosophy-image"
                style={{
                  position:     "relative",
                  height:       "520px",
                  borderRadius: "0.75rem",
                  overflow:     "hidden",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"
                  alt="Sèvres & Co. salon interior"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Text */}
              <div>
                <span className="eyebrow">Our Philosophy</span>
                <h2
                  style={{
                    fontFamily:   "'Cormorant Garamond', Georgia, serif",
                    fontSize:     "clamp(1.75rem, 3vw, 3rem)",
                    fontWeight:   400,
                    color:        "#2C1810",
                    lineHeight:   1.2,
                    marginBottom: "1.5rem",
                  }}
                >
                  Beauty that begins with listening.
                </h2>
                <div
                  style={{
                    display:       "flex",
                    flexDirection: "column",
                    gap:           "1rem",
                  }}
                >
                  {[
                    "We believe every client deserves a treatment that is entirely their own — not a template, but a ritual designed around their skin, their hair, and their life.",
                    "Our specialists take time before every appointment to understand not just what you want, but why. That conversation shapes everything that follows.",
                    "We use only premium, ethically sourced products — from Wella Professionals and L'Oréal to La Mer skincare and Himalayan mineral therapies.",
                  ].map((text, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize:   "0.9375rem",
                        color:      "#8B7355",
                        lineHeight: 1.8,
                      }}
                    >
                      {text}
                    </p>
                  ))}
                </div>

                <div style={{ marginTop: "2.5rem" }}>
                  <Link href="/book" className="btn-primary">
                    Book Your Ritual
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile grid fix */}
          <style>{`
            @media (max-width: 768px) {
              .about-philosophy-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </section>

        {/* ── Values ── */}
        <section
          style={{
            backgroundColor: "#FAF7F2",
            padding:         "6rem 0",
          }}
        >
          <div className="container-sevres">
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span className="eyebrow">What We Stand For</span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize:   "clamp(1.75rem, 3vw, 3rem)",
                  fontWeight: 400,
                  color:      "#2C1810",
                }}
              >
                Our values
              </h2>
            </div>

            <div
              className="about-values-grid"
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap:                 "2rem",
              }}
            >
              {[
                {
                  number: "01",
                  title:  "Precision",
                  text:   "Every cut, stroke, and application is deliberate. We do not rush. We do not compromise. We refine until it is right.",
                },
                {
                  number: "02",
                  title:  "Discretion",
                  text:   "Our studio is a private sanctuary. What happens within these walls — your conversations, your concerns — stays here.",
                },
                {
                  number: "03",
                  title:  "Continuity",
                  text:   "We build relationships, not transactions. Your specialist remembers your preferences, your history, your ritual.",
                },
              ].map((value) => (
                <div
                  key={value.number}
                  className="card-ivory"
                  style={{ textAlign: "center" }}
                >
                  <span
                    style={{
                      fontFamily:    "'Cormorant Garamond', Georgia, serif",
                      fontSize:      "3.5rem",
                      fontWeight:    300,
                      color:         "rgba(196,149,106,0.3)",
                      lineHeight:    1,
                      display:       "block",
                      marginBottom:  "1rem",
                    }}
                  >
                    {value.number}
                  </span>
                  <h3
                    style={{
                      fontFamily:   "'Cormorant Garamond', Georgia, serif",
                      fontSize:     "1.5rem",
                      fontWeight:   400,
                      color:        "#2C1810",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {value.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize:   "0.9rem",
                      color:      "#8B7355",
                      lineHeight: 1.75,
                    }}
                  >
                    {value.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section
          style={{
            backgroundColor: "#FFFFFF",
            padding:         "6rem 0",
          }}
        >
          <div className="container-sevres">
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span className="eyebrow">The Specialists</span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize:   "clamp(1.75rem, 3vw, 3rem)",
                  fontWeight: 400,
                  color:      "#2C1810",
                }}
              >
                Meet the team
              </h2>
            </div>

            <div className="about-team-grid">
              {SEED_STYLISTS.map((stylist) => (
                <div
                  key={stylist.name}
                  className="card-sevres"
                  style={{ textAlign: "center", padding: "2rem 1.5rem" }}
                >
                  <div
                    style={{
                      display:        "flex",
                      justifyContent: "center",
                      marginBottom:   "1.25rem",
                    }}
                  >
                    <InitialsAvatar name={stylist.name} size={72} />
                  </div>
                  <h3
                    style={{
                      fontFamily:   "'Cormorant Garamond', Georgia, serif",
                      fontSize:     "1.25rem",
                      fontWeight:   400,
                      color:        "#2C1810",
                      marginBottom: "0.375rem",
                    }}
                  >
                    {stylist.name}
                  </h3>
                  <p
                    style={{
                      fontFamily:   "'DM Sans', sans-serif",
                      fontSize:     "0.75rem",
                      color:        "#C4956A",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "0.875rem",
                    }}
                  >
                    {stylist.specialties.join(" · ")}
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize:   "0.875rem",
                      color:      "#8B7355",
                      lineHeight: 1.7,
                    }}
                  >
                    {stylist.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Location ── */}
        <section
          style={{
            backgroundColor: "#FAF7F2",
            padding:         "6rem 0",
          }}
        >
          <div className="container-sevres">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span className="eyebrow">Find Us</span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize:   "clamp(1.75rem, 3vw, 3rem)",
                  fontWeight: 400,
                  color:      "#2C1810",
                }}
              >
                {SALON.address.full}
              </h2>
            </div>

            <div
              style={{
                borderRadius: "0.75rem",
                overflow:     "hidden",
                border:       "1px solid rgba(196,149,106,0.15)",
                height:       "400px",
              }}
            >
              <iframe
                src={SALON.map.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Sèvres & Co. location"
              />
            </div>
          </div>
          <style>{`
            @media (max-width: 768px) {
              .about-philosophy-grid {
                grid-template-columns: 1fr !important;
                gap: 2rem !important;
              }
              .about-philosophy-image {
                height: 260px !important;
              }
              .about-philosophy-grid img {
                height: 280px !important;
              }
              .about-values-grid {
                grid-template-columns: 1fr !important;
              }
              .about-team-grid {
                grid-template-columns: 1fr !important;
                gap: 1.25rem !important;
              }
            }
            @media (min-width: 769px) {
              .about-team-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1.5rem;
              }
            }
          `}</style>
        </section>
      </main>
      <Footer />
    </>
  );
}
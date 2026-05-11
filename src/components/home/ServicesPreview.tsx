// src/components/home/ServicesPreview.tsx
"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useFeaturedServices } from "@/hooks/useBooking";
import { FEATURED_SERVICE_NAMES } from "@/lib/constants";
import { formatPrice, formatDuration } from "@/lib/time-slots";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const CATEGORY_COLORS: Record<string, string> = {
  hair:    "#C4956A",
  skin:    "#B8965A",
  nails:   "#C4956A",
  massage: "#8B7355",
};

export default function ServicesPreview() {
  const { services, loading } = useFeaturedServices(FEATURED_SERVICE_NAMES);

  return (
    <section
      style={{
        backgroundColor: "#FFFFFF",
        padding:         "7rem 0",
      }}
    >
      <div className="container-sevres">
        {/* Header */}
        <div
          style={{
            display:        "flex",
            alignItems:     "flex-end",
            justifyContent: "space-between",
            marginBottom:   "3.5rem",
            flexWrap:       "wrap",
            gap:            "1rem",
          }}
        >
          <div>
            <span className="eyebrow">What We Offer</span>
            <h2
              style={{
                fontFamily:   "'Cormorant Garamond', Georgia, serif",
                fontSize:     "clamp(2rem, 4vw, 3.25rem)",
                fontWeight:   400,
                color:        "#2C1810",
                lineHeight:   1.15,
              }}
            >
              Featured treatments
            </h2>
          </div>
          <Link
            href="/services"
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "0.375rem",
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.8125rem",
              fontWeight:    500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color:         "#C4956A",
              transition:    "gap 0.3s ease",
              whiteSpace:    "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.gap = "0.625rem")}
            onMouseLeave={(e) => (e.currentTarget.style.gap = "0.375rem")}
          >
            View all services <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSpinner message="Loading services…" />
        ) : (
          <div
            className="services-preview-grid"
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap:                 "1.25rem",
            }}
          >
            {services.map((service, i) => (
              <div
                key={service.id}
                className="card-sevres"
                style={{
                  display:       "flex",
                  flexDirection: "column",
                  cursor:        "default",
                }}
              >
                {/* Colour bar */}
                <div
                  style={{
                    height:          "3px",
                    backgroundColor: CATEGORY_COLORS[service.category] ?? "#C4956A",
                    opacity:         0.6,
                  }}
                />

                <div style={{ padding: "1.75rem 1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Number + category */}
                  <div
                    style={{
                      display:        "flex",
                      justifyContent: "space-between",
                      alignItems:     "center",
                      marginBottom:   "1rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily:    "'Cormorant Garamond', Georgia, serif",
                        fontSize:      "2rem",
                        fontWeight:    300,
                        color:         "rgba(196,149,106,0.25)",
                        lineHeight:    1,
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      style={{
                        fontFamily:    "'DM Sans', sans-serif",
                        fontSize:      "0.6rem",
                        fontWeight:    500,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color:         "#C4956A",
                      }}
                    >
                      {service.category}
                    </span>
                  </div>

                  {/* Name */}
                  <h3
                    style={{
                      fontFamily:   "'Cormorant Garamond', Georgia, serif",
                      fontSize:     "1.375rem",
                      fontWeight:   400,
                      color:        "#2C1810",
                      lineHeight:   1.3,
                      marginBottom: "0.625rem",
                    }}
                  >
                    {service.name}
                  </h3>

                  {/* Description */}
                  {service.description && (
                    <p
                      style={{
                        fontFamily:   "'DM Sans', sans-serif",
                        fontSize:     "0.875rem",
                        color:        "#8B7355",
                        lineHeight:   1.7,
                        flex:         1,
                        marginBottom: "1.25rem",
                      }}
                    >
                      {service.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div
                    style={{
                      display:        "flex",
                      justifyContent: "space-between",
                      alignItems:     "center",
                      paddingTop:     "1rem",
                      borderTop:      "1px solid rgba(196,149,106,0.1)",
                      marginTop:      "auto",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily:   "'Cormorant Garamond', Georgia, serif",
                          fontSize:     "1.375rem",
                          fontWeight:   500,
                          color:        "#2C1810",
                        }}
                      >
                        {formatPrice(service.price)}
                      </span>
                      <div
                        style={{
                          display:    "flex",
                          alignItems: "center",
                          gap:        "0.25rem",
                          marginTop:  "0.125rem",
                        }}
                      >
                        <Clock size={11} color="#8B7355" />
                        <span
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize:   "0.75rem",
                            color:      "#8B7355",
                          }}
                        >
                          {formatDuration(service.duration)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/book?service=${service.id}`}
                      style={{
                        display:         "inline-flex",
                        alignItems:      "center",
                        justifyContent:  "center",
                        width:           "36px",
                        height:          "36px",
                        borderRadius:    "9999px",
                        backgroundColor: "rgba(44,24,16,0.06)",
                        color:           "#2C1810",
                        transition:      "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#2C1810";
                        e.currentTarget.style.color           = "#FAF7F2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(44,24,16,0.06)";
                        e.currentTarget.style.color           = "#2C1810";
                      }}
                    >
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .services-preview-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 640px) {
          .services-preview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
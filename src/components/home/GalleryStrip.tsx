"use client";

// src/components/home/GalleryStrip.tsx
import Image from "next/image";
import Link from "next/link";
import { GALLERY_IMAGES } from "@/lib/constants";

export default function GalleryStrip() {
  return (
    <section
      style={{
        backgroundColor: "#2C1810",
        padding:         "6rem 0",
      }}
    >
      <div className="container-sevres">
        {/* Header */}
        <div
          style={{
            textAlign:    "center",
            marginBottom: "3rem",
          }}
        >
          <span
            style={{
              display:       "inline-block",
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.6875rem",
              fontWeight:    500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color:         "rgba(196,149,106,0.8)",
              marginBottom:  "1rem",
            }}
          >
            The Studio
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize:   "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: 400,
              color:      "#FAF7F2",
              lineHeight: 1.15,
            }}
          >
            Inside Sèvres & Co.
          </h2>
        </div>

        {/* Gallery grid */}
        <div className="gallery-strip">
          {GALLERY_IMAGES.map((image, i) => (
            <div key={i} className="gallery-item">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{
                  objectFit: "cover",
                }}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              {/* Hover overlay */}
              <div
                style={{
                  position:        "absolute",
                  inset:           0,
                  backgroundColor: "rgba(44,24,16,0)",
                  transition:      "background-color 0.4s ease",
                }}
                className="gallery-overlay"
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link
            href="/book"
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              padding:         "0.9375rem 2.25rem",
              backgroundColor: "transparent",
              color:           "rgba(250,247,242,0.85)",
              fontFamily:      "'DM Sans', sans-serif",
              fontSize:        "0.8125rem",
              fontWeight:      500,
              letterSpacing:   "0.12em",
              textTransform:   "uppercase",
              borderRadius:    "9999px",
              border:          "1.5px solid rgba(250,247,242,0.25)",
              transition:      "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#C4956A";
              e.currentTarget.style.borderColor     = "#C4956A";
              e.currentTarget.style.color           = "#FAF7F2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor     = "rgba(250,247,242,0.25)";
              e.currentTarget.style.color           = "rgba(250,247,242,0.85)";
            }}
          >
            Reserve Your Visit
          </Link>
        </div>
      </div>

      <style>{`
        .gallery-overlay:hover {
          background-color: rgba(44,24,16,0.35) !important;
        }
      `}</style>
    </section>
  );
}
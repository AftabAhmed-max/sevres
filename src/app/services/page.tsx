// src/app/services/page.tsx
"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/services/ServiceCard";
import CategoryFilter from "@/components/services/CategoryFilter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useServices } from "@/hooks/useBooking";

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { services, loading, error }        = useServices(activeCategory);

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section
          style={{
            backgroundColor: "#FAF7F2",
            paddingTop:      "10rem",
            paddingBottom:   "5rem",
            textAlign:       "center",
          }}
        >
          <div className="container-sevres">
            <span className="eyebrow">The Menu</span>
            <h1
              style={{
                fontFamily:    "'Cormorant Garamond', Georgia, serif",
                fontSize:      "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight:    300,
                color:         "#2C1810",
                letterSpacing: "-0.02em",
                lineHeight:    1.1,
                marginBottom:  "1.25rem",
              }}
            >
              Our treatments
            </h1>
            <div className="divider-rose" />
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize:   "1rem",
                color:      "#8B7355",
                lineHeight: 1.8,
                maxWidth:   "520px",
                margin:     "0 auto",
              }}
            >
              Every treatment at Sèvres & Co. is a considered ritual —
              formulated for results, delivered with precision.
            </p>
          </div>
        </section>

        {/* ── Services ── */}
        <section
          style={{
            backgroundColor: "#FAF7F2",
            paddingBottom:   "6rem",
          }}
        >
          <div className="container-sevres">
            <CategoryFilter
              active={activeCategory}
              onChange={setActiveCategory}
            />

            {loading ? (
              <LoadingSpinner message="Loading treatments…" />
            ) : error ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color:      "#8B7355",
                    fontSize:   "0.9375rem",
                  }}
                >
                  Unable to load services. Please try again.
                </p>
              </div>
            ) : services.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color:      "#8B7355",
                    fontSize:   "0.9375rem",
                  }}
                >
                  No services found in this category.
                </p>
              </div>
            ) : (
              <div className="services-grid">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
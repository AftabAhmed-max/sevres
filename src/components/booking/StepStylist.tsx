// src/components/booking/StepStylist.tsx
"use client";

import { useBookingStore } from "@/store/bookingStore";
import { useStylists } from "@/hooks/useBooking";
import InitialsAvatar from "@/components/ui/InitialsAvatar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Check } from "lucide-react";
import type { Stylist } from "@/lib/supabase/types";

export default function StepStylist() {
  const {
    selectedService,
    selectedStylist,
    setStylist,
    nextStep,
    prevStep,
  } = useBookingStore();

  const { stylists, loading, error } = useStylists(selectedService?.id);

  const handleSelect = (stylist: Stylist) => {
    setStylist(stylist);
    setTimeout(() => {
      document.getElementById("booking-continue")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontFamily:   "'Cormorant Garamond', Georgia, serif",
            fontSize:     "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight:   400,
            color:        "#2C1810",
            marginBottom: "0.5rem",
          }}
        >
          Choose your specialist
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "0.9rem",
            color:      "#8B7355",
          }}
        >
          {selectedService
            ? `Booking: ${selectedService.name}`
            : "Select a specialist for your treatment."}
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading specialists…" />
      ) : error ? (
        <p
          style={{
            textAlign:  "center",
            color:      "#8B7355",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Unable to load specialists. Please refresh.
        </p>
      ) : (
        <div
          className="stylist-grid"
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap:                 "1.25rem",
            marginBottom:        "2.5rem",
          }}
        >
          {stylists.map((stylist) => {
            const isSelected = selectedStylist?.id === stylist.id;
            return (
              <button
                key={stylist.id}
                onClick={() => handleSelect(stylist)}
                style={{
                  display:         "flex",
                  alignItems:      "flex-start",
                  gap:             "1rem",
                  textAlign:       "left",
                  backgroundColor: isSelected ? "#2C1810" : "#FFFFFF",
                  border:          `1.5px solid ${isSelected ? "#2C1810" : "rgba(196,149,106,0.15)"}`,
                  borderRadius:    "0.75rem",
                  padding:         "1.5rem",
                  cursor:          "pointer",
                  transition:      "all 0.3s ease",
                  boxShadow:       isSelected
                    ? "0 8px 32px rgba(44,24,16,0.2)"
                    : "0 2px 20px rgba(44,24,16,0.06)",
                  position:        "relative",
                  width:           "100%",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "rgba(196,149,106,0.4)";
                    e.currentTarget.style.boxShadow   = "0 4px 24px rgba(44,24,16,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "rgba(196,149,106,0.15)";
                    e.currentTarget.style.boxShadow   = "0 2px 20px rgba(44,24,16,0.06)";
                  }
                }}
              >
                {/* Check */}
                {isSelected && (
                  <div
                    style={{
                      position:        "absolute",
                      top:             "1rem",
                      right:           "1rem",
                      width:           "22px",
                      height:          "22px",
                      borderRadius:    "9999px",
                      backgroundColor: "#C4956A",
                      display:         "flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                    }}
                  >
                    <Check size={12} color="#FAF7F2" strokeWidth={2.5} />
                  </div>
                )}

                {/* Avatar */}
                <div style={{ flexShrink: 0 }}>
                  <InitialsAvatar name={stylist.name} size={52} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontFamily:   "'Cormorant Garamond', Georgia, serif",
                      fontSize:     "1.1875rem",
                      fontWeight:   400,
                      color:        isSelected ? "#FAF7F2" : "#2C1810",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {stylist.name}
                  </h3>
                  <p
                    style={{
                      fontFamily:    "'DM Sans', sans-serif",
                      fontSize:      "0.6875rem",
                      fontWeight:    500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color:         isSelected ? "rgba(196,149,106,0.8)" : "#C4956A",
                      marginBottom:  "0.625rem",
                    }}
                  >
                    {stylist.specialties.slice(0, 2).join(" · ")}
                  </p>
                  {stylist.bio && (
                    <p
                      style={{
                        fontFamily:          "'DM Sans', sans-serif",
                        fontSize:            "0.8375rem",
                        color:               isSelected ? "rgba(250,247,242,0.6)" : "#8B7355",
                        lineHeight:          1.65,
                        display:             "-webkit-box",
                        WebkitLineClamp:     2,
                        WebkitBoxOrient:     "vertical" as const,
                        overflow:            "hidden",
                      }}
                    >
                      {stylist.bio}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <button onClick={prevStep} className="btn-secondary btn-sm" style={{ flexShrink: 0 }}>
          ← Back
        </button>
        <button
          id="booking-continue"
          onClick={nextStep}
          disabled={!selectedStylist}
          className="btn-primary btn-sm"
          style={{
            opacity:    selectedStylist ? 1 : 0.45,
            cursor:     selectedStylist ? "pointer" : "not-allowed",
            flexShrink: 0,
          }}
        >
          Continue — Pick a Time
        </button>
      </div>
    <style>{`
      @media (max-width: 640px) {
        .stylist-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
    </div>
  );
}
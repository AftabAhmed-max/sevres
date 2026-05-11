// src/components/booking/StepService.tsx
"use client";

import { useBookingStore } from "@/store/bookingStore";
import { useServices } from "@/hooks/useBooking";
import CategoryFilter from "@/components/services/CategoryFilter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatPrice, formatDuration } from "@/lib/time-slots";
import { Clock, Check } from "lucide-react";
import type { Service } from "@/lib/supabase/types";

export default function StepService() {
  const {
    selectedService,
    activeCategory,
    setService,
    setCategory,
    nextStep,
  } = useBookingStore();

  const { services, loading, error } = useServices(activeCategory);

  const handleSelect = (service: Service) => {
    setService(service);
    setTimeout(() => {
      document.getElementById("booking-continue")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleContinue = () => {
    if (selectedService) nextStep();
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
          Choose your treatment
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "0.9rem",
            color:      "#8B7355",
          }}
        >
          Select the service you would like to book.
        </p>
      </div>

      <CategoryFilter active={activeCategory} onChange={setCategory} />

      {loading ? (
        <LoadingSpinner message="Loading treatments…" />
      ) : error ? (
        <p style={{ textAlign: "center", color: "#8B7355", fontFamily: "'DM Sans', sans-serif" }}>
          Unable to load services. Please refresh.
        </p>
      ) : (
        <div className="services-grid" style={{ marginBottom: "2.5rem" }}>
          {services.map((service) => {
            const isSelected = selectedService?.id === service.id;
            return (
              <button
                key={service.id}
                onClick={() => handleSelect(service)}
                style={{
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
                {/* Selected check */}
                {isSelected && (
                  <div
                    style={{
                      position:        "absolute",
                      top:             "1rem",
                      right:           "1rem",
                      width:           "24px",
                      height:          "24px",
                      borderRadius:    "9999px",
                      backgroundColor: "#C4956A",
                      display:         "flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                    }}
                  >
                    <Check size={13} color="#FAF7F2" strokeWidth={2.5} />
                  </div>
                )}

                {/* Category */}
                <span
                  style={{
                    fontFamily:    "'DM Sans', sans-serif",
                    fontSize:      "0.6rem",
                    fontWeight:    500,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color:         isSelected ? "rgba(196,149,106,0.8)" : "#C4956A",
                    display:       "block",
                    marginBottom:  "0.5rem",
                  }}
                >
                  {service.category}
                </span>

                {/* Name */}
                <h3
                  style={{
                    fontFamily:   "'Cormorant Garamond', Georgia, serif",
                    fontSize:     "1.25rem",
                    fontWeight:   400,
                    color:        isSelected ? "#FAF7F2" : "#2C1810",
                    marginBottom: "0.5rem",
                    lineHeight:   1.3,
                  }}
                >
                  {service.name}
                </h3>

                {/* Description */}
                {service.description && (
                  <p
                    style={{
                      fontFamily:   "'DM Sans', sans-serif",
                      fontSize:     "0.8375rem",
                      color:        isSelected ? "rgba(250,247,242,0.65)" : "#8B7355",
                      lineHeight:   1.65,
                      marginBottom: "1rem",
                    }}
                  >
                    {service.description}
                  </p>
                )}

                {/* Footer */}
                <div
                  style={{
                    display:     "flex",
                    alignItems:  "center",
                    gap:         "1rem",
                    paddingTop:  "0.875rem",
                    borderTop:   `1px solid ${isSelected ? "rgba(250,247,242,0.1)" : "rgba(196,149,106,0.1)"}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily:   "'Cormorant Garamond', Georgia, serif",
                      fontSize:     "1.25rem",
                      fontWeight:   500,
                      color:        isSelected ? "#C4956A" : "#2C1810",
                    }}
                  >
                    {formatPrice(service.price)}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Clock size={12} color={isSelected ? "rgba(250,247,242,0.5)" : "#8B7355"} />
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize:   "0.8rem",
                        color:      isSelected ? "rgba(250,247,242,0.5)" : "#8B7355",
                      }}
                    >
                      {formatDuration(service.duration)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Continue */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          id="booking-continue"
          onClick={handleContinue}
          disabled={!selectedService}
          className="btn-primary"
          style={{
            opacity: selectedService ? 1 : 0.45,
            cursor:  selectedService ? "pointer" : "not-allowed",
          }}
        >
          Continue — Select Specialist
        </button>
      </div>
    </div>
  );
}
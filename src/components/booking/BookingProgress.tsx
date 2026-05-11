// src/components/booking/BookingProgress.tsx
"use client";

import { useBookingNavigation } from "@/store/bookingStore";

const STEPS = [
  { number: 1, label: "Service"  },
  { number: 2, label: "Stylist"  },
  { number: 3, label: "Schedule" },
  { number: 4, label: "Confirm"  },
];

export default function BookingProgress() {
  const { currentStep } = useBookingNavigation();

  return (
    <div>
      {/* Step indicators */}
      <div className="step-indicator">
        {STEPS.map((step, index) => (
          <div
            key={step.number}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              className={`step-dot ${
                currentStep === step.number
                  ? "active"
                  : currentStep > step.number
                  ? "completed"
                  : ""
              }`}
            >
              {currentStep > step.number ? (
                // Checkmark for completed steps
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step.number
              )}
            </div>

            {/* Connector line between steps */}
            {index < STEPS.length - 1 && (
              <div
                className={`step-line ${
                  currentStep > step.number ? "completed" : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div
        style={{
          display:   "flex",
          width:     "100%",
          maxWidth:  "400px",
          margin:    "-1.5rem auto 2.5rem",
        }}
      >
        {STEPS.map((step, index) => (
          <div
            key={step.number}
            style={{
              flex:      1,
              textAlign: index === 0 ? "left" : index === STEPS.length - 1 ? "right" : "center",
            }}
          >
            <span
              style={{
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "0.6875rem",
                fontWeight:    500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color:
                  currentStep === step.number
                    ? "#2C1810"
                    : currentStep > step.number
                    ? "#C4956A"
                    : "#8B7355",
                transition: "color 0.3s ease",
              }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
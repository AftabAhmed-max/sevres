// src/components/booking/StepDateTime.tsx
"use client";

import { useState, useEffect } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { useAvailability } from "@/hooks/useBooking";
import TimeSlotGrid from "./TimeSlotGrid";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  getWeekDates,
  getCurrentWeekMonday,
  isSalonClosed,
  isPastDate,
  getTodayString,
  formatDateLabel,
  DAY_LABELS,
} from "@/lib/time-slots";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StepDateTime() {
  const {
    selectedService,
    selectedStylist,
    selectedDate,
    selectedTimeSlot,
    setDate,
    nextStep,
    prevStep,
  } = useBookingStore();

  const [weekStart, setWeekStart] = useState(getCurrentWeekMonday());
  const weekDates                 = getWeekDates(weekStart);

  const { timeSlots, loading, error, refetch } = useAvailability(
    selectedStylist?.id  ?? "",
    selectedDate,
    selectedService?.duration ?? 60
  );

  // Auto-select today if it is not closed or past
  useEffect(() => {
    if (!selectedDate) {
      const today = getTodayString();
      if (!isSalonClosed(today)) {
        setDate(today);
      }
    }
  }, []);                                        // eslint-disable-line react-hooks/exhaustive-deps

  const goToPrevWeek = () => {
    const current = new Date(weekStart + "T00:00:00");
    current.setDate(current.getDate() - 7);
    const y = current.getFullYear();
    const m = (current.getMonth() + 1).toString().padStart(2, "0");
    const d = current.getDate().toString().padStart(2, "0");
    setWeekStart(`${y}-${m}-${d}`);
  };

  const goToNextWeek = () => {
    const current = new Date(weekStart + "T00:00:00");
    current.setDate(current.getDate() + 7);
    const y = current.getFullYear();
    const m = (current.getMonth() + 1).toString().padStart(2, "0");
    const d = current.getDate().toString().padStart(2, "0");
    setWeekStart(`${y}-${m}-${d}`);
  };

  const today            = getTodayString();
  const currentMonday    = getCurrentWeekMonday();
  const isPrevDisabled   = weekStart <= currentMonday;

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
          Choose a date & time
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "0.9rem",
            color:      "#8B7355",
          }}
        >
          {selectedStylist
            ? `with ${selectedStylist.name}`
            : "Select your preferred date and time slot."}
        </p>
      </div>

      {/* ── Weekly Calendar ── */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius:    "0.75rem",
          border:          "1px solid rgba(196,149,106,0.15)",
          padding:         "1.5rem",
          marginBottom:    "1.5rem",
        }}
      >
        {/* Week navigation */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            marginBottom:   "1.25rem",
          }}
        >
          <button
            onClick={goToPrevWeek}
            disabled={isPrevDisabled}
            style={{
              width:           "36px",
              height:          "36px",
              borderRadius:    "9999px",
              border:          "1.5px solid rgba(139,115,85,0.25)",
              backgroundColor: "transparent",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              cursor:          isPrevDisabled ? "not-allowed" : "pointer",
              opacity:         isPrevDisabled ? 0.35 : 1,
              color:           "#2C1810",
              transition:      "all 0.2s ease",
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <span
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.8125rem",
              fontWeight:    500,
              color:         "#2C1810",
              letterSpacing: "0.05em",
            }}
          >
            {new Date(weekStart + "T00:00:00").toLocaleDateString("en-IN", {
              month: "long",
              year:  "numeric",
            })}
          </span>

          <button
            onClick={goToNextWeek}
            style={{
              width:           "36px",
              height:          "36px",
              borderRadius:    "9999px",
              border:          "1.5px solid rgba(139,115,85,0.25)",
              backgroundColor: "transparent",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              cursor:          "pointer",
              color:           "#2C1810",
              transition:      "all 0.2s ease",
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day labels */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap:                 "0.25rem",
            marginBottom:        "0.5rem",
          }}
        >
          {DAY_LABELS.map((label) => (
            <div
              key={label}
              style={{
                textAlign:     "center",
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "0.6875rem",
                fontWeight:    500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:         "#8B7355",
                paddingBottom: "0.5rem",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Day buttons */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap:                 "0.25rem",
          }}
        >
          {weekDates.map((date) => {
            const closed    = isSalonClosed(date);
            const past      = isPastDate(date);
            const disabled  = closed || past;
            const isToday   = date === today;
            const isSelected = date === selectedDate;

            return (
              <button
                key={date}
                onClick={() => !disabled && setDate(date)}
                disabled={disabled}
                className={`calendar-day ${isSelected ? "selected" : ""} ${isToday && !isSelected ? "today" : ""} ${disabled ? "disabled" : ""}`}
                title={
                  closed
                    ? "Closed"
                    : past
                    ? "Past date"
                    : formatDateLabel(date)
                }
              >
                {new Date(date + "T00:00:00").getDate()}
              </button>
            );
          })}
        </div>

        {/* Selected date label */}
        {selectedDate && (
          <div
            style={{
              marginTop:     "1rem",
              paddingTop:    "1rem",
              borderTop:     "1px solid rgba(196,149,106,0.1)",
              textAlign:     "center",
            }}
          >
            <span
              style={{
                fontFamily:  "'DM Sans', sans-serif",
                fontSize:    "0.8125rem",
                color:       "#C4956A",
                fontWeight:  500,
              }}
            >
              {formatDateLabel(selectedDate)}
            </span>
          </div>
        )}
      </div>

      {/* ── Time Slots ── */}
      {selectedDate && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius:    "0.75rem",
            border:          "1px solid rgba(196,149,106,0.15)",
            padding:         "1.5rem",
            marginBottom:    "2rem",
          }}
        >
          <h4
            style={{
              fontFamily:   "'Cormorant Garamond', Georgia, serif",
              fontSize:     "1.25rem",
              fontWeight:   400,
              color:        "#2C1810",
              marginBottom: "1.25rem",
            }}
          >
            Available times
          </h4>

          {loading ? (
            <LoadingSpinner message="Checking availability…" />
          ) : error ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <p
                style={{
                  fontFamily:   "'DM Sans', sans-serif",
                  fontSize:     "0.875rem",
                  color:        "#8B7355",
                  marginBottom: "0.75rem",
                }}
              >
                Unable to load availability.
              </p>
              <button
                onClick={refetch}
                className="btn-ghost btn-sm"
              >
                Try Again
              </button>
            </div>
          ) : (
            <TimeSlotGrid slots={timeSlots} />
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <button onClick={prevStep} className="btn-secondary btn-sm">
          ← Back
        </button>
        <button
          onClick={nextStep}
          disabled={!selectedDate || !selectedTimeSlot}
          className="btn-primary"
          style={{
            opacity:  selectedDate && selectedTimeSlot ? 1 : 0.45,
            cursor:   selectedDate && selectedTimeSlot ? "pointer" : "not-allowed",
            flexGrow: 1,
            maxWidth: "320px",
          }}
        >
          Continue — Review Booking
        </button>
      </div>
    </div>
  );
}
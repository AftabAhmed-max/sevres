// src/components/booking/TimeSlotGrid.tsx
"use client";

import { useBookingStore } from "@/store/bookingStore";
import type { TimeSlot } from "@/lib/time-slots";

interface TimeSlotGridProps {
  slots: TimeSlot[];
}

export default function TimeSlotGrid({ slots }: TimeSlotGridProps) {
  const { selectedTimeSlot, setTimeSlot } = useBookingStore();

  if (slots.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding:   "2rem 0",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "0.9rem",
            color:      "#8B7355",
          }}
        >
          No available slots for this date. Please select another day.
        </p>
      </div>
    );
  }

  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div>
      {/* Availability summary */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          marginBottom:   "1rem",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "0.8125rem",
            color:      "#8B7355",
          }}
        >
          {availableCount} slot{availableCount !== 1 ? "s" : ""} available
        </p>
        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {[
            { color: "#FFFFFF", border: "rgba(139,115,85,0.25)", label: "Available" },
            { color: "#2C1810", border: "#2C1810",               label: "Selected"  },
            { color: "rgba(139,115,85,0.08)", border: "rgba(139,115,85,0.15)", label: "Booked" },
          ].map((item) => (
            <div
              key={item.label}
              style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
            >
              <div
                style={{
                  width:        "12px",
                  height:       "12px",
                  borderRadius: "3px",
                  backgroundColor: item.color,
                  border:       `1.5px solid ${item.border}`,
                  flexShrink:   0,
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize:   "0.7rem",
                  color:      "#8B7355",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Slot grid */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap:                 "0.5rem",
        }}
      >
        {slots.map((slot) => {
          const isSelected = selectedTimeSlot === slot.time;
          return (
            <button
              key={slot.time}
              disabled={!slot.available}
              onClick={() => slot.available && setTimeSlot(slot.time)}
              className={`time-slot ${!slot.available ? "booked" : ""} ${isSelected ? "selected" : ""}`}
            >
              {slot.label}
            </button>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 480px) {
          .time-slot-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
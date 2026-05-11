// src/components/booking/StepConfirm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import { useSubmitBooking } from "@/hooks/useBooking";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatDuration, formatDateLabel, formatTimeLabel } from "@/lib/time-slots";
import { SALON } from "@/lib/constants";
import InitialsAvatar from "@/components/ui/InitialsAvatar";
import { CalendarDays, Clock, User, Scissors, MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function StepConfirm() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const {
    selectedService,
    selectedStylist,
    selectedDate,
    selectedTimeSlot,
    notes,
    setNotes,
    prevStep,
    confirmedBookingId,
    isSubmitting,
    submitError,
  } = useBookingStore();

  const { submitBooking } = useSubmitBooking();

  const handleConfirm = async () => {
    if (!user || !selectedService || !selectedStylist || !selectedDate || !selectedTimeSlot) return;

    const success = await submitBooking({
      service_id:       selectedService.id,
      stylist_id:       selectedStylist.id,
      date:             selectedDate,
      time_slot:        selectedTimeSlot,
      notes:            notes || undefined,
      service_duration: selectedService.duration,
      userId:           user.id,
      userEmail:        user.email ?? "",
      userName:         profile?.full_name ?? user.email ?? "Guest",
    });

    if (success) {
      // Stay on step 4 — show success state
    }
  };

  // ── Success state ──
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (!confirmedBookingId) return;

    const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    const redirect = setTimeout(() => {
      useBookingStore.getState().resetBooking();
      router.push("/book");
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirect);
    };
  }, [confirmedBookingId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (confirmedBookingId) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 0" }}>
        <div
          style={{
            width:           "72px",
            height:          "72px",
            borderRadius:    "9999px",
            backgroundColor: "rgba(196,149,106,0.1)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            margin:          "0 auto 1.5rem",
          }}
        >
          <CheckCircle size={32} color="#C4956A" />
        </div>

        <h2
          style={{
            fontFamily:   "'Cormorant Garamond', Georgia, serif",
            fontSize:     "2.25rem",
            fontWeight:   400,
            color:        "#2C1810",
            marginBottom: "0.75rem",
          }}
        >
          Your booking is pending.
        </h2>

        <div className="divider-rose" />

        <p
          style={{
            fontFamily:   "'DM Sans', sans-serif",
            fontSize:     "0.9375rem",
            color:        "#8B7355",
            lineHeight:   1.75,
            maxWidth:     "440px",
            margin:       "0 auto 0.75rem",
          }}
        >
          Your booking is pending — please check your Account section for
          confirmation status and to manage your booking.
        </p>

        <p
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontSize:      "0.8125rem",
            color:         "#8B7355",
            letterSpacing: "0.05em",
            marginBottom:  "2.5rem",
          }}
        >
          Booking ref: <strong style={{ color: "#C4956A" }}>{confirmedBookingId.slice(0, 8).toUpperCase()}</strong>
        </p>

        {/* Summary pill */}
        <div
          style={{
            display:         "inline-flex",
            flexWrap:        "wrap",
            gap:             "1.5rem",
            backgroundColor: "#FAF7F2",
            borderRadius:    "0.75rem",
            padding:         "1.25rem 2rem",
            marginBottom:    "2rem",
            justifyContent:  "center",
          }}
        >
          {[
            { label: "Service",    value: selectedService?.name       ?? "" },
            { label: "Specialist", value: selectedStylist?.name       ?? "" },
            { label: "Date",       value: formatDateLabel(selectedDate)      },
            { label: "Time",       value: formatTimeLabel(selectedTimeSlot)  },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily:    "'DM Sans', sans-serif",
                  fontSize:      "0.6rem",
                  fontWeight:    500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color:         "#8B7355",
                  marginBottom:  "0.25rem",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize:   "0.875rem",
                  fontWeight: 500,
                  color:      "#2C1810",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <Link href="/account" className="btn-primary">
            Go to My Account
          </Link>
        </div>

        <p
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontSize:      "0.8125rem",
            color:         "#C4956A",
            letterSpacing: "0.04em",
          }}
        >
          Redirecting in {Math.max(countdown, 0)}s
        </p>
      </div>
    );
  }

  // ── Not logged in ──
  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 0" }}>
        <h2
          style={{
            fontFamily:   "'Cormorant Garamond', Georgia, serif",
            fontSize:     "2rem",
            fontWeight:   400,
            color:        "#2C1810",
            marginBottom: "1rem",
          }}
        >
          Sign in to confirm
        </h2>
        <p
          style={{
            fontFamily:   "'DM Sans', sans-serif",
            fontSize:     "0.9375rem",
            color:        "#8B7355",
            lineHeight:   1.75,
            maxWidth:     "380px",
            margin:       "0 auto 2rem",
          }}
        >
          Please sign in or create an account to complete your booking.
          Your selection will be saved.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/auth/login?redirectTo=/book" className="btn-primary">
            Sign In
          </Link>
          <Link href="/auth/register?redirectTo=/book" className="btn-secondary">
            Create Account
          </Link>
        </div>
        <button
          onClick={prevStep}
          style={{
            marginTop:  "1.5rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "0.8125rem",
            color:      "#8B7355",
            background: "none",
            border:     "none",
            cursor:     "pointer",
            display:    "block",
            margin:     "1.5rem auto 0",
          }}
        >
          ← Back to date selection
        </button>
      </div>
    );
  }

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
          Review your booking
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "0.9rem",
            color:      "#8B7355",
          }}
        >
          Please confirm the details below before completing your reservation.
        </p>
      </div>

      {/* Summary card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius:    "0.75rem",
          border:          "1px solid rgba(196,149,106,0.15)",
          overflow:        "hidden",
          marginBottom:    "1.5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#2C1810",
            padding:         "1.25rem 1.5rem",
          }}
        >
          <p
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.6875rem",
              fontWeight:    500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color:         "rgba(250,247,242,0.6)",
            }}
          >
            Booking Summary — Sèvres & Co.
          </p>
        </div>

        {/* Details */}
        <div style={{ padding: "1.5rem" }}>
          {[
            {
              icon:  <Scissors size={15} />,
              label: "Treatment",
              value: selectedService
                ? `${selectedService.name} · ${formatDuration(selectedService.duration)}`
                : "",
              sub: selectedService ? formatPrice(selectedService.price) : "",
            },
            {
              icon:  <User size={15} />,
              label: "Specialist",
              value: selectedStylist?.name ?? "",
              avatar: selectedStylist?.name,
            },
            {
              icon:  <CalendarDays size={15} />,
              label: "Date",
              value: formatDateLabel(selectedDate),
            },
            {
              icon:  <Clock size={15} />,
              label: "Time",
              value: formatTimeLabel(selectedTimeSlot),
            },
            {
              icon:  <MapPin size={15} />,
              label: "Location",
              value: SALON.address.full,
            },
          ].map((item, i) => (
            <div
              key={item.label}
              style={{
                display:       "flex",
                alignItems:    "flex-start",
                gap:           "1rem",
                paddingBottom: i < 4 ? "1.125rem" : 0,
                marginBottom:  i < 4 ? "1.125rem" : 0,
                borderBottom:  i < 4 ? "1px solid rgba(196,149,106,0.1)" : "none",
              }}
            >
              <div
                style={{
                  width:           "34px",
                  height:          "34px",
                  borderRadius:    "9999px",
                  backgroundColor: "rgba(196,149,106,0.1)",
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  color:           "#C4956A",
                  flexShrink:      0,
                }}
              >
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily:    "'DM Sans', sans-serif",
                    fontSize:      "0.6875rem",
                    fontWeight:    500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:         "#8B7355",
                    marginBottom:  "0.2rem",
                  }}
                >
                  {item.label}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {item.avatar && (
                    <InitialsAvatar name={item.avatar} size={22} fontSize={9} />
                  )}
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize:   "0.9375rem",
                      fontWeight: 500,
                      color:      "#2C1810",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
                {item.sub && (
                  <p
                    style={{
                      fontFamily:  "'Cormorant Garamond', Georgia, serif",
                      fontSize:    "1.125rem",
                      color:       "#C4956A",
                      marginTop:   "0.125rem",
                    }}
                  >
                    {item.sub}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label className="label-sevres">
          Special requests or notes (optional)
        </label>
        <textarea
          className="input-sevres"
          rows={3}
          placeholder="Allergies, preferences, or anything we should know…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ resize: "vertical", minHeight: "80px" }}
        />
      </div>

      {/* Error */}
      {submitError && (
        <div
          style={{
            padding:         "0.875rem 1rem",
            backgroundColor: "rgba(196,149,106,0.08)",
            border:          "1px solid rgba(196,149,106,0.25)",
            borderRadius:    "0.5rem",
            marginBottom:    "1.5rem",
          }}
        >
          <p className="error-text" style={{ marginTop: 0 }}>{submitError}</p>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={prevStep} className="btn-secondary btn-sm" disabled={isSubmitting}>
          ← Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="btn-primary"
          style={{
            opacity: isSubmitting ? 0.7 : 1,
            cursor:  isSubmitting ? "not-allowed" : "pointer",
            minWidth: "180px",
          }}
        >
          {isSubmitting ? "Confirming…" : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
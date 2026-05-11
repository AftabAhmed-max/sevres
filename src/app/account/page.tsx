// src/app/account/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthGuard from "@/components/auth/AuthGuard";
import InitialsAvatar from "@/components/ui/InitialsAvatar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { formatDateLabel, formatTimeLabel, formatPrice } from "@/lib/time-slots";
import { CalendarDays, Clock, User, Scissors, XCircle } from "lucide-react";
import type { BookingWithDetails } from "@/lib/supabase/types";

type TabType = "upcoming" | "past" | "cancelled";

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountContent />
    </AuthGuard>
  );
}

function AccountContent() {
  const { user, profile }         = useAuth();
  const [bookings, setBookings]   = useState<BookingWithDetails[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [tab,      setTab]        = useState<TabType>("upcoming");
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [toast,    setToast]      = useState<{ message: string; type: "success" | "error" } | null>(null);

  const supabase = createClient();

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        service:services(id, name, category, duration, price),
        stylist:stylists(id, name, specialties)
      `)
      .eq("user_id", user.id)
      .order("date",      { ascending: false })
      .order("time_slot", { ascending: false });

    if (!error && data) {
      setBookings(data as unknown as BookingWithDetails[]);
    }

    setLoading(false);
  }, [user]);                                    // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (bookingId: string) => {
    setCancelling(bookingId);

    try {
      const res  = await fetch("/api/bookings", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ booking_id: bookingId }),
      });
      const json = await res.json();

      if (!json.success) {
        setToast({ message: json.error ?? "Failed to cancel booking.", type: "error" });
        return;
      }

      setToast({ message: "Booking cancelled successfully.", type: "success" });
      await fetchBookings();
    } catch {
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setCancelling(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const filteredBookings = bookings.filter((b) => {
    if (tab === "upcoming")  return b.date >= today && b.status !== "cancelled";
    if (tab === "past")      return b.date <  today && b.status !== "cancelled";
    if (tab === "cancelled") return b.status === "cancelled";
    return true;
  });

  const STATUS_COLORS: Record<string, string> = {
    pending:   "#8B7355",
    confirmed: "#B8965A",
    cancelled: "#8B7355",
  };

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight:       "100svh",
          backgroundColor: "#FAF7F2",
          paddingTop:      "8rem",
          paddingBottom:   "6rem",
        }}
      >
        <div className="container-sevres">
          {/* Header */}
          <div style={{ marginBottom: "3rem" }}>
            <span className="eyebrow">Your Account</span>
            <div
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                flexWrap:       "wrap",
                gap:            "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <InitialsAvatar name={profile?.full_name ?? user?.email ?? "U"} size={52} />
                <div>
                  <h1
                    style={{
                      fontFamily:   "'Cormorant Garamond', Georgia, serif",
                      fontSize:     "clamp(1.75rem, 3vw, 2.75rem)",
                      fontWeight:   400,
                      color:        "#2C1810",
                      lineHeight:   1.15,
                    }}
                  >
                    {profile?.full_name ?? "My Account"}
                  </h1>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize:   "0.875rem",
                      color:      "#8B7355",
                    }}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>

              <a href="/book" className="btn-primary btn-sm">
                Book Again
              </a>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="tabs-scroll"
            style={{
              display:      "flex",
              gap:          "0.25rem",
              marginBottom: "2rem",
              borderBottom: "1px solid rgba(196,149,106,0.15)",
            }}
          >
            {(["upcoming", "past", "cancelled"] as TabType[]).map((t) => {
              const count = bookings.filter((b) => {
                if (t === "upcoming")  return b.date >= today && b.status !== "cancelled";
                if (t === "past")      return b.date <  today && b.status !== "cancelled";
                if (t === "cancelled") return b.status === "cancelled";
                return false;
              }).length;

              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    fontFamily:      "'DM Sans', sans-serif",
                    fontSize:        "0.875rem",
                    fontWeight:      tab === t ? 500 : 400,
                    color:           tab === t ? "#2C1810" : "#8B7355",
                    padding:         "0.75rem 1.25rem",
                    background:      "none",
                    border:          "none",
                    borderBottom:    tab === t ? "2px solid #C4956A" : "2px solid transparent",
                    cursor:          "pointer",
                    transition:      "all 0.25s ease",
                    textTransform:   "capitalize",
                    display:         "flex",
                    alignItems:      "center",
                    gap:             "0.5rem",
                    flexShrink:      0,
                  }}
                >
                  {t}
                  <span
                    style={{
                      fontFamily:      "'DM Sans', sans-serif",
                      fontSize:        "0.6875rem",
                      fontWeight:      500,
                      backgroundColor: tab === t ? "rgba(196,149,106,0.15)" : "rgba(139,115,85,0.1)",
                      color:           tab === t ? "#C4956A" : "#8B7355",
                      borderRadius:    "9999px",
                      padding:         "0.1rem 0.5rem",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ padding: "4rem 0" }}>
              <LoadingSpinner message="Loading your bookings…" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div
              style={{
                textAlign:       "center",
                padding:         "5rem 2rem",
                backgroundColor: "#FFFFFF",
                borderRadius:    "0.75rem",
                border:          "1px solid rgba(196,149,106,0.12)",
              }}
            >
              <p
                style={{
                  fontFamily:   "'Cormorant Garamond', Georgia, serif",
                  fontSize:     "1.5rem",
                  fontWeight:   400,
                  color:        "#2C1810",
                  marginBottom: "0.75rem",
                }}
              >
                {tab === "upcoming"
                  ? "No upcoming bookings."
                  : tab === "past"
                  ? "No past bookings."
                  : "No cancelled bookings."}
              </p>
              <p
                style={{
                  fontFamily:   "'DM Sans', sans-serif",
                  fontSize:     "0.9rem",
                  color:        "#8B7355",
                  marginBottom: "1.5rem",
                }}
              >
                {tab === "upcoming"
                  ? "Ready to book your next ritual?"
                  : "Your booking history will appear here."}
              </p>
              {tab === "upcoming" && (
                <a href="/book" className="btn-primary btn-sm">
                  Book a Treatment
                </a>
              )}
            </div>
          ) : (
            <div
              style={{
                display:       "flex",
                flexDirection: "column",
                gap:           "1rem",
              }}
            >
              {filteredBookings.map((booking) => {
                const isPast      = booking.date < today;
                const isCancelled = booking.status === "cancelled";
                const canCancel   = !isPast && !isCancelled;

                return (
                  <div
                    key={booking.id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius:    "0.75rem",
                      border:          `1px solid ${isCancelled ? "rgba(139,115,85,0.1)" : "rgba(196,149,106,0.15)"}`,
                      boxShadow:       "0 2px 20px rgba(44,24,16,0.05)",
                      padding:         "1.5rem",
                      opacity:         isCancelled ? 0.75 : 1,
                    }}
                  >
                    <div
                      style={{
                        display:        "flex",
                        alignItems:     "flex-start",
                        justifyContent: "space-between",
                        gap:            "1rem",
                        flexWrap:       "wrap",
                      }}
                    >
                      {/* Left: details */}
                      <div style={{ flex: 1, minWidth: "240px" }}>
                        {/* Service name + status */}
                        <div
                          style={{
                            display:      "flex",
                            alignItems:   "center",
                            gap:          "0.75rem",
                            marginBottom: "0.875rem",
                            flexWrap:     "wrap",
                          }}
                        >
                          <h2
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize:   "1.375rem",
                              fontWeight: 400,
                              color:      "#2C1810",
                            }}
                          >
                            {booking.service?.name ?? "Service"}
                          </h2>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: `${STATUS_COLORS[booking.status]}18`,
                              color:           STATUS_COLORS[booking.status],
                              textDecoration:  isCancelled ? "line-through" : "none",
                            }}
                          >
                            {booking.status}
                          </span>
                        </div>

                        {/* Meta */}
                        <div
                          style={{
                            display:   "flex",
                            flexWrap:  "wrap",
                            gap:       "1rem",
                            rowGap:    "0.5rem",
                          }}
                        >
                          {[
                            {
                              icon:  <CalendarDays size={13} />,
                              text:  formatDateLabel(booking.date),
                            },
                            {
                              icon:  <Clock size={13} />,
                              text:  formatTimeLabel(booking.time_slot),
                            },
                            {
                              icon:  <User size={13} />,
                              text:  booking.stylist?.name ?? "Specialist",
                            },
                            {
                              icon:  <Scissors size={13} />,
                              text:  booking.service
                                ? formatPrice(booking.service.price)
                                : "",
                            },
                          ].map((item, i) => (
                            <div
                              key={i}
                              style={{
                                display:    "flex",
                                alignItems: "center",
                                gap:        "0.375rem",
                                color:      "#8B7355",
                              }}
                            >
                              <span style={{ color: "#C4956A", flexShrink: 0 }}>
                                {item.icon}
                              </span>
                              <span
                                style={{
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize:   "0.875rem",
                                  color:      "#8B7355",
                                }}
                              >
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Notes */}
                        {booking.notes && (
                          <p
                            style={{
                              fontFamily:   "'DM Sans', sans-serif",
                              fontSize:     "0.8375rem",
                              color:        "#8B7355",
                              fontStyle:    "italic",
                              marginTop:    "0.75rem",
                              paddingTop:   "0.75rem",
                              borderTop:    "1px solid rgba(196,149,106,0.1)",
                            }}
                          >
                            Note: {booking.notes}
                          </p>
                        )}
                      </div>

                      {/* Right: stylist avatar + cancel */}
                      <div
                        style={{
                          display:        "flex",
                          flexDirection:  "column",
                          alignItems:     "flex-end",
                          gap:            "1rem",
                        }}
                      >
                        <InitialsAvatar
                          name={booking.stylist?.name ?? "S"}
                          size={44}
                        />

                        {canCancel && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancelling === booking.id}
                            style={{
                              display:         "inline-flex",
                              alignItems:      "center",
                              gap:             "0.375rem",
                              fontFamily:      "'DM Sans', sans-serif",
                              fontSize:        "0.75rem",
                              fontWeight:      500,
                              letterSpacing:   "0.08em",
                              textTransform:   "uppercase",
                              color:           "#8B7355",
                              background:      "none",
                              border:          "1.5px solid rgba(139,115,85,0.25)",
                              borderRadius:    "9999px",
                              padding:         "0.5rem 1rem",
                              cursor:          cancelling === booking.id ? "not-allowed" : "pointer",
                              opacity:         cancelling === booking.id ? 0.6 : 1,
                              transition:      "all 0.25s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#C4956A";
                              e.currentTarget.style.color       = "#C4956A";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "rgba(139,115,85,0.25)";
                              e.currentTarget.style.color       = "#8B7355";
                            }}
                          >
                            <XCircle size={13} />
                            {cancelling === booking.id ? "Cancelling…" : "Cancel"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

// src/app/admin/bookings/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminSession } from "@/lib/admin-auth";
import BookingsTable from "@/components/admin/BookingsTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { BookingWithDetails } from "@/lib/supabase/types";

export default function AdminBookingsPage() {
  const [bookings,   setBookings]   = useState<BookingWithDetails[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filterDate, setFilterDate] = useState("");

  const getAuthHeader = (): string => {
    const session = getAdminSession();
    if (!session) return "";
    return `Bearer ${btoa(JSON.stringify(session))}`;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.set("date", filterDate);

      const res  = await fetch(`/api/admin/bookings${params.toString() ? `?${params}` : ""}`, {
        headers: { Authorization: getAuthHeader() },
      });
      const json = await res.json();
      if (json.success) setBookings(json.data);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, [filterDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <span
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontSize:      "0.6875rem",
            fontWeight:    500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color:         "#C4956A",
            display:       "block",
            marginBottom:  "0.5rem",
          }}
        >
          Manage
        </span>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize:   "clamp(1.75rem, 3vw, 2.75rem)",
            fontWeight: 400,
            color:      "#2C1810",
            lineHeight: 1.15,
          }}
        >
          Bookings
        </h1>
      </div>

      {/* Date filter */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span
              style={{
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "0.6875rem",
                fontWeight:    500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color:         "#8B7355",
              }}
            >
              Filter by date
            </span>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="input-sevres"
              style={{ width: "auto", padding: "0.5rem 0.875rem", fontSize: "0.875rem" }}
            />
          </label>
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="btn-secondary btn-sm"
              style={{ alignSelf: "flex-end" }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: "4rem 0" }}>
          <LoadingSpinner message="Loading bookings…" />
        </div>
      ) : (
        <BookingsTable bookings={bookings} onRefresh={fetchData} />
      )}
    </div>
  );
}
// src/components/admin/BookingsTable.tsx
"use client";

import { useState } from "react";
import InitialsAvatar from "@/components/ui/InitialsAvatar";
import Toast from "@/components/ui/Toast";
import { formatDateLabel, formatTimeLabel, formatPrice } from "@/lib/time-slots";
import { CheckCircle, XCircle, ChevronUp, ChevronDown } from "lucide-react";
import type { BookingWithDetails, BookingStatus } from "@/lib/supabase/types";
import { getAdminSession } from "@/lib/admin-auth";

interface BookingsTableProps {
  bookings:  BookingWithDetails[];
  onRefresh: () => Promise<void>;
}

type SortKey = "date" | "status" | "service" | "stylist";
type SortDir = "asc" | "desc";

const STATUS_STYLES: Record<BookingStatus, { bg: string; color: string }> = {
  pending:   { bg: "rgba(139,115,85,0.1)",  color: "#8B7355" },
  confirmed: { bg: "rgba(184,150,90,0.12)", color: "#B8965A" },
  cancelled: { bg: "rgba(44,24,16,0.07)",   color: "#8B7355" },
};

export default function BookingsTable({ bookings, onRefresh }: BookingsTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [toast,    setToast]    = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [sortKey,  setSortKey]  = useState<SortKey>("date");
  const [sortDir,  setSortDir]  = useState<SortDir>("desc");
  const [search,   setSearch]   = useState("");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const updateStatus = async (bookingId: string, status: BookingStatus) => {
    setUpdating(bookingId);
    try {
      const session = getAdminSession();
      const authHeader = session ? `Bearer ${btoa(JSON.stringify(session))}` : "";
      const res  = await fetch("/api/admin/bookings", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body:    JSON.stringify({ booking_id: bookingId, status }),
      });
      const json = await res.json();

      if (!json.success) {
        setToast({ message: json.error ?? "Update failed.", type: "error" });
        return;
      }

      setToast({
        message: `Booking ${status === "confirmed" ? "confirmed" : "cancelled"} successfully.`,
        type:    "success",
      });
      await onRefresh();
    } catch {
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setUpdating(null);
    }
  };

  // Filter
  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.guest_name?.toLowerCase().includes(q)         ||
      b.profile?.full_name?.toLowerCase().includes(q) ||
      b.profile?.email?.toLowerCase().includes(q)     ||
      b.service?.name?.toLowerCase().includes(q)      ||
      b.stylist?.name?.toLowerCase().includes(q)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let valA = "";
    let valB = "";

    if (sortKey === "date")    { valA = `${a.date} ${a.time_slot}`; valB = `${b.date} ${b.time_slot}`; }
    if (sortKey === "status")  { valA = a.status;                   valB = b.status; }
    if (sortKey === "service") { valA = a.service?.name ?? "";      valB = b.service?.name ?? ""; }
    if (sortKey === "stylist") { valA = a.stylist?.name ?? "";      valB = b.stylist?.name ?? ""; }

    return sortDir === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? (
        <ChevronUp size={12} />
      ) : (
        <ChevronDown size={12} />
      )
    ) : (
      <ChevronDown size={12} style={{ opacity: 0.3 }} />
    );

  return (
    <>
      {/* Search */}
      <div style={{ marginBottom: "1.25rem" }}>
        <input
          className="input-sevres"
          type="text"
          placeholder="Search by name, email, service, or stylist…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "420px" }}
        />
      </div>

      {/* Table wrapper */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius:    "0.75rem",
          border:          "1px solid rgba(196,149,106,0.12)",
          overflow:        "hidden",
          width:           "100%",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                {/* Guest */}
                <th style={{ minWidth: "180px" }}>Guest</th>

                {/* Service — sortable */}
                <th
                  style={{ cursor: "pointer", minWidth: "160px" }}
                  onClick={() => handleSort("service")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    Service <SortIcon col="service" />
                  </div>
                </th>

                {/* Stylist — sortable */}
                <th
                  style={{ cursor: "pointer", minWidth: "140px" }}
                  onClick={() => handleSort("stylist")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    Specialist <SortIcon col="stylist" />
                  </div>
                </th>

                {/* Date — sortable */}
                <th
                  style={{ cursor: "pointer", minWidth: "180px" }}
                  onClick={() => handleSort("date")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    Date & Time <SortIcon col="date" />
                  </div>
                </th>

                {/* Price */}
                <th style={{ minWidth: "80px" }}>Price</th>

                {/* Status — sortable */}
                <th
                  style={{ cursor: "pointer", minWidth: "110px" }}
                  onClick={() => handleSort("status")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    Status <SortIcon col="status" />
                  </div>
                </th>

                {/* Actions */}
                <th style={{ minWidth: "120px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "3rem", color: "#8B7355" }}
                  >
                    {search ? "No bookings match your search." : "No bookings found."}
                  </td>
                </tr>
              ) : (
                sorted.map((booking) => {
                  const style     = STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending;
                  const isUpdating = updating === booking.id;

                  return (
                    <tr key={booking.id}>
                      {/* Guest */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                          <InitialsAvatar
                            name={booking.guest_name ?? booking.profile?.full_name ?? "Guest"}
                            size={32}
                          />
                          <div>
                            <p
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize:   "0.875rem",
                                fontWeight: 500,
                                color:      "#2C1810",
                                lineHeight: 1.3,
                              }}
                            >
                              {booking.guest_name ?? booking.profile?.full_name ?? "Guest"}
                            </p>
                            <p
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize:   "0.75rem",
                                color:      "#8B7355",
                              }}
                            >
                              {booking.profile?.email ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td>
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize:   "0.875rem",
                            color:      "#2C1810",
                            fontWeight: 500,
                          }}
                        >
                          {booking.service?.name ?? "—"}
                        </p>
                        <p
                          style={{
                            fontFamily:    "'DM Sans', sans-serif",
                            fontSize:      "0.75rem",
                            color:         "#C4956A",
                            textTransform: "capitalize",
                          }}
                        >
                          {booking.service?.category ?? ""}
                        </p>
                      </td>

                      {/* Stylist */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <InitialsAvatar
                            name={booking.stylist?.name ?? "S"}
                            size={28}
                          />
                          <span
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize:   "0.875rem",
                              color:      "#2C1810",
                            }}
                          >
                            {booking.stylist?.name ?? "—"}
                          </span>
                        </div>
                      </td>

                      {/* Date & time */}
                      <td>
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize:   "0.875rem",
                            color:      "#2C1810",
                            fontWeight: 500,
                          }}
                        >
                          {formatDateLabel(booking.date)}
                        </p>
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize:   "0.75rem",
                            color:      "#8B7355",
                          }}
                        >
                          {formatTimeLabel(booking.time_slot)}
                        </p>
                      </td>

                      {/* Price */}
                      <td>
                        <span
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize:   "1.0625rem",
                            fontWeight: 500,
                            color:      "#2C1810",
                          }}
                        >
                          {booking.service ? formatPrice(booking.service.price) : "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: style.bg,
                            color:           style.color,
                            textDecoration:  booking.status === "cancelled" ? "line-through" : "none",
                          }}
                        >
                          {booking.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        {booking.status === "cancelled" ? (
                          <span
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize:   "0.75rem",
                              color:      "#8B7355",
                              fontStyle:  "italic",
                            }}
                          >
                            Cancelled
                          </span>
                        ) : (
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {booking.status !== "confirmed" && (
                              <button
                                onClick={() => updateStatus(booking.id, "confirmed")}
                                disabled={isUpdating}
                                title="Confirm booking"
                                style={{
                                  display:         "flex",
                                  alignItems:      "center",
                                  justifyContent:  "center",
                                  width:           "30px",
                                  height:          "30px",
                                  borderRadius:    "9999px",
                                  border:          "1.5px solid rgba(184,150,90,0.3)",
                                  backgroundColor: "transparent",
                                  color:           "#B8965A",
                                  cursor:          isUpdating ? "not-allowed" : "pointer",
                                  opacity:         isUpdating ? 0.5 : 1,
                                  transition:      "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "rgba(184,150,90,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                }}
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => updateStatus(booking.id, "cancelled")}
                              disabled={isUpdating}
                              title="Cancel booking"
                              style={{
                                display:         "flex",
                                alignItems:      "center",
                                justifyContent:  "center",
                                width:           "30px",
                                height:          "30px",
                                borderRadius:    "9999px",
                                border:          "1.5px solid rgba(139,115,85,0.25)",
                                backgroundColor: "transparent",
                                color:           "#8B7355",
                                cursor:          isUpdating ? "not-allowed" : "pointer",
                                opacity:         isUpdating ? 0.5 : 1,
                                transition:      "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(139,115,85,0.08)";
                                e.currentTarget.style.color           = "#C4956A";
                                e.currentTarget.style.borderColor     = "rgba(196,149,106,0.3)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color           = "#8B7355";
                                e.currentTarget.style.borderColor     = "rgba(139,115,85,0.25)";
                              }}
                            >
                              <XCircle size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding:        "0.875rem 1rem",
            borderTop:      "1px solid rgba(196,149,106,0.1)",
            backgroundColor: "#FAF7F2",
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   "0.8125rem",
              color:      "#8B7355",
            }}
          >
            {sorted.length} booking{sorted.length !== 1 ? "s" : ""}
            {search ? ` matching "${search}"` : ""}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize:   "0.8125rem",
                color:      "#C4956A",
                background: "none",
                border:     "none",
                cursor:     "pointer",
              }}
            >
              Clear search
            </button>
          )}
        </div>
      </div>

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
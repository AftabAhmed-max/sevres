// src/app/admin/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import { isAdminAuthenticated, getAdminSession } from "@/lib/admin-auth";
import StatCard from "@/components/admin/StatCard";
import BookingsTable from "@/components/admin/BookingsTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatPrice } from "@/lib/time-slots";
import type { BookingWithDetails, DashboardStats } from "@/lib/supabase/types";

// ─────────────────────────────────────────────
// LOGIN PAGE (shown when not authenticated)
// ─────────────────────────────────────────────

function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const { login, loading }      = useAdmin();
  const router                  = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    const result = await login({ username, password });

    if (!result.success) {
      setError(result.error ?? "Invalid credentials.");
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <div
      style={{
        minHeight:       "100svh",
        backgroundColor: "#2C1810",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "2rem",
      }}
    >
      <div
        style={{
          width:           "100%",
          maxWidth:        "400px",
          backgroundColor: "#FAF7F2",
          borderRadius:    "1rem",
          padding:         "3rem 2.5rem",
          boxShadow:       "0 24px 80px rgba(0,0,0,0.3)",
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily:    "'Cormorant Garamond', Georgia, serif",
              fontSize:      "1.75rem",
              fontWeight:    300,
              color:         "#2C1810",
              letterSpacing: "0.08em",
              marginBottom:  "0.25rem",
            }}
          >
            Sèvres & Co.
          </p>
          <p
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.6875rem",
              fontWeight:    500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color:         "#C4956A",
            }}
          >
            Admin Access
          </p>
        </div>

        {/* Divider */}
        <div className="divider-rose" style={{ marginBottom: "2rem" }} />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div>
            <label className="label-sevres">Username</label>
            <input
              className="input-sevres"
              type="text"
              placeholder="Admin username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(null); }}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="label-sevres">Password</label>
            <input
              className="input-sevres"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div
              style={{
                padding:         "0.875rem 1rem",
                backgroundColor: "rgba(196,149,106,0.08)",
                border:          "1px solid rgba(196,149,106,0.25)",
                borderRadius:    "0.5rem",
              }}
            >
              <p className="error-text" style={{ marginTop: 0 }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width:     "100%",
              opacity:   loading ? 0.7 : 1,
              cursor:    loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <a  
            href="/"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   "0.8125rem",
              color:      "#8B7355",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C4956A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8B7355")}
          >
            ← Return to site
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD PAGE (shown when authenticated)
// ─────────────────────────────────────────────

function AdminDashboard() {
  const [bookings,    setBookings]    = useState<BookingWithDetails[]>([]);
  const [stats,       setStats]       = useState<DashboardStats | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [filterDate,  setFilterDate]  = useState<string>("");

  // Build auth header from localStorage session
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

      const res = await fetch(`/api/admin/bookings${params.toString() ? `?${params}` : ""}`, {
        headers: { Authorization: getAuthHeader() },
      });
      const json = await res.json();

      if (json.success) {
        const all: BookingWithDetails[] = json.data;
        setBookings(all);

        // Compute stats client-side
        const now       = new Date();
        const todayStr  = now.toISOString().split("T")[0];

        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekStr   = weekStart.toISOString().split("T")[0];

        const monthStr  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        const confirmed = all.filter((b) => b.status !== "cancelled");

        setStats({
          bookings_today:      confirmed.filter((b) => b.date === todayStr).length,
          bookings_this_week:  confirmed.filter((b) => b.date >= weekStr).length,
          bookings_this_month: confirmed.filter((b) => b.date.startsWith(monthStr)).length,
          revenue_this_month:  confirmed
            .filter((b) => b.date.startsWith(monthStr) && b.status === "confirmed")
            .reduce((sum, b) => sum + (b.service?.price ?? 0), 0),
        });
      }
    } catch {
      // fail silently — table shows empty state
    } finally {
      setLoading(false);
    }
  }, []);                                        // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData, filterDate]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Overview</span>
        <h1
          style={{
            fontFamily:   "'Cormorant Garamond', Georgia, serif",
            fontSize:     "clamp(1.75rem, 3vw, 2.75rem)",
            fontWeight:   400,
            color:        "#2C1810",
            lineHeight:   1.15,
          }}
        >
          Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      <div
        className="stats-grid"
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap:                 "1.25rem",
          marginBottom:        "3rem",
        }}
      >
        <StatCard
          label="Bookings Today"
          value={stats?.bookings_today      ?? "—"}
          accent
        />
        <StatCard
          label="This Week"
          value={stats?.bookings_this_week  ?? "—"}
        />
        <StatCard
          label="This Month"
          value={stats?.bookings_this_month ?? "—"}
        />
        <StatCard
          label="Revenue (Month)"
          value={stats ? formatPrice(stats.revenue_this_month) : "—"}
          subLabel="Confirmed bookings only"
        />
      </div>

      {/* Bookings table */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize:   "1.75rem",
            fontWeight: 400,
            color:      "#2C1810",
          }}
        >
          All Bookings
        </h2>
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
              style={{ whiteSpace: "nowrap", alignSelf: "flex-end" }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "4rem 0" }}>
          <LoadingSpinner message="Loading bookings…" />
        </div>
      ) : (
        <BookingsTable bookings={bookings} onRefresh={fetchData} />
      )}

      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT ADMIN PAGE — routes between login/dashboard
// ─────────────────────────────────────────────

export default function AdminPage() {
  const [initialized, setInitialized] = useState(false);
  const [authed,      setAuthed]      = useState(false);

  useEffect(() => {
    setAuthed(isAdminAuthenticated());
    setInitialized(true);
  }, []);

  if (!initialized) {
    return (
      <div
        style={{
          minHeight:       "100svh",
          backgroundColor: "#FAF7F2",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return authed ? <AdminDashboard /> : <AdminLoginPage />;
}
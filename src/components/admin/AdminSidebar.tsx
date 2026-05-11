// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import {
  LayoutDashboard,
  Scissors,
  Users,
  LogOut,
  CalendarDays,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin",           icon: <LayoutDashboard size={16} /> },
  { label: "Bookings",  href: "/admin/bookings",   icon: <CalendarDays    size={16} /> },
  { label: "Services",  href: "/admin/services",   icon: <Scissors        size={16} /> },
  { label: "Stylists",  href: "/admin/stylists",   icon: <Users           size={16} /> },
];

export default function AdminSidebar() {
  const pathname          = usePathname();
  const { logout, username, remainingMinutes } = useAdmin();

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p
          style={{
            fontFamily:    "'Cormorant Garamond', Georgia, serif",
            fontSize:      "1.375rem",
            fontWeight:    300,
            color:         "#FAF7F2",
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
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color:         "rgba(196,149,106,0.7)",
          }}
        >
          Admin Panel
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height:       "1px",
          background:   "linear-gradient(to right, rgba(196,149,106,0.3), transparent)",
          marginBottom: "2rem",
        }}
      />

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-link ${isActive(item.href) ? "active" : ""}`}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
        {/* Session info */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            borderRadius:    "0.5rem",
            padding:         "0.875rem",
            marginBottom:    "0.75rem",
          }}
        >
          <p
            style={{
              fontFamily:   "'DM Sans', sans-serif",
              fontSize:     "0.8125rem",
              fontWeight:   500,
              color:        "#FAF7F2",
              marginBottom: "0.25rem",
            }}
          >
            {username ?? "Admin"}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   "0.75rem",
              color:      "rgba(250,247,242,0.4)",
            }}
          >
            Session: {remainingMinutes}m remaining
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="admin-nav-link"
          style={{ width: "100%", color: "rgba(196,149,106,0.7)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C4956A")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(196,149,106,0.7)")}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
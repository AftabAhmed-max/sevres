// src/app/admin/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated, refreshAdminSession } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { LayoutDashboard, Scissors, Users, CalendarDays, LogOut } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

const MOBILE_NAV = [
  { label: "Dashboard", href: "/admin",          icon: <LayoutDashboard size={20} /> },
  { label: "Bookings",  href: "/admin/bookings",  icon: <CalendarDays    size={20} /> },
  { label: "Services",  href: "/admin/services",  icon: <Scissors        size={20} /> },
  { label: "Stylists",  href: "/admin/stylists",  icon: <Users           size={20} /> },
];

function AdminMobileBar() {
  const pathname = usePathname();
  const { logout } = useAdmin();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="admin-mobile-bar">
      <span
        style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "1.125rem",
          fontWeight:    300,
          color:         "#FAF7F2",
          letterSpacing: "0.06em",
        }}
      >
        Sèvres Admin
      </span>
      <div style={{ display: "flex", alignItems: "center" }}>
        {MOBILE_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`admin-mobile-icon${isActive(item.href) ? " active" : ""}`}
          >
            {item.icon}
          </Link>
        ))}
        <button
          onClick={logout}
          title="Sign out"
          className="admin-mobile-icon"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAdminAuthenticated() && pathname !== "/admin") {
      router.replace("/admin");
    } else if (isAdminAuthenticated()) {
      refreshAdminSession();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (pathname === "/admin" && !isAdminAuthenticated()) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100svh" }}>
      <AdminSidebar />
      <div className="admin-body">
        <AdminMobileBar />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}

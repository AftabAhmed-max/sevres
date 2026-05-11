// src/components/auth/AuthGuard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AuthGuardProps {
  children:    React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  redirectTo = "/auth/login",
}: AuthGuardProps) {
  const { user, initialized } = useAuth();
  const router                = useRouter();

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      const current = window.location.pathname;
      router.push(`${redirectTo}?redirectTo=${encodeURIComponent(current)}`);
    }
  }, [user, initialized, router, redirectTo]);

  // Show nothing until auth is confirmed
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
        <LoadingSpinner message="Loading your profile..." />
      </div>
    );
  }

  // Render nothing while redirect is happening
  if (!user) return null;

  return <>{children}</>;
}
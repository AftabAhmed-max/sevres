// src/hooks/useAdmin.ts
// Admin session hook — manages hardcoded admin auth
// Separate from Supabase Auth entirely
// Reads/writes session from localStorage via admin-auth.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAdminSession,
  isAdminAuthenticated,
  saveAdminSession,
  clearAdminSession,
  refreshAdminSession,
  getAdminUsername,
  getSessionRemainingMinutes,
} from "@/lib/admin-auth";
import type { AdminSession } from "@/lib/supabase/types";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface AdminLoginCredentials {
  username: string;
  password: string;
}

export interface AdminLoginResult {
  success: boolean;
  error?:  string;
}

export interface UseAdminReturn {
  // State
  session:           AdminSession | null;
  isAuthenticated:   boolean;
  username:          string | null;
  remainingMinutes:  number;
  loading:           boolean;
  initialized:       boolean;

  // Actions
  login:             (credentials: AdminLoginCredentials) => Promise<AdminLoginResult>;
  logout:            () => void;
  requireAuth:       () => boolean;
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useAdmin(): UseAdminReturn {
  const [session,          setSession]          = useState<AdminSession | null>(null);
  const [isAuthenticated,  setIsAuthenticated]  = useState(false);
  const [username,         setUsername]         = useState<string | null>(null);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [loading,          setLoading]          = useState(false);
  const [initialized,      setInitialized]      = useState(false);

  const router = useRouter();

  // ── Sync state from localStorage ──

  const syncSession = useCallback(() => {
    const currentSession = getAdminSession();
    const authenticated  = isAdminAuthenticated();
    const name           = getAdminUsername();
    const remaining      = getSessionRemainingMinutes();

    setSession(currentSession);
    setIsAuthenticated(authenticated);
    setUsername(name);
    setRemainingMinutes(remaining);
  }, []);

  // ── Initialise on mount ──

  useEffect(() => {
    syncSession();
    setInitialized(true);
  }, [syncSession]);

  // ── Refresh session timer every minute ──
  // Updates remaining time display and
  // extends session expiry on activity

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      // If session has expired, clear and redirect
      if (!isAdminAuthenticated()) {
        clearAdminSession();
        setSession(null);
        setIsAuthenticated(false);
        setUsername(null);
        setRemainingMinutes(0);
        router.push("/admin");
        return;
      }

      // Refresh expiry and sync display
      refreshAdminSession();
      syncSession();
    }, 60_000); // every 60 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, router, syncSession]);

  // ─────────────────────────────────────────────
  // LOGIN
  // Calls the /api/admin/login route handler
  // which verifies credentials server-side
  // against env vars — never in the browser
  // ─────────────────────────────────────────────

  const login = useCallback(
    async (credentials: AdminLoginCredentials): Promise<AdminLoginResult> => {
      setLoading(true);

      try {
        const res = await fetch("/api/admin/login", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            username: credentials.username.trim(),
            password: credentials.password,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          return {
            success: false,
            error:   json.error ?? "Invalid credentials. Please try again.",
          };
        }

        // Save session to localStorage
        saveAdminSession(credentials.username.trim());

        // Sync hook state
        syncSession();

        return { success: true };
      } catch {
        return {
          success: false,
          error:   "An unexpected error occurred. Please try again.",
        };
      } finally {
        setLoading(false);
      }
    },
    [syncSession]
  );

  // ─────────────────────────────────────────────
  // LOGOUT
  // Clears localStorage session and redirects
  // to admin login page
  // ─────────────────────────────────────────────

  const logout = useCallback(() => {
    clearAdminSession();
    setSession(null);
    setIsAuthenticated(false);
    setUsername(null);
    setRemainingMinutes(0);
    window.location.href = "/admin";
  }, [router]);

  // ─────────────────────────────────────────────
  // REQUIRE AUTH
  // Call at the top of any admin page to
  // redirect unauthenticated visitors
  // Returns true if authenticated, false if not
  // (redirect happens automatically)
  // ─────────────────────────────────────────────

  const requireAuth = useCallback((): boolean => {
    if (!initialized) return false;

    if (!isAdminAuthenticated()) {
      window.location.href = "/admin";
      return false;
    }

    // Refresh session on each page navigation
    refreshAdminSession();
    syncSession();

    return true;
  }, [initialized, router, syncSession]);

  return {
    session,
    isAuthenticated,
    username,
    remainingMinutes,
    loading,
    initialized,
    login,
    logout,
    requireAuth,
  };
}
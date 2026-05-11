// src/lib/admin-auth.ts
// Hardcoded admin authentication — completely separate from Supabase Auth
// Admin credentials are stored in environment variables
// Session is stored in localStorage with an expiry timestamp

import { ADMIN } from "./constants";
import type { AdminSession } from "./supabase/types";

// ─────────────────────────────────────────────
// VERIFY CREDENTIALS
// Called from /api/admin/login route handler
// Compares against env vars server-side only
// Returns true if username and password match
// ─────────────────────────────────────────────

export function verifyAdminCredentials(
  username: string,
  password: string
): boolean {
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    console.error(
      "Admin credentials not configured in environment variables."
    );
    return false;
  }

  // Trim to avoid whitespace issues when copying credentials
  return (
    username.trim() === validUsername.trim() &&
    password === validPassword
  );
}

// ─────────────────────────────────────────────
// CLIENT-SIDE SESSION HELPERS
// These run in the browser — store/read/clear
// the admin session from localStorage
// ─────────────────────────────────────────────

// Save admin session to localStorage after successful login
export function saveAdminSession(username: string): void {
  if (typeof window === "undefined") return;

  const session: AdminSession = {
    authenticated: true,
    username,
    expires_at: Date.now() + ADMIN.sessionDuration,
  };

  localStorage.setItem(ADMIN.sessionKey, JSON.stringify(session));
}

// Read and validate admin session from localStorage
// Returns the session if valid, null if missing or expired
export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ADMIN.sessionKey);
    if (!raw) return null;

    const session: AdminSession = JSON.parse(raw);

    // Check session has required fields
    if (!session.authenticated || !session.username || !session.expires_at) {
      clearAdminSession();
      return null;
    }

    // Check if session has expired
    if (Date.now() > session.expires_at) {
      clearAdminSession();
      return null;
    }

    return session;
  } catch {
    // Corrupted localStorage entry
    clearAdminSession();
    return null;
  }
}

// Check if admin is currently authenticated
// Lightweight boolean check — use this for guards
export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

// Clear admin session on logout or expiry
export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN.sessionKey);
}

// Extend session expiry on activity
// Call this on each admin page navigation to keep
// active admins from being logged out mid-session
export function refreshAdminSession(): void {
  if (typeof window === "undefined") return;

  const session = getAdminSession();
  if (!session) return;

  const refreshed: AdminSession = {
    ...session,
    expires_at: Date.now() + ADMIN.sessionDuration,
  };

  localStorage.setItem(ADMIN.sessionKey, JSON.stringify(refreshed));
}

// Get admin username from active session
// Returns null if not authenticated
export function getAdminUsername(): string | null {
  const session = getAdminSession();
  return session?.username ?? null;
}

// Get remaining session time in minutes
// Useful for showing session expiry warnings
export function getSessionRemainingMinutes(): number {
  const session = getAdminSession();
  if (!session) return 0;

  const remainingMs = session.expires_at - Date.now();
  return Math.max(0, Math.floor(remainingMs / 1000 / 60));
}
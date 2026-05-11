// src/contexts/AuthContext.tsx
// Global auth context — wraps the whole app so all components share ONE auth state.
// Fixes: My Account button disappearing on client-side navigation (per-hook instances).
// Profile is fetched via /api/user/profile (server-side cookie client) to avoid
// browser-client RLS hangs that kept the spinner stuck forever in production.

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

// ─────────────────────────────────────────────
// TYPES  (previously in useAuth.ts)
// ─────────────────────────────────────────────

export interface AuthState {
  user:        User | null;
  profile:     Profile | null;
  loading:     boolean;
  initialized: boolean;
}

export interface AuthActions {
  signIn:         (email: string, password: string) => Promise<AuthResult>;
  signUp:         (email: string, password: string, fullName: string, phone?: string) => Promise<AuthResult>;
  signOut:        () => Promise<void>;
  resetPassword:  (email: string) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
}

export interface AuthResult {
  success: boolean;
  error?:  string;
}

export type UseAuthReturn = AuthState & AuthActions;

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const AuthContext = createContext<UseAuthReturn | null>(null);

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,        setUser]        = useState<User | null>(null);
  const [profile,     setProfile]     = useState<Profile | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [initialized, setInitialized] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  // ── Fetch profile via server-side API route ──
  // Avoids direct browser-client RLS table queries that stall in production.

  const fetchProfile = useCallback(async () => {
    try {
      const res  = await fetch("/api/user/profile");
      const json = await res.json();
      if (json.success) {
        setProfile(json.data as Profile);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  // ── Initialise auth on mount ──

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUser(currentUser);
      // Set initialized immediately — don't block on profile fetch.
      // AuthGuard only needs to know if there's a session; profile loads shortly after.
      setInitialized(true);

      if (currentUser) {
        fetchProfile(); // fire-and-forget
      }
    };

    initAuth();

    // Subscribe to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setInitialized(true);

      if (currentUser) {
        fetchProfile(); // fire-and-forget
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─────────────────────────────────────────────
  // AUTH ACTIONS
  // ─────────────────────────────────────────────

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email:    email.trim().toLowerCase(),
          password,
        });
        if (error) return { success: false, error: mapAuthError(error.message) };
        return { success: true };
      } catch {
        return { success: false, error: "An unexpected error occurred. Please try again." };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  const signUp = useCallback(
    async (
      email:    string,
      password: string,
      fullName: string,
      phone?:   string
    ): Promise<AuthResult> => {
      setLoading(true);
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email:    email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone:     phone?.trim() ?? null,
            },
          },
        });

        if (signUpError) return { success: false, error: mapAuthError(signUpError.message) };
        if (!data.user)  return { success: false, error: "Registration failed. Please try again." };

        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id:        data.user!.id,
            full_name: fullName.trim(),
            email:     email.trim().toLowerCase(),
            phone:     phone?.trim() ?? null,
          } as never);

        if (profileError) console.error("Profile insert error:", profileError.message);

        return { success: true };
      } catch {
        return { success: false, error: "An unexpected error occurred. Please try again." };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
          {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
          }
        );
        if (error) return { success: false, error: mapAuthError(error.message) };
        return { success: true };
      } catch {
        return { success: false, error: "An unexpected error occurred. Please try again." };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  // ─────────────────────────────────────────────
  // PROVIDE
  // ─────────────────────────────────────────────

  const value: UseAuthReturn = {
    user,
    profile,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useAuth(): UseAuthReturn {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// ─────────────────────────────────────────────
// ERROR MESSAGE MAPPER
// ─────────────────────────────────────────────

function mapAuthError(message: string): string {
  const errorMap: Record<string, string> = {
    "Invalid login credentials":
      "Incorrect email or password. Please try again.",
    "Email not confirmed":
      "Please verify your email address before logging in.",
    "User already registered":
      "An account with this email already exists. Please log in.",
    "Password should be at least 6 characters":
      "Password must be at least 6 characters long.",
    "Unable to validate email address: invalid format":
      "Please enter a valid email address.",
    "Email rate limit exceeded":
      "Too many attempts. Please wait a few minutes and try again.",
    "over_email_send_rate_limit":
      "Too many emails sent. Please wait a few minutes and try again.",
    "Auth session missing":
      "Your session has expired. Please log in again.",
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return message.charAt(0).toUpperCase() + message.slice(1);
}

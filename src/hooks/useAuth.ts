// src/hooks/useAuth.ts
// Supabase auth state hook for client components
// Provides current user, profile, loading state, and auth actions
// Uses onAuthStateChange for real-time session updates

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

// ─────────────────────────────────────────────
// TYPES
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
// HOOK
// ─────────────────────────────────────────────

export function useAuth(): UseAuthReturn {
  const [user,        setUser]        = useState<User | null>(null);
  const [profile,     setProfile]     = useState<Profile | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [initialized, setInitialized] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  // ── Fetch profile from profiles table ──

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        setProfile(null);
        return;
      }

      setProfile(data);
    },
    [supabase]
  );

  // ── Public: refresh profile manually ──
  // Call after profile updates (e.g. name change)

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchProfile(user.id);
  }, [user, fetchProfile]);

  // ── Initialise session on mount ──

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id);
      }

      setInitialized(true);
    };

    initAuth();

    // ── Subscribe to auth state changes ──
    // Fires on login, logout, token refresh

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }

      setInitialized(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);                                    // eslint-disable-line react-hooks/exhaustive-deps

  // ─────────────────────────────────────────────
  // AUTH ACTIONS
  // ─────────────────────────────────────────────

  // ── Sign In ──

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setLoading(true);

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email:    email.trim().toLowerCase(),
          password,
        });

        if (error) {
          return {
            success: false,
            error:   mapAuthError(error.message),
          };
        }

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
    [supabase]
  );

  // ── Sign Up ──

  const signUp = useCallback(
    async (
      email:    string,
      password: string,
      fullName: string,
      phone?:   string
    ): Promise<AuthResult> => {
      setLoading(true);

      try {
        // 1. Create auth user
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

        if (signUpError) {
          return {
            success: false,
            error:   mapAuthError(signUpError.message),
          };
        }

        if (!data.user) {
          return {
            success: false,
            error:   "Registration failed. Please try again.",
          };
        }

        // 2. Insert into profiles table
        // This is also handled by a Supabase trigger (in schema.sql)
        // but we do it here as a fallback in case the trigger is delayed
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id:        data.user!.id,
            full_name: fullName.trim(),
            email:     email.trim().toLowerCase(),
            phone:     phone?.trim() ?? null,
          } as never);

        if (profileError) {
          console.error("Profile insert error:", profileError.message);
          // Don't fail registration if profile insert fails —
          // the trigger will handle it
        }

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
    [supabase]
  );

  // ── Sign Out ──

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

  // ── Reset Password ──

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

        if (error) {
          return {
            success: false,
            error:   mapAuthError(error.message),
          };
        }

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
    [supabase]
  );

  // ─────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────

  return {
    // State
    user,
    profile,
    loading,
    initialized,

    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfile,
  };
}

// ─────────────────────────────────────────────
// ERROR MESSAGE MAPPER
// Converts Supabase raw error strings into
// clean user-facing messages
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

  // Check for partial matches for longer Supabase error strings
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Fallback — return the raw message capitalised
  return message.charAt(0).toUpperCase() + message.slice(1);
}
// src/app/auth/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/auth/AuthForm";
import Toast from "@/components/ui/Toast";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [toast,    setToast]    = useState<string | null>(null);

  const { signIn, loading, user, initialized } = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("redirectTo") ?? "/";

  // Redirect if already logged in
  useEffect(() => {
    if (initialized && user) {
      router.push(redirectTo);
    }
  }, [user, initialized, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const result = await signIn(email, password);

    if (!result.success) {
      setError(result.error ?? "Login failed.");
      return;
    }

    setToast("Welcome back.");
    router.refresh();
    router.push(redirectTo);
  };

  return (
    <>
      <AuthForm
        title="Welcome back"
        subtitle="Sign in to manage your bookings and rituals."
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              style={{ color: "#C4956A", fontWeight: 500 }}
            >
              Create one
            </Link>
          </>
        }
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div>
            <label className="label-sevres">Email Address</label>
            <input
              className="input-sevres"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <div
              style={{
                display:        "flex",
                justifyContent: "space-between",
                alignItems:     "center",
                marginBottom:   "0.5rem",
              }}
            >
              <label className="label-sevres" style={{ marginBottom: 0 }}>
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize:   "0.8125rem",
                  color:      "#C4956A",
                }}
              >
                Forgot password?
              </Link>
            </div>
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
                padding:      "0.875rem 1rem",
                backgroundColor: "rgba(196,149,106,0.08)",
                border:       "1px solid rgba(196,149,106,0.25)",
                borderRadius: "0.5rem",
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
              width:   "100%",
              opacity: loading ? 0.7 : 1,
              cursor:  loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </AuthForm>

      {toast && (
        <Toast
          message={toast}
          type="success"
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
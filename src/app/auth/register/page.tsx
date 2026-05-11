// src/app/auth/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/auth/AuthForm";
import Toast from "@/components/ui/Toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email:     "",
    phone:     "",
    password:  "",
    confirm:   "",
  });
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { signUp, loading, user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && user) router.push("/");
  }, [user, initialized, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    const result = await signUp(
      form.email,
      form.password,
      form.full_name,
      form.phone || undefined
    );

    if (!result.success) {
      setError(result.error ?? "Registration failed.");
      return;
    }

    setToast("Account created. Welcome to Sèvres & Co.");
    setTimeout(() => router.push("/"), 1500);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setError(null);
  };

  return (
    <>
      <AuthForm
        title="Create your account"
        subtitle="Join Sèvres & Co. and begin your ritual."
        footer={
          <>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              style={{ color: "#C4956A", fontWeight: 500 }}
            >
              Sign in
            </Link>
          </>
        }
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}
        >
          <div>
            <label className="label-sevres">Full Name *</label>
            <input
              className="input-sevres"
              type="text"
              placeholder="Your full name"
              value={form.full_name}
              onChange={update("full_name")}
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className="label-sevres">Email Address *</label>
            <input
              className="input-sevres"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={update("email")}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="label-sevres">Phone (optional)</label>
            <input
              className="input-sevres"
              type="tel"
              placeholder="+91 98200 00000"
              value={form.phone}
              onChange={update("phone")}
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="label-sevres">Password *</label>
            <input
              className="input-sevres"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={update("password")}
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label className="label-sevres">Confirm Password *</label>
            <input
              className="input-sevres"
              type="password"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={update("confirm")}
              autoComplete="new-password"
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
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   "0.8rem",
              color:      "#8B7355",
              textAlign:  "center",
              lineHeight: 1.6,
            }}
          >
            By creating an account you agree to our{" "}
            <Link href="#" style={{ color: "#C4956A" }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" style={{ color: "#C4956A" }}>
              Privacy Policy
            </Link>
            .
          </p>
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
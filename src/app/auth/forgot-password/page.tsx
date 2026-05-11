// src/app/auth/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/auth/AuthForm";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const { resetPassword, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const result = await resetPassword(email);

    if (!result.success) {
      setError(result.error ?? "Failed to send reset email.");
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <AuthForm
        title="Check your inbox"
        footer={
          <Link href="/auth/login" style={{ color: "#C4956A", fontWeight: 500 }}>
            ← Back to sign in
          </Link>
        }
      >
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <div
            style={{
              width:           "56px",
              height:          "56px",
              borderRadius:    "9999px",
              backgroundColor: "rgba(196,149,106,0.1)",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              margin:          "0 auto 1.25rem",
            }}
          >
            <CheckCircle size={24} color="#C4956A" />
          </div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   "0.9375rem",
              color:      "#8B7355",
              lineHeight: 1.75,
            }}
          >
            We have sent a password reset link to{" "}
            <strong style={{ color: "#2C1810" }}>{email}</strong>.
            Please check your inbox and follow the instructions.
          </p>
          <p
            style={{
              fontFamily:  "'DM Sans', sans-serif",
              fontSize:    "0.8125rem",
              color:       "#8B7355",
              marginTop:   "1rem",
              lineHeight:  1.6,
            }}
          >
            Did not receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setSent(false)}
              style={{
                color:      "#C4956A",
                background: "none",
                border:     "none",
                cursor:     "pointer",
                padding:    0,
                fontSize:   "inherit",
                fontFamily: "inherit",
              }}
            >
              try again
            </button>
            .
          </p>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Reset your password"
      subtitle="Enter your email and we will send you a reset link."
      footer={
        <Link href="/auth/login" style={{ color: "#C4956A", fontWeight: 500 }}>
          ← Back to sign in
        </Link>
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
            width:   "100%",
            opacity: loading ? 0.7 : 1,
            cursor:  loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
    </AuthForm>
  );
}
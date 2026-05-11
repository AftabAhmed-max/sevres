// src/components/auth/AuthForm.tsx
"use client";

import Link from "next/link";

interface AuthFormProps {
  title:       string;
  subtitle?:   string;
  children:    React.ReactNode;
  footer?:     React.ReactNode;
}

export default function AuthForm({
  title,
  subtitle,
  children,
  footer,
}: AuthFormProps) {
  return (
    <div
      style={{
        minHeight:       "100svh",
        backgroundColor: "#FAF7F2",
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "2rem 1.5rem",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "1.5rem",
          fontWeight:    300,
          color:         "#2C1810",
          letterSpacing: "0.1em",
          marginBottom:  "2.5rem",
          display:       "block",
          textAlign:     "center",
        }}
      >
        Sèvres & Co.
      </Link>

      {/* Card */}
      <div
        style={{
          width:           "100%",
          maxWidth:        "440px",
          backgroundColor: "#FFFFFF",
          borderRadius:    "1rem",
          border:          "1px solid rgba(196,149,106,0.15)",
          boxShadow:       "0 4px 40px rgba(44,24,16,0.08)",
          padding:         "2.5rem",
        }}
      >
        {/* Heading */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1
            style={{
              fontFamily:   "'Cormorant Garamond', Georgia, serif",
              fontSize:     "2rem",
              fontWeight:   400,
              color:        "#2C1810",
              marginBottom: "0.5rem",
              lineHeight:   1.2,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize:   "0.9rem",
                color:      "#8B7355",
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            width:        "3rem",
            height:       "1px",
            background:   "linear-gradient(to right, transparent, #C4956A, transparent)",
            margin:       "0 auto 2rem",
          }}
        />

        {/* Form content */}
        {children}
      </div>

      {/* Footer links */}
      {footer && (
        <div
          style={{
            marginTop:  "1.5rem",
            textAlign:  "center",
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "0.875rem",
            color:      "#8B7355",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight:       "100svh",
        backgroundColor: "#FAF7F2",
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "2rem",
        textAlign:       "center",
      }}
    >
      {/* Eyebrow */}
      <span
        style={{
          fontFamily:    "'DM Sans', sans-serif",
          fontSize:      "0.6875rem",
          fontWeight:    500,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color:         "#C4956A",
          marginBottom:  "1.5rem",
          display:       "block",
        }}
      >
        404 — Page Not Found
      </span>

      {/* Heading */}
      <h1
        style={{
          fontFamily:   "'Cormorant Garamond', Georgia, serif",
          fontSize:     "clamp(3rem, 8vw, 6rem)",
          fontWeight:   300,
          color:        "#2C1810",
          lineHeight:   1.1,
          marginBottom: "1.5rem",
          letterSpacing: "-0.02em",
        }}
      >
        Lost in the atelier.
      </h1>

      {/* Divider */}
      <div
        style={{
          width:        "3rem",
          height:       "1px",
          background:   "linear-gradient(to right, transparent, #C4956A, transparent)",
          margin:       "0 auto 1.5rem",
        }}
      />

      {/* Subtext */}
      <p
        style={{
          fontFamily:   "'DM Sans', sans-serif",
          fontSize:     "1rem",
          color:        "#8B7355",
          lineHeight:   1.75,
          maxWidth:     "420px",
          marginBottom: "2.5rem",
        }}
      >
        The page you are looking for may have moved or no longer exists.
        Let us guide you back.
      </p>

      {/* CTA */}
      <Link href="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  );
}
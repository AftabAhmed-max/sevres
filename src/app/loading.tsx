// src/app/loading.tsx
"use client";

export default function Loading() {
  return (
    <div
      style={{
        position:        "fixed",
        inset:           0,
        backgroundColor: "#FAF7F2",
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
        zIndex:          9999,
      }}
    >
      {/* Brand wordmark */}
      <div
        style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "1.5rem",
          fontWeight:    300,
          color:         "#2C1810",
          letterSpacing: "0.15em",
          marginBottom:  "2rem",
        }}
      >
        Sèvres & Co.
      </div>

      {/* Animated dots */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width:           "6px",
              height:          "6px",
              borderRadius:    "9999px",
              backgroundColor: "#C4956A",
              animation:       "loadingPulse 1.2s ease-in-out infinite",
              animationDelay:  `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes loadingPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1);   }
        }
      `}</style>
    </div>
  );
}
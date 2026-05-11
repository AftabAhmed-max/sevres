// src/components/ui/LoadingSpinner.tsx

interface LoadingSpinnerProps {
  size?:    number;
  color?:   string;
  message?: string;
}

export default function LoadingSpinner({
  size    = 32,
  color   = "#C4956A",
  message,
}: LoadingSpinnerProps) {
  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        gap:            "1rem",
        padding:        "2rem",
      }}
    >
      <div
        style={{
          width:        `${size}px`,
          height:       `${size}px`,
          border:       `2px solid rgba(196,149,106,0.2)`,
          borderTopColor: color,
          borderRadius: "9999px",
          animation:    "spin 0.8s linear infinite",
        }}
      />
      {message && (
        <p
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontSize:      "0.875rem",
            color:         "#8B7355",
            letterSpacing: "0.05em",
          }}
        >
          {message}
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
// src/components/admin/StatCard.tsx

interface StatCardProps {
  label:     string;
  value:     number | string;
  subLabel?: string;
  accent?:   boolean;
}

export default function StatCard({
  label,
  value,
  subLabel,
  accent = false,
}: StatCardProps) {
  return (
    <div
      className="stat-card"
      style={{
        borderLeft: accent ? "3px solid #C4956A" : "1px solid rgba(196,149,106,0.12)",
      }}
    >
      <p
        style={{
          fontFamily:    "'DM Sans', sans-serif",
          fontSize:      "0.6875rem",
          fontWeight:    500,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color:         "#8B7355",
          marginBottom:  "0.75rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily:   "'Cormorant Garamond', Georgia, serif",
          fontSize:     "3rem",
          fontWeight:   300,
          color:        accent ? "#C4956A" : "#2C1810",
          lineHeight:   1,
          marginBottom: subLabel ? "0.5rem" : 0,
        }}
      >
        {value}
      </p>
      {subLabel && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "0.8125rem",
            color:      "#8B7355",
          }}
        >
          {subLabel}
        </p>
      )}
    </div>
  );
}
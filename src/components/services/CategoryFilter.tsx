// src/components/services/CategoryFilter.tsx
"use client";

import { SERVICE_CATEGORIES } from "@/lib/constants";

interface CategoryFilterProps {
  active:   string;
  onChange: (category: string) => void;
}

const ALL_CATEGORIES = [
  { id: "all", label: "All Services" },
  ...SERVICE_CATEGORIES,
];

export default function CategoryFilter({
  active,
  onChange,
}: CategoryFilterProps) {
  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        gap:            "0.5rem",
        flexWrap:       "wrap",
        marginBottom:   "3rem",
      }}
    >
      {ALL_CATEGORIES.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              padding:         "0.625rem 1.5rem",
              borderRadius:    "9999px",
              border:          `1.5px solid ${isActive ? "#2C1810" : "rgba(139,115,85,0.25)"}`,
              backgroundColor: isActive ? "#2C1810" : "transparent",
              fontFamily:      "'DM Sans', sans-serif",
              fontSize:        "0.8125rem",
              fontWeight:      500,
              letterSpacing:   "0.08em",
              textTransform:   "uppercase",
              color:           isActive ? "#FAF7F2" : "#8B7355",
              cursor:          "pointer",
              transition:      "all 0.3s ease",
              whiteSpace:      "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor      = "#2C1810";
                e.currentTarget.style.color            = "#2C1810";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor      = "rgba(139,115,85,0.25)";
                e.currentTarget.style.color            = "#8B7355";
              }
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
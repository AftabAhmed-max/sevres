// src/components/services/ServiceCard.tsx
"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { formatPrice, formatDuration } from "@/lib/time-slots";
import type { Service } from "@/lib/supabase/types";

interface ServiceCardProps {
  service:    Service;
  showButton?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  hair:    "Hair",
  skin:    "Skin",
  nails:   "Nails",
  massage: "Massage",
};

export default function ServiceCard({
  service,
  showButton = true,
}: ServiceCardProps) {
  return (
    <div
      className="card-sevres"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Category tag */}
      <div
        style={{
          padding:         "1.5rem 1.5rem 0",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "space-between",
        }}
      >
        <span
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontSize:      "0.6875rem",
            fontWeight:    500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color:         "#C4956A",
          }}
        >
          {CATEGORY_LABELS[service.category] ?? service.category}
        </span>
        <div
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "0.25rem",
            color:        "#8B7355",
          }}
        >
          <Clock size={12} />
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   "0.75rem",
              color:      "#8B7355",
            }}
          >
            {formatDuration(service.duration)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "1rem 1.5rem 1.5rem",
          flex:    1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontFamily:   "'Cormorant Garamond', Georgia, serif",
            fontSize:     "1.375rem",
            fontWeight:   400,
            color:        "#2C1810",
            marginBottom: "0.625rem",
            lineHeight:   1.3,
          }}
        >
          {service.name}
        </h3>

        {service.description && (
          <p
            style={{
              fontFamily:   "'DM Sans', sans-serif",
              fontSize:     "0.875rem",
              color:        "#8B7355",
              lineHeight:   1.7,
              marginBottom: "1.25rem",
              flex:         1,
            }}
          >
            {service.description}
          </p>
        )}

        {/* Price + CTA */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            marginTop:      "auto",
            paddingTop:     "1rem",
            borderTop:      "1px solid rgba(196,149,106,0.1)",
          }}
        >
          <span
            style={{
              fontFamily:   "'Cormorant Garamond', Georgia, serif",
              fontSize:     "1.5rem",
              fontWeight:   500,
              color:        "#2C1810",
              letterSpacing: "-0.01em",
            }}
          >
            {formatPrice(service.price)}
          </span>

          {showButton && (
            <Link
              href={`/book?service=${service.id}`}
              style={{
                display:      "inline-flex",
                alignItems:   "center",
                gap:          "0.375rem",
                fontFamily:   "'DM Sans', sans-serif",
                fontSize:     "0.75rem",
                fontWeight:   500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color:        "#C4956A",
                transition:   "gap 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.gap = "0.625rem";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.gap = "0.375rem";
              }}
            >
              Book
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
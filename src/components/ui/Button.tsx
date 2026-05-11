// src/components/ui/Button.tsx
"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?:    "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant  = "primary",
      size     = "md",
      loading  = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const base = size === "sm"
      ? `btn-${variant} btn-sm`
      : `btn-${variant}`;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${className}`}
        style={{
          opacity: disabled || loading ? 0.6 : 1,
          cursor:  disabled || loading ? "not-allowed" : "pointer",
        }}
        {...props}
      >
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width:        "14px",
                height:       "14px",
                border:       "1.5px solid currentColor",
                borderTopColor: "transparent",
                borderRadius: "9999px",
                display:      "inline-block",
                animation:    "spin 0.7s linear infinite",
              }}
            />
            {children}
          </span>
        ) : children}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
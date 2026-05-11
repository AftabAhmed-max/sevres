// src/components/ui/Modal.tsx
"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open:       boolean;
  onClose:    () => void;
  title?:     string;
  children:   React.ReactNode;
  maxWidth?:  string;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "520px",
}: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              marginBottom:   "1.5rem",
            }}
          >
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize:   "1.5rem",
                fontWeight: 400,
                color:      "#2C1810",
              }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                display:      "flex",
                alignItems:   "center",
                padding:      "0.25rem",
                borderRadius: "0.25rem",
                color:        "#8B7355",
                transition:   "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2C1810")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8B7355")}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Close button when no title */}
        {!title && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <button
              onClick={onClose}
              style={{ color: "#8B7355", padding: "0.25rem" }}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
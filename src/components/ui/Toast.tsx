// src/components/ui/Toast.tsx
"use client";

import { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message:   string;
  type?:     "success" | "error";
  onClose:   () => void;
  duration?: number;
}

export default function Toast({
  message,
  type     = "success",
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      {type === "success" ? (
        <CheckCircle size={18} color="#C4956A" style={{ flexShrink: 0 }} />
      ) : (
        <AlertCircle size={18} color="#8B7355" style={{ flexShrink: 0 }} />
      )}

      <span style={{ flex: 1, lineHeight: 1.5 }}>{message}</span>

      <button
        onClick={onClose}
        style={{
          color:      "rgba(250,247,242,0.6)",
          flexShrink: 0,
          padding:    "0.125rem",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#FAF7F2")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(250,247,242,0.6)")}
      >
        <X size={16} />
      </button>
    </div>
  );
}
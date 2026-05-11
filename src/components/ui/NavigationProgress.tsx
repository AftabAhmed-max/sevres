"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname              = usePathname();
  const [width,  setWidth]    = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath              = useRef(pathname);
  const intervalRef           = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current)    clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    // Route completed — finish bar
    clear();
    setWidth(100);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 400);
  }, [pathname]);

  // Expose start function via custom event
  useEffect(() => {
    const handleStart = () => {
      clear();
      setVisible(true);
      setWidth(8);

      intervalRef.current = setInterval(() => {
        setWidth((w) => {
          if (w >= 82) {
            clearInterval(intervalRef.current!);
            return 82;
          }
          return w + Math.random() * 10;
        });
      }, 250);
    };

    window.addEventListener("navigation-start", handleStart);
    return () => {
      window.removeEventListener("navigation-start", handleStart);
      clear();
    };
  }, []);

  if (!visible) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 9999, pointerEvents: "none" }}>
      <div
        style={{
          height:          "100%",
          width:           `${width}%`,
          backgroundColor: "#C4956A",
          boxShadow:       "0 0 8px rgba(196,149,106,0.6)",
          transition:      width === 100 ? "width 0.2s ease" : "width 0.4s ease",
        }}
      />
    </div>
  );
}
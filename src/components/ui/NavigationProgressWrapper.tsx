// src/components/ui/NavigationProgressWrapper.tsx
"use client";

import { Suspense } from "react";
import NavigationProgress from "./NavigationProgress";

export default function NavigationProgressWrapper() {
  return (
    <Suspense fallback={null}>
      <NavigationProgress />
    </Suspense>
  );
}
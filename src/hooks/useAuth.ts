// src/hooks/useAuth.ts
// Re-exports from AuthContext so existing imports don't need to change.
// The actual implementation lives in src/contexts/AuthContext.tsx.

export {
  useAuth,
} from "@/contexts/AuthContext";

export type {
  AuthState,
  AuthActions,
  AuthResult,
  UseAuthReturn,
} from "@/contexts/AuthContext";

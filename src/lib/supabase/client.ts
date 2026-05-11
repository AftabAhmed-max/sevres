// src/lib/supabase/client.ts
// Browser-side Supabase client — uses anon key only
// Never import this in API routes or server components

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

// Module-level singleton — @supabase/ssr@0.5+ removed its built-in singleton,
// so we maintain one here to ensure all components share the same auth state
// and onAuthStateChange subscriptions fire consistently across navigations.
let _client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  if (!_client) {
    _client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _client;
}
// middleware.ts
// Next.js middleware — runs on every matched request
// Handles two concerns:
// 1. Supabase session refresh (keeps auth cookies fresh)
// 2. Protected route enforcement for /bookings

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ─────────────────────────────────────────────
// PROTECTED ROUTES
// Routes that require Supabase Auth session
// Admin routes are NOT here — admin auth is
// handled separately via /api/admin/login
// ─────────────────────────────────────────────

const PROTECTED_ROUTES = ["/bookings"];

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create a response to mutate cookies on
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // ── Initialise Supabase client in middleware ──
  // Uses anon key — only purpose here is to
  // refresh the session token in cookies

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          // Set cookies on both request and response
          // so the refreshed session is available
          // immediately in server components
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // ── Refresh session ──
  // IMPORTANT: always call getUser() not getSession()
  // getUser() validates the token server-side
  // This also refreshes the session cookie if needed

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Protected route enforcement ──

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    // Redirect to login with return URL
    // so user lands back on intended page after login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect logged-in users away from auth pages ──
  // Prevents authenticated users from seeing
  // login/register pages unnecessarily

  const isAuthRoute =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

// ─────────────────────────────────────────────
// MATCHER
// Tells Next.js which routes to run middleware on
// Excludes static files, images, and _next internals
// ─────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico   (favicon)
     * - public folder files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
// src/app/api/admin/bookings/route.ts
// Admin-only booking management routes
// GET  — fetch all bookings with joins
// PATCH — update booking status

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminCredentials } from "@/lib/admin-auth";

// ── Auth helper ──
// Reads the admin session token from the
// Authorization header sent by the admin client

function isAdminAuthorised(request: NextRequest): boolean {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return false;

  try {
    const token   = auth.replace("Bearer ", "");
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return (
      decoded.authenticated === true &&
      decoded.expires_at > Date.now()
    );
  } catch {
    return false;
  }
}

// ── GET /api/admin/bookings ──
// Returns all bookings with service, stylist,
// and profile joins — no RLS restrictions

export async function GET(request: NextRequest) {
  if (!isAdminAuthorised(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const supabase = await createAdminClient();

    const { searchParams } = new URL(request.url);
    const status            = searchParams.get("status");
    const date              = searchParams.get("date");
    const limit             = parseInt(searchParams.get("limit") ?? "200", 10);

    let query = supabase
      .from("bookings")
      .select(`
        *,
        service:services(id, name, category, duration, price),
        stylist:stylists(id, name, specialties)
      `)
      .order("date",      { ascending: false })
      .order("time_slot", { ascending: false })
      .limit(limit);

    if (status) query = query.eq("status", status);
    if (date)   query = query.eq("date",   date);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── PATCH /api/admin/bookings ──
// Updates a booking status — admin can set
// pending, confirmed, or cancelled

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthorised(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const body       = await request.json();
    const { booking_id, status } = body;

    if (!booking_id || !status) {
      return NextResponse.json(
        { success: false, error: "booking_id and status are required." },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}.` },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    // Fetch current booking to guard edge cases
    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("id, status")
      .eq("id", booking_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    const current = existing as { id: string; status: string };

    // Guard: already cancelled
    if (current.status === "cancelled" && status === "cancelled") {
      return NextResponse.json(
        { success: false, error: "This booking is already cancelled." },
        { status: 409 }
      );
    }

    // Guard: already confirmed
    if (current.status === "confirmed" && status === "confirmed") {
      return NextResponse.json(
        { success: false, error: "This booking is already confirmed." },
        { status: 409 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() } as never)
      .eq("id", booking_id)
      .select(`
        *,
        service:services(id, name, category, duration, price),
        stylist:stylists(id, name, specialties)
      `)
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: updated },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
// src/app/api/bookings/route.ts
// POST  — create a new booking (authenticated users only)
// PATCH — cancel a booking (authenticated, own bookings only)

import { NextRequest, NextResponse } from "next/server";
import { createClient, getCurrentUser } from "@/lib/supabase/server";

// ── POST /api/bookings ──
// Creates a new booking for the authenticated user

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to make a booking." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { service_id, stylist_id, date, time_slot, notes, guest_name } = body;

    // Validate required fields
    if (!service_id || !stylist_id || !date || !time_slot) {
      return NextResponse.json(
        { success: false, error: "service_id, stylist_id, date, and time_slot are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check the slot is still available before inserting
    const { data: existing } = await supabase
      .from("bookings")
      .select("id")
      .eq("stylist_id", stylist_id)
      .eq("date", date)
      .eq("time_slot", time_slot)
      .neq("status", "cancelled")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error:   "This time slot has just been booked. Please select another time.",
        },
        { status: 409 }
      );
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        user_id:    user.id,
        service_id,
        stylist_id,
        date,
        time_slot,
        status:     "pending",
        notes:      notes      ?? null,
        guest_name: guest_name ?? null,
      } as never)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: booking },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── PATCH /api/bookings ──
// Cancels a booking — user can only cancel their own

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to cancel a booking." },
        { status: 401 }
      );
    }

    const body       = await request.json();
    const { booking_id } = body;

    if (!booking_id) {
      return NextResponse.json(
        { success: false, error: "booking_id is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch the booking first to verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("id, status, user_id")
      .eq("id", booking_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    // Verify the booking belongs to this user
    // RLS also enforces this but we check explicitly
    const bookingData = existing as { id: string; status: string; user_id: string };

    if (bookingData.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "You are not authorised to cancel this booking." },
        { status: 403 }
      );
    }

    // Guard against cancelling an already cancelled booking
    if (bookingData.status === "cancelled") {
      return NextResponse.json(
        { success: false, error: "This booking has already been cancelled." },
        { status: 409 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update({ status: "cancelled" } as never)
      .eq("id", booking_id)
      .eq("user_id", user.id)
      .select()
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
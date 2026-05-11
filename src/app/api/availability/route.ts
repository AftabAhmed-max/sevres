// src/app/api/availability/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateSlotsForDate } from "@/lib/time-slots";
import type { AvailabilityResponse } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const stylistId       = searchParams.get("stylist_id");
  const date            = searchParams.get("date");
  const serviceDuration = parseInt(searchParams.get("service_duration") ?? "60", 10);

  if (!stylistId || !date) {
    return NextResponse.json(
      { success: false, error: "stylist_id and date are required." },
      { status: 400 }
    );
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return NextResponse.json(
      { success: false, error: "Invalid date format. Use YYYY-MM-DD." },
      { status: 400 }
    );
  }

  try {
    const supabase = await createAdminClient();

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("time_slot")
      .eq("stylist_id", stylistId)
      .eq("date", date)
      .neq("status", "cancelled");

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const bookedSlots = (bookings ?? []).map(
      (b: { time_slot: string }) => b.time_slot
    );

    const allSlots       = generateSlotsForDate(date);
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    const response: AvailabilityResponse = {
      date,
      stylist_id:      stylistId,
      booked_slots:    bookedSlots,
      available_slots: availableSlots,
    };

    return NextResponse.json(
      { success: true, data: response },
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
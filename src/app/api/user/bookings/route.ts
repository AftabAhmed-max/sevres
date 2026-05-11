// src/app/api/user/bookings/route.ts
// GET — fetch the authenticated user's bookings with service + stylist details

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to view bookings." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        service:services(id, name, category, duration, price),
        stylist:stylists(id, name, specialties)
      `)
      .eq("user_id", user.id)
      .order("date",      { ascending: false })
      .order("time_slot", { ascending: false });

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

// src/app/api/services/route.ts
// Public — no auth required
// GET — active services, optionally filtered by category or fetched by id

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category         = searchParams.get("category");
    const id               = searchParams.get("id");

    const supabase = await createClient();

    if (id) {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .eq("active", true)
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    let query = supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("category", { ascending: true })
      .order("name",     { ascending: true });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: data ?? [] },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

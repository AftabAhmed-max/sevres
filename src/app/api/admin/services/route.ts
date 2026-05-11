// src/app/api/admin/services/route.ts
// Admin-only service management routes
// GET    — fetch all services including inactive
// POST   — create a new service
// PATCH  — update an existing service
// DELETE — soft delete (set active = false)

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { ServiceFormData } from "@/lib/supabase/types";

// ── Auth helper ──
function isAdminAuthorised(request: NextRequest): boolean {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return false;
  try {
    const token   = auth.replace("Bearer ", "");
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return decoded.authenticated === true && decoded.expires_at > Date.now();
  } catch {
    return false;
  }
}

// ── GET /api/admin/services ──
// Returns all services including inactive ones

export async function GET(request: NextRequest) {
  if (!isAdminAuthorised(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("category", { ascending: true })
      .order("name",     { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: data ?? [] },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── POST /api/admin/services ──
// Creates a new service

export async function POST(request: NextRequest) {
  if (!isAdminAuthorised(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const body: ServiceFormData = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Service name is required." },
        { status: 400 }
      );
    }
    if (!body.category) {
      return NextResponse.json(
        { success: false, error: "Category is required." },
        { status: 400 }
      );
    }
    if (!body.duration || body.duration < 15) {
      return NextResponse.json(
        { success: false, error: "Duration must be at least 15 minutes." },
        { status: 400 }
      );
    }
    if (body.price < 0) {
      return NextResponse.json(
        { success: false, error: "Price must be a positive number." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("services")
      .insert({
        name:        body.name.trim(),
        category:    body.category,
        duration:    body.duration,
        price:       body.price,
        description: body.description?.trim() ?? null,
        active:      body.active ?? true,
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
      { success: true, data },
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

// ── PATCH /api/admin/services ──
// Updates an existing service by ID

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthorised(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const body                      = await request.json();
    const { service_id, ...fields } = body;

    if (!service_id) {
      return NextResponse.json(
        { success: false, error: "service_id is required." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    // Verify service exists
    const { data: existing, error: fetchError } = await supabase
      .from("services")
      .select("id")
      .eq("id", service_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Service not found." },
        { status: 404 }
      );
    }

    // Build update payload — only include provided fields
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (fields.name        !== undefined) updatePayload.name        = fields.name.trim();
    if (fields.category    !== undefined) updatePayload.category    = fields.category;
    if (fields.duration    !== undefined) updatePayload.duration    = fields.duration;
    if (fields.price       !== undefined) updatePayload.price       = fields.price;
    if (fields.description !== undefined) updatePayload.description = fields.description?.trim() ?? null;
    if (fields.active      !== undefined) updatePayload.active      = fields.active;

    const { data, error } = await supabase
      .from("services")
      .update(updatePayload as never)
      .eq("id", service_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── DELETE /api/admin/services ──
// Hard deletes a service row from the database.
// Will fail with a foreign key error if bookings
// reference this service — that error is surfaced
// to the client as a 500 with the DB message.

export async function DELETE(request: NextRequest) {
  if (!isAdminAuthorised(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const service_id        = searchParams.get("service_id");

    if (!service_id) {
      return NextResponse.json(
        { success: false, error: "service_id query param is required." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", service_id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
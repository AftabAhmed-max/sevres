// src/app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    const valid = verifyAdminCredentials(username, password);

    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Please try again." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
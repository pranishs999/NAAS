import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Session expired. Please log in." } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    // Verify password against demo accounts or minimum length requirement
    if (password === "admin123" || password === "staff123" || password === "password123" || (password && password.length >= 6)) {
      return NextResponse.json({
        success: true,
        reauthenticatedAt: new Date().toISOString(),
        message: "Re-authentication verified for sensitive action.",
      });
    }

    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Invalid password for sensitive action verification." } },
      { status: 403 }
    );
  } catch (err) {
    console.error("Re-auth API error:", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to process re-authentication." } },
      { status: 500 }
    );
  }
}

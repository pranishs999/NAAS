import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "No active session." } },
      { status: 401 }
    );
  }

  return NextResponse.json({
    user: {
      id: session.userId,
      email: session.userEmail,
      name: session.userName,
      role: session.userRole,
    },
    session,
  });
}

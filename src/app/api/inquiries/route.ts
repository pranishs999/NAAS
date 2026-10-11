import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { getInquiries } from "@/lib/data/demoStore";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required to access inquiries." } },
      { status: 401 }
    );
  }

  const inquiries = getInquiries();
  return NextResponse.json({ data: inquiries, total: inquiries.length });
}

import { NextResponse } from "next/server";
import { getServices } from "@/lib/data/demoStore";

export async function GET() {
  const services = getServices().filter((s) => s.published);
  return NextResponse.json({ data: services, total: services.length });
}

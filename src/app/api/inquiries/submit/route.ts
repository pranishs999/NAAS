import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validation/schemas";
import { generateReferenceCode } from "@/lib/utils/referenceCode";
import { createInquiry } from "@/lib/data/demoStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = inquirySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Please check the highlighted form fields.",
            details: parseResult.error.issues.map((i) => ({ field: i.path[0] as string, message: i.message })),
          },
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const refCode = generateReferenceCode(data.branch);

    const newInquiry = createInquiry({
      referenceCode: refCode,
      branch: data.branch,
      serviceId: data.serviceId || null,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      message: data.message,
      formData: data.formData,
    });

    return NextResponse.json({
      success: true,
      referenceCode: refCode,
      inquiry: newInquiry,
      message: "Inquiry submitted successfully.",
    });
  } catch (err) {
    console.error("Inquiry submit API error:", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to submit inquiry." } },
      { status: 500 }
    );
  }
}

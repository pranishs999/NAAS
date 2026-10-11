import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/schemas";
import { authenticateDemoUser, createSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid email or password format.",
            details: parseResult.error.issues.map((i) => ({ field: i.path[0] as string, message: i.message })),
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const authUser = authenticateDemoUser(email, password);

    if (!authUser) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Invalid credentials. Use demo accounts: admin@hbs.demo or staff@hbs.demo (password: admin123 / staff123).",
          },
        },
        { status: 401 }
      );
    }

    const token = await createSessionToken(authUser.id, authUser.role, authUser.email, authUser.name);

    const response = NextResponse.json({
      user: authUser,
      message: "Authenticated successfully (Signed Demo Session)",
    });

    response.cookies.set({
      name: "hbs_session_token",
      value: token,
      httpOnly: true,
      secure: false, // development / demo local
      sameSite: "lax",
      path: "/",
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Server authentication error." } },
      { status: 500 }
    );
  }
}

import { cookies } from "next/headers";
import { UserRole, Session } from "@/types";
import { initialUsers } from "@/config/contentConfig";

const SESSION_COOKIE_NAME = "hbs_session_token";
const AUTH_SECRET = process.env.AUTH_SECRET || "demo_signed_cookie_secret_key_32bytes_min!";

// Simple crypto HMAC helper for signed session tokens
async function createSignature(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(AUTH_SECRET);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(userId: string, role: UserRole, email: string, name: string): Promise<string> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const payload = JSON.stringify({ userId, role, email, name, expiresAt });
  const base64Payload = Buffer.from(payload).toString("base64url");
  const signature = await createSignature(base64Payload);
  return `${base64Payload}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const [base64Payload, signature] = token.split(".");
    if (!base64Payload || !signature) return null;

    const expectedSignature = await createSignature(base64Payload);
    if (signature !== expectedSignature) return null;

    const payloadText = Buffer.from(base64Payload, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadText);

    if (new Date(payload.expiresAt) < new Date()) {
      return null;
    }

    return {
      id: `sess-${payload.userId}`,
      userId: payload.userId,
      userRole: payload.role as UserRole,
      userName: payload.name,
      userEmail: payload.email,
      token,
      expiresAt: payload.expiresAt,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Session verification error:", err);
    return null;
  }
}

// Server-side helper to read session from cookies
export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

// Demo Account Authentication Logic (Server-side)
export function authenticateDemoUser(email: string, pass: string): { id: string; name: string; email: string; role: UserRole } | null {
  const cleanEmail = email.trim().toLowerCase();
  
  if (cleanEmail === "admin@hbs.demo" && (pass === "admin123" || pass === "password123")) {
    return {
      id: "usr-admin-01",
      name: "System Admin (Demo)",
      email: "admin@hbs.demo",
      role: "admin",
    };
  }

  if (cleanEmail === "staff@hbs.demo" && (pass === "staff123" || pass === "password123")) {
    return {
      id: "usr-staff-01",
      name: "Operations Staff (Demo)",
      email: "staff@hbs.demo",
      role: "staff",
    };
  }

  // Fallback match in initial seed users
  const matched = initialUsers.find((u) => u.email.toLowerCase() === cleanEmail && u.isActive);
  if (matched && pass.length >= 6) {
    return {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      role: matched.role,
    };
  }

  return null;
}

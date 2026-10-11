import { describe, it, expect } from "vitest";
import { inquirySchema, loginSchema } from "../../src/lib/validation/schemas";
import { generateReferenceCode } from "../../src/lib/utils/referenceCode";

describe("Validation Schemas", () => {
  it("validates a correct visa inquiry input", () => {
    const input = {
      branch: "visa",
      fullName: "Ahmed Hassan",
      email: "ahmed@example.com",
      phone: "+971500000000",
      message: "Need visa assistance",
    };

    const result = inquirySchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("fails on invalid email format", () => {
    const input = {
      branch: "visa",
      fullName: "Ahmed Hassan",
      email: "not-an-email",
      phone: "+971500000000",
    };

    const result = inquirySchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("detects spam honeypot input", () => {
    const input = {
      branch: "jobs",
      fullName: "Spam Bot",
      email: "bot@example.com",
      phone: "+1234567890",
      honeypot: "http://spam-link.com",
    };

    const result = inquirySchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("validates admin login credentials", () => {
    const valid = loginSchema.safeParse({ email: "admin@hbs.demo", password: "password123" });
    expect(valid.success).toBe(true);

    const invalid = loginSchema.safeParse({ email: "bad-email", password: "123" });
    expect(invalid.success).toBe(false);
  });
});

describe("Reference Code Generator", () => {
  it("generates category-prefixed reference code format", () => {
    const visaCode = generateReferenceCode("visa");
    const jobCode = generateReferenceCode("jobs");

    expect(visaCode).toMatch(/^HBS-VIS-\d{4}$/);
    expect(jobCode).toMatch(/^HBS-JOB-\d{4}$/);
  });
});

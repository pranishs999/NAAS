import { describe, it, expect } from "vitest";

describe("Backup & Restore Data Serialization", () => {
  it("serializes full backup object into valid JSON string", () => {
    const backupObj = {
      exportedAt: new Date().toISOString(),
      isDemoBackup: true,
      version: "1.0",
      data: {
        inquiries: [{ id: "inq-1", referenceCode: "HBS-VIS-0001", fullName: "Test User" }],
      },
    };

    const jsonString = JSON.stringify(backupObj);
    const parsed = JSON.parse(jsonString);

    expect(parsed.isDemoBackup).toBe(true);
    expect(parsed.data.inquiries.length).toBe(1);
    expect(parsed.data.inquiries[0].referenceCode).toBe("HBS-VIS-0001");
  });

  it("handles invalid backup JSON gracefully", () => {
    const invalidJson = "{ bad json string";
    let errorCaught = false;

    try {
      JSON.parse(invalidJson);
    } catch {
      errorCaught = true;
    }

    expect(errorCaught).toBe(true);
  });
});

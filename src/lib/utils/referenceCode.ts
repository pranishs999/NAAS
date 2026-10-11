/**
 * Reference Code Generator (Demo Local)
 * Source: context.md §3.2, Q34, Q76
 * Format (PROVISIONAL): Category-prefixed sequential codes
 * Visa Branch: HBS-VIS-0001, HBS-VIS-0002...
 * Job Branch:  HBS-JOB-0001, HBS-JOB-0002...
 */

export function generateReferenceCode(branch: "visa" | "jobs"): string {
  if (typeof window === "undefined") {
    // Server fallback generator with timestamp counter
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `HBS-${branch === "visa" ? "VIS" : "JOB"}-${rand}`;
  }

  const key = `hbs_ref_counter_${branch}`;
  const currentRaw = localStorage.getItem(key);
  let count = currentRaw ? parseInt(currentRaw, 10) : 1;

  if (isNaN(count)) count = 1;

  const paddedCounter = String(count).padStart(4, "0");
  const code = `HBS-${branch === "visa" ? "VIS" : "JOB"}-${paddedCounter}`;

  // Increment and persist counter
  localStorage.setItem(key, String(count + 1));

  return code;
}

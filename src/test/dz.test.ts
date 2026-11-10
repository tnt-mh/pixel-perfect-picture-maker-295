import { describe, it, expect } from "vitest";
import { normalizeDzPhone, formatDA, WILAYAS } from "@/lib/dz";

describe("Algerian localisation", () => {
  it("normalizes local mobile numbers to +213", () => {
    expect(normalizeDzPhone("0555 12 34 56")).toBe("+213555123456");
    expect(normalizeDzPhone("+213 661234567")).toBe("+213661234567");
  });
  it("rejects non-mobile numbers", () => {
    expect(normalizeDzPhone("021123456")).toBeNull();
  });
  it("lists all 58 wilayas", () => {
    expect(WILAYAS).toHaveLength(58);
  });
  it("shows prices in DA", () => {
    expect(formatDA(1500)).toMatch(/DA$/);
  });
});

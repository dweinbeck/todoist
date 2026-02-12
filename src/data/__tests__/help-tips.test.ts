import { describe, expect, it } from "vitest";
import { helpTips } from "@/data/help-tips";

describe("help-tips catalog", () => {
  it("every tip ID in the catalog has non-empty string text", () => {
    for (const [id, text] of Object.entries(helpTips)) {
      expect(typeof text).toBe("string");
      expect(
        text.length,
        `Tip "${id}" should have non-empty text`,
      ).toBeGreaterThan(0);
    }
  });

  it("HelpTipId type covers at least 6 tips", () => {
    expect(Object.keys(helpTips).length).toBeGreaterThanOrEqual(6);
  });
});

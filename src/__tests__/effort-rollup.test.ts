import { describe, expect, it } from "vitest";
import { computeEffortSum, EFFORT_VALUES } from "@/lib/effort";

describe("computeEffortSum", () => {
  it("sums effort for open tasks only", () => {
    const tasks = [
      { effort: 3, status: "OPEN" },
      { effort: 5, status: "COMPLETED" },
      { effort: 8, status: "OPEN" },
    ];
    expect(computeEffortSum(tasks)).toBe(11);
  });

  it("excludes tasks with null effort", () => {
    const tasks = [
      { effort: null, status: "OPEN" },
      { effort: 5, status: "OPEN" },
    ];
    expect(computeEffortSum(tasks)).toBe(5);
  });

  it("returns 0 for empty array", () => {
    expect(computeEffortSum([])).toBe(0);
  });

  it("returns 0 when all tasks are completed", () => {
    const tasks = [
      { effort: 3, status: "COMPLETED" },
      { effort: 5, status: "COMPLETED" },
    ];
    expect(computeEffortSum(tasks)).toBe(0);
  });

  it("returns 0 when all tasks are unscored", () => {
    const tasks = [
      { effort: null, status: "OPEN" },
      { effort: null, status: "OPEN" },
    ];
    expect(computeEffortSum(tasks)).toBe(0);
  });

  it("handles mix of scored, unscored, open, and completed tasks", () => {
    const tasks = [
      { effort: 1, status: "OPEN" },
      { effort: null, status: "OPEN" },
      { effort: 13, status: "COMPLETED" },
      { effort: 5, status: "OPEN" },
      { effort: null, status: "COMPLETED" },
      { effort: 8, status: "OPEN" },
    ];
    expect(computeEffortSum(tasks)).toBe(14); // 1 + 5 + 8
  });

  it("sums all valid effort values correctly", () => {
    const tasks = EFFORT_VALUES.map((v) => ({
      effort: v,
      status: "OPEN" as const,
    }));
    expect(computeEffortSum(tasks)).toBe(1 + 2 + 3 + 5 + 8 + 13); // 32
  });

  it("handles single scored open task", () => {
    const tasks = [{ effort: 13, status: "OPEN" }];
    expect(computeEffortSum(tasks)).toBe(13);
  });
});

describe("EFFORT_VALUES", () => {
  it("contains exactly the Fibonacci-like scale values", () => {
    expect([...EFFORT_VALUES]).toEqual([1, 2, 3, 5, 8, 13]);
  });
});

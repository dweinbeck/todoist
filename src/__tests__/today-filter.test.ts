import { describe, expect, it } from "vitest";

/**
 * Tests for the Today filter date logic.
 * Today view should show tasks with deadline on today's date,
 * respecting the browser timezone.
 */

function isTaskDueToday(
  deadlineAt: Date | null,
  now: Date = new Date(),
): boolean {
  if (!deadlineAt) return false;
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);
  return deadlineAt >= startOfDay && deadlineAt < endOfDay;
}

describe("Today filter date logic", () => {
  const today = new Date(2026, 1, 10, 12, 0, 0); // Feb 10, 2026 noon

  it("includes task due today at midnight", () => {
    const deadline = new Date(2026, 1, 10, 0, 0, 0);
    expect(isTaskDueToday(deadline, today)).toBe(true);
  });

  it("includes task due today at 11:59pm", () => {
    const deadline = new Date(2026, 1, 10, 23, 59, 59);
    expect(isTaskDueToday(deadline, today)).toBe(true);
  });

  it("excludes task due yesterday", () => {
    const deadline = new Date(2026, 1, 9, 23, 59, 59);
    expect(isTaskDueToday(deadline, today)).toBe(false);
  });

  it("excludes task due tomorrow", () => {
    const deadline = new Date(2026, 1, 11, 0, 0, 0);
    expect(isTaskDueToday(deadline, today)).toBe(false);
  });

  it("excludes task with no deadline", () => {
    expect(isTaskDueToday(null, today)).toBe(false);
  });

  it("handles midnight boundary correctly", () => {
    const midnightToday = new Date(2026, 1, 10, 0, 0, 0);
    const justBeforeMidnight = new Date(2026, 1, 9, 23, 59, 59, 999);
    const midnightTomorrow = new Date(2026, 1, 11, 0, 0, 0);

    expect(isTaskDueToday(midnightToday, today)).toBe(true);
    expect(isTaskDueToday(justBeforeMidnight, today)).toBe(false);
    expect(isTaskDueToday(midnightTomorrow, today)).toBe(false);
  });
});

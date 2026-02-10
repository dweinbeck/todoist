import { describe, expect, it } from "vitest";

/**
 * Tests for the subtask nesting constraint.
 * Subtasks cannot have subtasks (one-level nesting enforced).
 *
 * The actual enforcement happens in task.service.ts createTask(),
 * so we test the logic by simulating parent task lookups.
 */

function validateSubtaskCreation(
  parentTask: {
    id: string;
    parentTaskId: string | null;
  } | null,
): { valid: boolean; error?: string } {
  if (!parentTask) {
    return { valid: false, error: "Parent task not found" };
  }
  if (parentTask.parentTaskId !== null) {
    return {
      valid: false,
      error: "Subtasks cannot have subtasks (one-level nesting only)",
    };
  }
  return { valid: true };
}

describe("Subtask nesting constraint", () => {
  it("allows creating a subtask on a top-level task", () => {
    const parentTask = { id: "task-1", parentTaskId: null };
    const result = validateSubtaskCreation(parentTask);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("rejects creating a subtask on another subtask", () => {
    const parentTask = { id: "subtask-1", parentTaskId: "task-1" };
    const result = validateSubtaskCreation(parentTask);
    expect(result.valid).toBe(false);
    expect(result.error).toBe(
      "Subtasks cannot have subtasks (one-level nesting only)",
    );
  });

  it("rejects creating a subtask when parent is not found", () => {
    const result = validateSubtaskCreation(null);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Parent task not found");
  });
});

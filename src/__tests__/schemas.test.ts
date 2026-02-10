import { describe, expect, it } from "vitest";
import { createTaskSchema } from "@/lib/schemas/task";
import { createWorkspaceSchema } from "@/lib/schemas/workspace";

describe("Zod schemas", () => {
  describe("createWorkspaceSchema", () => {
    it("accepts valid workspace name", () => {
      const result = createWorkspaceSchema.safeParse({ name: "My Workspace" });
      expect(result.success).toBe(true);
    });

    it("rejects empty workspace name", () => {
      const result = createWorkspaceSchema.safeParse({ name: "" });
      expect(result.success).toBe(false);
    });

    it("rejects workspace name over 100 chars", () => {
      const result = createWorkspaceSchema.safeParse({
        name: "a".repeat(101),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createTaskSchema", () => {
    it("accepts valid task with all fields", () => {
      const result = createTaskSchema.safeParse({
        projectId: "proj-1",
        name: "My Task",
        description: "Some description",
        deadlineAt: "2026-02-15T10:00:00",
        tagIds: ["tag-1"],
      });
      expect(result.success).toBe(true);
    });

    it("accepts minimal task (name and projectId only)", () => {
      const result = createTaskSchema.safeParse({
        projectId: "proj-1",
        name: "My Task",
      });
      expect(result.success).toBe(true);
    });

    it("rejects task without name", () => {
      const result = createTaskSchema.safeParse({
        projectId: "proj-1",
        name: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects task without projectId", () => {
      const result = createTaskSchema.safeParse({
        projectId: "",
        name: "My Task",
      });
      expect(result.success).toBe(false);
    });
  });
});

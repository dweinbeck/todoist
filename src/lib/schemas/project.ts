import { z } from "zod";

export const createProjectSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(1, "Name is required").max(100),
});

export const updateProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Name is required").max(100),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

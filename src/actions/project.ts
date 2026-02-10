"use server";

import { revalidatePath } from "next/cache";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/lib/schemas/project";
import {
  createProject as createProjectSvc,
  deleteProject as deleteProjectSvc,
  updateProject as updateProjectSvc,
} from "@/services/project.service";

export async function createProjectAction(formData: FormData) {
  const parsed = createProjectSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const project = await createProjectSvc(parsed.data);
  revalidatePath("/tasks");
  return { success: true, projectId: project.id };
}

export async function updateProjectAction(formData: FormData) {
  const parsed = updateProjectSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await updateProjectSvc(parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function deleteProjectAction(id: string) {
  await deleteProjectSvc(id);
  revalidatePath("/tasks");
  return { success: true };
}

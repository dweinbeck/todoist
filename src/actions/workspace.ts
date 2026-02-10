"use server";

import { revalidatePath } from "next/cache";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/lib/schemas/workspace";
import {
  createWorkspace as createWorkspaceSvc,
  deleteWorkspace as deleteWorkspaceSvc,
  updateWorkspace as updateWorkspaceSvc,
} from "@/services/workspace.service";

export async function createWorkspaceAction(formData: FormData) {
  const parsed = createWorkspaceSchema.safeParse({
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await createWorkspaceSvc(parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function updateWorkspaceAction(formData: FormData) {
  const parsed = updateWorkspaceSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await updateWorkspaceSvc(parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function deleteWorkspaceAction(id: string) {
  await deleteWorkspaceSvc(id);
  revalidatePath("/tasks");
  return { success: true };
}

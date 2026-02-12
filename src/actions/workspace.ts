"use server";

import { revalidatePath } from "next/cache";
import { verifyUser } from "@/lib/auth";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/lib/schemas/workspace";
import {
  createWorkspace as createWorkspaceSvc,
  deleteWorkspace as deleteWorkspaceSvc,
  updateWorkspace as updateWorkspaceSvc,
} from "@/services/workspace.service";

export async function createWorkspaceAction(
  idToken: string,
  formData: FormData,
) {
  const userId = await verifyUser(idToken);
  if (!userId) return { error: "Unauthorized" };

  const parsed = createWorkspaceSchema.safeParse({
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await createWorkspaceSvc(userId, parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function updateWorkspaceAction(
  idToken: string,
  formData: FormData,
) {
  const userId = await verifyUser(idToken);
  if (!userId) return { error: "Unauthorized" };

  const parsed = updateWorkspaceSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await updateWorkspaceSvc(userId, parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function deleteWorkspaceAction(idToken: string, id: string) {
  const userId = await verifyUser(idToken);
  if (!userId) return { error: "Unauthorized" };

  await deleteWorkspaceSvc(userId, id);
  revalidatePath("/tasks");
  return { success: true };
}

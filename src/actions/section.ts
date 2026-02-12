"use server";

import { revalidatePath } from "next/cache";
import { verifyUser } from "@/lib/auth";
import {
  createSectionSchema,
  updateSectionSchema,
} from "@/lib/schemas/section";
import {
  createSection as createSectionSvc,
  deleteSection as deleteSectionSvc,
  updateSection as updateSectionSvc,
} from "@/services/section.service";

export async function createSectionAction(idToken: string, formData: FormData) {
  const userId = await verifyUser(idToken);
  if (!userId) return { error: "Unauthorized" };

  const parsed = createSectionSchema.safeParse({
    projectId: formData.get("projectId"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await createSectionSvc(userId, parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function updateSectionAction(idToken: string, formData: FormData) {
  const userId = await verifyUser(idToken);
  if (!userId) return { error: "Unauthorized" };

  const parsed = updateSectionSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await updateSectionSvc(userId, parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function deleteSectionAction(idToken: string, id: string) {
  const userId = await verifyUser(idToken);
  if (!userId) return { error: "Unauthorized" };

  await deleteSectionSvc(userId, id);
  revalidatePath("/tasks");
  return { success: true };
}

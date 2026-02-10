"use server";

import { revalidatePath } from "next/cache";
import {
  createSectionSchema,
  updateSectionSchema,
} from "@/lib/schemas/section";
import {
  createSection as createSectionSvc,
  deleteSection as deleteSectionSvc,
  updateSection as updateSectionSvc,
} from "@/services/section.service";

export async function createSectionAction(formData: FormData) {
  const parsed = createSectionSchema.safeParse({
    projectId: formData.get("projectId"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await createSectionSvc(parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function updateSectionAction(formData: FormData) {
  const parsed = updateSectionSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await updateSectionSvc(parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function deleteSectionAction(id: string) {
  await deleteSectionSvc(id);
  revalidatePath("/tasks");
  return { success: true };
}

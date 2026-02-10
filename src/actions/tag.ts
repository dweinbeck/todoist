"use server";

import { revalidatePath } from "next/cache";
import { createTagSchema, updateTagSchema } from "@/lib/schemas/tag";
import {
  createTag as createTagSvc,
  deleteTag as deleteTagSvc,
  updateTag as updateTagSvc,
} from "@/services/tag.service";

export async function createTagAction(data: {
  name: string;
  color?: string | null;
}) {
  const parsed = createTagSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const tag = await createTagSvc(parsed.data);
  revalidatePath("/tasks");
  return { success: true, tagId: tag.id };
}

export async function updateTagAction(data: {
  id: string;
  name?: string;
  color?: string | null;
}) {
  const parsed = updateTagSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await updateTagSvc(parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function deleteTagAction(id: string) {
  await deleteTagSvc(id);
  revalidatePath("/tasks");
  return { success: true };
}

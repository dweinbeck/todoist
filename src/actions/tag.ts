"use server";

import { revalidatePath } from "next/cache";
import { verifyUser } from "@/lib/auth";
import { billingGuard, checkBillingAccess } from "@/lib/billing";
import { createTagSchema, updateTagSchema } from "@/lib/schemas/tag";
import {
  createTag as createTagSvc,
  deleteTag as deleteTagSvc,
  updateTag as updateTagSvc,
} from "@/services/tag.service";

export async function createTagAction(
  idToken: string,
  data: {
    name: string;
    color?: string | null;
  },
) {
  const userId = await verifyUser(idToken);
  if (!userId) return { error: "Unauthorized" };

  const billing = await checkBillingAccess(idToken);
  const blocked = billingGuard(billing);
  if (blocked) return blocked;

  const parsed = createTagSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const tag = await createTagSvc(userId, parsed.data);
  revalidatePath("/tasks");
  return { success: true, tagId: tag.id };
}

export async function updateTagAction(
  idToken: string,
  data: {
    id: string;
    name?: string;
    color?: string | null;
  },
) {
  const userId = await verifyUser(idToken);
  if (!userId) return { error: "Unauthorized" };

  const billing = await checkBillingAccess(idToken);
  const blocked = billingGuard(billing);
  if (blocked) return blocked;

  const parsed = updateTagSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await updateTagSvc(userId, parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function deleteTagAction(idToken: string, id: string) {
  const userId = await verifyUser(idToken);
  if (!userId) return { error: "Unauthorized" };

  const billing = await checkBillingAccess(idToken);
  const blocked = billingGuard(billing);
  if (blocked) return blocked;

  await deleteTagSvc(userId, id);
  revalidatePath("/tasks");
  return { success: true };
}

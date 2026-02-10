"use server";

import { revalidatePath } from "next/cache";
import { createTaskSchema, updateTaskSchema } from "@/lib/schemas/task";
import {
  assignTaskToSection,
  createTask as createTaskSvc,
  deleteTask as deleteTaskSvc,
  toggleTaskStatus as toggleTaskStatusSvc,
  updateTask as updateTaskSvc,
} from "@/services/task.service";

export async function createTaskAction(data: {
  projectId: string;
  sectionId?: string | null;
  parentTaskId?: string | null;
  name: string;
  description?: string;
  deadlineAt?: string | null;
  tagIds?: string[];
}) {
  const parsed = createTaskSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  try {
    const task = await createTaskSvc(parsed.data);
    revalidatePath("/tasks");
    return { success: true, taskId: task.id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create task" };
  }
}

export async function updateTaskAction(data: {
  id: string;
  name?: string;
  description?: string | null;
  deadlineAt?: string | null;
  sectionId?: string | null;
  tagIds?: string[];
}) {
  const parsed = updateTaskSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  await updateTaskSvc(parsed.data);
  revalidatePath("/tasks");
  return { success: true };
}

export async function deleteTaskAction(id: string) {
  await deleteTaskSvc(id);
  revalidatePath("/tasks");
  return { success: true };
}

export async function toggleTaskAction(id: string) {
  await toggleTaskStatusSvc(id);
  revalidatePath("/tasks");
  return { success: true };
}

export async function assignTaskToSectionAction(
  taskId: string,
  sectionId: string | null,
) {
  await assignTaskToSection(taskId, sectionId);
  revalidatePath("/tasks");
  return { success: true };
}

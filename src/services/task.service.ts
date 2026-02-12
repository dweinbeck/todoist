import { prisma } from "@/lib/db";
import type {
  CreateTaskInput,
  ReorderTaskInput,
  UpdateTaskInput,
} from "@/lib/schemas/task";

export async function createTask(input: CreateTaskInput) {
  if (input.parentTaskId) {
    const parent = await prisma.task.findUnique({
      where: { id: input.parentTaskId },
    });
    if (!parent) {
      throw new Error("Parent task not found");
    }
    if (parent.parentTaskId) {
      throw new Error("Subtasks cannot have subtasks (one-level nesting only)");
    }
  }

  const lastTask = await prisma.task.findFirst({
    where: {
      projectId: input.projectId,
      sectionId: input.sectionId ?? null,
      parentTaskId: input.parentTaskId ?? null,
    },
    orderBy: { order: "desc" },
  });
  const order = lastTask ? lastTask.order + 1 : 0;

  return prisma.task.create({
    data: {
      projectId: input.projectId,
      sectionId: input.sectionId ?? null,
      parentTaskId: input.parentTaskId ?? null,
      name: input.name,
      description: input.description ?? null,
      deadlineAt: input.deadlineAt ?? null,
      effort: input.effort ?? null,
      order,
      tags: input.tagIds?.length
        ? {
            create: input.tagIds.map((tagId) => ({ tagId })),
          }
        : undefined,
    },
    include: {
      subtasks: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
      section: true,
    },
  });
}

export async function updateTask(input: UpdateTaskInput) {
  const { id, tagIds, ...data } = input;

  if (tagIds !== undefined) {
    await prisma.taskTag.deleteMany({ where: { taskId: id } });
    if (tagIds.length > 0) {
      await prisma.taskTag.createMany({
        data: tagIds.map((tagId) => ({ taskId: id, tagId })),
      });
    }
  }

  return prisma.task.update({
    where: { id },
    data,
    include: {
      subtasks: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
      section: true,
    },
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}

export async function toggleTaskStatus(id: string) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new Error("Task not found");

  const newStatus = task.status === "OPEN" ? "COMPLETED" : "OPEN";
  return prisma.task.update({
    where: { id },
    data: { status: newStatus },
  });
}

export async function assignTaskToSection(
  taskId: string,
  sectionId: string | null,
) {
  return prisma.task.update({
    where: { id: taskId },
    data: { sectionId },
  });
}

export async function reorderTask(input: ReorderTaskInput) {
  return prisma.task.update({
    where: { id: input.id },
    data: { order: input.order },
  });
}

export async function getTasksForToday() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return prisma.task.findMany({
    where: {
      deadlineAt: { gte: startOfDay, lt: endOfDay },
      status: "OPEN",
      parentTaskId: null,
    },
    include: {
      subtasks: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
      section: true,
      project: true,
    },
    orderBy: { deadlineAt: "asc" },
  });
}

export async function getCompletedTasks(projectId?: string) {
  return prisma.task.findMany({
    where: {
      status: "COMPLETED",
      parentTaskId: null,
      ...(projectId ? { projectId } : {}),
    },
    include: {
      subtasks: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
      section: true,
      project: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function searchTasks(query: string) {
  return prisma.task.findMany({
    where: {
      parentTaskId: null,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      subtasks: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
      section: true,
      project: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

import { prisma } from "@/lib/db";
import type { CreateTagInput, UpdateTagInput } from "@/lib/schemas/tag";

export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });
}

export async function createTag(input: CreateTagInput) {
  return prisma.tag.create({
    data: {
      name: input.name,
      color: input.color ?? null,
    },
  });
}

export async function updateTag(input: UpdateTagInput) {
  const { id, ...data } = input;
  return prisma.tag.update({
    where: { id },
    data,
  });
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({
    where: { id },
  });
}

export async function getTasksByTag(tagId: string) {
  return prisma.task.findMany({
    where: {
      parentTaskId: null,
      tags: { some: { tagId } },
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

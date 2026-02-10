import { prisma } from "@/lib/db";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/lib/schemas/project";

export async function getAllProjects() {
  return prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            where: { parentTaskId: null },
            orderBy: { order: "asc" },
            include: {
              subtasks: { orderBy: { order: "asc" } },
              tags: { include: { tag: true } },
              section: true,
            },
          },
        },
      },
      tasks: {
        where: { parentTaskId: null, sectionId: null },
        orderBy: { order: "asc" },
        include: {
          subtasks: { orderBy: { order: "asc" } },
          tags: { include: { tag: true } },
          section: true,
        },
      },
    },
  });
}

export async function createProject(input: CreateProjectInput) {
  return prisma.project.create({
    data: {
      workspaceId: input.workspaceId,
      name: input.name,
    },
  });
}

export async function updateProject(input: UpdateProjectInput) {
  return prisma.project.update({
    where: { id: input.id },
    data: { name: input.name },
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({
    where: { id },
  });
}

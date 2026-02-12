import { prisma } from "@/lib/db";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "@/lib/schemas/workspace";

export async function getWorkspaces() {
  return prisma.workspace.findMany({
    include: {
      projects: {
        include: {
          _count: {
            select: {
              tasks: {
                where: { status: "OPEN", parentTaskId: null },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getWorkspace(id: string) {
  return prisma.workspace.findUnique({
    where: { id },
    include: {
      projects: {
        include: {
          _count: {
            select: {
              tasks: {
                where: { status: "OPEN", parentTaskId: null },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function createWorkspace(
  input: CreateWorkspaceInput,
  userId: string,
) {
  return prisma.workspace.create({
    data: { name: input.name, userId },
  });
}

export async function updateWorkspace(input: UpdateWorkspaceInput) {
  return prisma.workspace.update({
    where: { id: input.id },
    data: { name: input.name },
  });
}

export async function deleteWorkspace(id: string) {
  return prisma.workspace.delete({
    where: { id },
  });
}

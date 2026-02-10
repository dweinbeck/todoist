import { prisma } from "@/lib/db";
import type {
  CreateSectionInput,
  ReorderSectionInput,
  UpdateSectionInput,
} from "@/lib/schemas/section";

export async function createSection(input: CreateSectionInput) {
  const lastSection = await prisma.section.findFirst({
    where: { projectId: input.projectId },
    orderBy: { order: "desc" },
  });
  const order = lastSection ? lastSection.order + 1 : 0;

  return prisma.section.create({
    data: {
      projectId: input.projectId,
      name: input.name,
      order,
    },
  });
}

export async function updateSection(input: UpdateSectionInput) {
  return prisma.section.update({
    where: { id: input.id },
    data: { name: input.name },
  });
}

export async function deleteSection(id: string) {
  return prisma.section.delete({
    where: { id },
  });
}

export async function reorderSection(input: ReorderSectionInput) {
  return prisma.section.update({
    where: { id: input.id },
    data: { order: input.order },
  });
}

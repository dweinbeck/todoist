import { notFound } from "next/navigation";
import { getProject } from "@/services/project.service";
import { getTags } from "@/services/tag.service";
import { ProjectView } from "./project-view";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const [project, tags] = await Promise.all([getProject(projectId), getTags()]);

  if (!project) {
    notFound();
  }

  const allTags = tags.map((t) => ({ id: t.id, name: t.name, color: t.color }));
  const sections = project.sections.map((s) => ({ id: s.id, name: s.name }));

  return (
    <ProjectView project={project} allTags={allTags} sections={sections} />
  );
}

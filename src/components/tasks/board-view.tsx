"use client";

import { AddSectionButton } from "@/components/tasks/add-section-button";
import { AddTaskButton } from "@/components/tasks/add-task-button";
import { TaskCard } from "@/components/tasks/task-card";
import { computeEffortSum } from "@/lib/effort";
import type { ProjectWithSections } from "@/types";

interface BoardViewProps {
  project: ProjectWithSections;
  allTags: { id: string; name: string; color: string | null }[];
  sections: { id: string; name: string }[];
}

export function BoardView({ project, allTags, sections }: BoardViewProps) {
  const columns = [
    {
      id: null,
      name: "No Section",
      tasks: project.tasks,
    },
    ...project.sections.map((section) => ({
      id: section.id,
      name: section.name,
      tasks: section.tasks,
    })),
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-8rem)]">
      {columns.map((col) => (
        <div
          key={col.id ?? "unsectioned"}
          className="flex flex-col w-72 shrink-0"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              {col.name}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-xs text-text-tertiary">
                {col.tasks.length}
              </span>
              {computeEffortSum(col.tasks) > 0 && (
                <span className="text-xs text-amber">
                  ({computeEffortSum(col.tasks)})
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {col.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                projectId={project.id}
                allTags={allTags}
                sections={sections}
              />
            ))}
          </div>

          <div className="mt-2">
            <AddTaskButton
              projectId={project.id}
              sectionId={col.id}
              allTags={allTags}
              sections={sections}
            />
          </div>
        </div>
      ))}

      <div className="flex items-start w-72 shrink-0">
        <div className="w-full pt-0.5">
          <AddSectionButton projectId={project.id} />
        </div>
      </div>
    </div>
  );
}

import { TaskCard } from "@/components/tasks/task-card";
import { getTags } from "@/services/tag.service";
import { getTasksForToday } from "@/services/task.service";

export const metadata = { title: "Today" };

export default async function TodayPage() {
  const [tasks, tags] = await Promise.all([getTasksForToday(), getTags()]);
  const allTags = tags.map((t) => ({ id: t.id, name: t.name, color: t.color }));

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)] mb-6">
        Today
      </h1>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-text-tertiary">
            No tasks due today. Enjoy your day!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              projectId={task.projectId}
              allTags={allTags}
              sections={[]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

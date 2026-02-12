import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/tasks/sidebar";
import { getUserIdFromCookie } from "@/lib/auth";
import { getTags } from "@/services/tag.service";
import { getWorkspaces } from "@/services/workspace.service";
import type { SidebarWorkspace } from "@/types";

export default async function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getUserIdFromCookie();

  if (!userId) {
    return <AuthGuard>{null}</AuthGuard>;
  }

  const [workspaces, tags] = await Promise.all([
    getWorkspaces(userId),
    getTags(userId),
  ]);

  const sidebarWorkspaces: SidebarWorkspace[] = workspaces.map((w) => ({
    id: w.id,
    name: w.name,
    projects: w.projects.map((p) => ({
      id: p.id,
      name: p.name,
      openTaskCount: p._count.tasks,
    })),
  }));

  const allTags = tags.map((t) => ({ id: t.id, name: t.name, color: t.color }));

  return (
    <div className="flex h-screen bg-background">
      <Sidebar workspaces={sidebarWorkspaces} allTags={allTags} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

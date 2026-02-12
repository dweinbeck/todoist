import { cookies } from "next/headers";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { BillingProvider } from "@/components/billing/BillingProvider";
import { FreeWeekBanner } from "@/components/billing/FreeWeekBanner";
import { ReadOnlyBanner } from "@/components/billing/ReadOnlyBanner";
import { Sidebar } from "@/components/tasks/sidebar";
import { getUserIdFromCookie } from "@/lib/auth";
import { checkBillingAccess } from "@/lib/billing";
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

  const cookieStore = await cookies();
  const token = cookieStore.get("__session")?.value;

  const [workspaces, tags, billing] = await Promise.all([
    getWorkspaces(userId),
    getTags(userId),
    token
      ? checkBillingAccess(token)
      : Promise.resolve({
          mode: "readwrite" as const,
          reason: undefined as "free_week" | "unpaid" | undefined,
          weekStart: "",
        }),
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
    <BillingProvider
      billing={{
        mode: billing.mode,
        reason: "reason" in billing ? billing.reason : undefined,
      }}
    >
      <div className="flex h-screen bg-background">
        <Sidebar workspaces={sidebarWorkspaces} allTags={allTags} />
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 pt-6">
            {billing.mode === "readonly" && (
              <ReadOnlyBanner
                buyCreditsUrl={
                  process.env.BILLING_URL || "https://dan-weinbeck.com/billing"
                }
              />
            )}
            {billing.reason === "free_week" && <FreeWeekBanner />}
          </div>
          {children}
        </main>
      </div>
    </BillingProvider>
  );
}

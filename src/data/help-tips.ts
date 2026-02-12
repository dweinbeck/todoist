export type HelpTipId =
  | "sidebar-workspaces"
  | "sidebar-quick-add"
  | "board-view-toggle"
  | "task-sections"
  | "task-tags"
  | "task-subtasks"
  | "search-tasks"
  | "filters-tags";

export const helpTips: Record<HelpTipId, string> = {
  "sidebar-workspaces":
    "Workspaces group your projects. Click + to create one.",
  "sidebar-quick-add":
    "Quickly add a task to any project without navigating away.",
  "board-view-toggle":
    "Switch between list and board (Kanban) views for your project.",
  "task-sections":
    "Sections organize tasks within a project. Drag tasks between sections.",
  "task-tags":
    "Tags let you categorize tasks across projects. Filter by tag to find related tasks.",
  "task-subtasks":
    "Break large tasks into smaller subtasks. Check them off independently.",
  "search-tasks":
    "Search across all tasks by name. Results update as you type.",
  "filters-tags":
    "Create and manage tags here. Click a tag to see all tasks with that tag.",
};

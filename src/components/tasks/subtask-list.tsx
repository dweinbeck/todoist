"use client";

import { useState } from "react";
import {
  createTaskAction,
  deleteTaskAction,
  toggleTaskAction,
} from "@/actions/task";
import type { Task } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

interface SubtaskListProps {
  subtasks: Task[];
  parentTaskId: string;
  projectId: string;
}

export function SubtaskList({
  subtasks,
  parentTaskId,
  projectId,
}: SubtaskListProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!name.trim()) return;
    setLoading(true);
    const result = await createTaskAction({
      projectId,
      parentTaskId,
      name: name.trim(),
    });
    if (result.error) {
      alert(result.error);
    }
    setName("");
    setAdding(false);
    setLoading(false);
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
          Subtasks
        </span>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="text-xs text-gold hover:text-gold-hover transition-colors cursor-pointer"
        >
          + Add subtask
        </button>
      </div>

      {subtasks.map((subtask) => (
        <div
          key={subtask.id}
          className="flex items-center gap-2 py-1 px-2 rounded-[var(--radius-button)] hover:bg-gold-light/50 group"
        >
          <button
            type="button"
            onClick={() => toggleTaskAction(subtask.id)}
            className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer",
              subtask.status === "COMPLETED"
                ? "bg-sage border-sage text-white"
                : "border-border hover:border-gold",
            )}
          >
            {subtask.status === "COMPLETED" && (
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
          <span
            className={cn(
              "flex-1 text-sm",
              subtask.status === "COMPLETED"
                ? "line-through text-text-tertiary"
                : "text-text-primary",
            )}
          >
            {subtask.name}
          </span>
          <button
            type="button"
            onClick={() => deleteTaskAction(subtask.id)}
            className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-danger transition-all cursor-pointer"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {adding && (
        <div className="flex items-center gap-2 px-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Subtask name"
            autoFocus
            className="flex-1 px-2 py-1.5 text-sm border border-border rounded-[var(--radius-button)] bg-surface focus:outline-none focus:ring-2 focus:ring-gold/50"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setAdding(false);
            }}
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={loading}
            className="text-xs text-gold hover:text-gold-hover disabled:opacity-50 cursor-pointer"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

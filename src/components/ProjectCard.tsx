import type { DragEvent } from "react";
import type { Project } from "../types/project";
import { formatDate, isOverdue } from "../utils/formatDate";

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onDragStart: (project: Project, event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  dragging: boolean;
}

const statusClass: Record<string, string> = {
  Planning: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/30",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30",
  "On Hold": "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-500/30",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/30",
};

const priorityClass: Record<string, string> = {
  Low: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700",
  Medium: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-200 dark:ring-orange-500/30",
  High: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-200 dark:ring-red-500/30",
};

const cardClass: Record<string, string> = {
  Planning: "bg-gradient-to-br from-[#e8f4ff] to-white border-sky-100 dark:from-sky-950/70 dark:via-zinc-950 dark:to-zinc-950 dark:border-sky-500/20",
  "In Progress": "bg-gradient-to-br from-[#fff0cf] to-white border-amber-100 dark:from-amber-950/70 dark:via-zinc-950 dark:to-zinc-950 dark:border-amber-500/20",
  "On Hold": "bg-gradient-to-br from-[#eee9ff] to-white border-violet-100 dark:from-violet-950/70 dark:via-zinc-950 dark:to-zinc-950 dark:border-violet-500/20",
  Completed: "bg-gradient-to-br from-[#ffe6f5] to-white border-pink-100 dark:from-fuchsia-950/70 dark:via-zinc-950 dark:to-zinc-950 dark:border-fuchsia-500/20",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusClass[status]}`}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${priorityClass[priority]}`}>{priority}</span>;
}

function initials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ProjectCard({ project, onEdit, onDelete, onDragStart, onDragEnd, dragging }: Props) {
  const overdue = isOverdue(project.dueDate) && project.status !== "Completed";

  return (
    <article
      draggable
      onDragStart={(event) => onDragStart(project, event)}
      onDragEnd={onDragEnd}
      className={`cursor-grab rounded-lg border p-4 shadow-[0_14px_34px_rgba(30,24,45,0.08)] transition active:cursor-grabbing dark:shadow-none ${cardClass[project.status]} ${dragging ? "scale-[0.98] opacity-50 ring-2 ring-slate-300 dark:ring-zinc-600" : "hover:-translate-y-0.5"}`}
      aria-label={`${project.projectName} project card`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-[10px] font-black text-white ring-2 ring-white dark:bg-zinc-100 dark:text-zinc-950 dark:ring-zinc-950">
          {initials(project.clientName)}
        </span>

        <div className="flex shrink-0 gap-1">
          <button type="button" draggable={false} onClick={() => onEdit(project)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/75 text-slate-500 shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:bg-zinc-800 dark:text-zinc-400 dark:shadow-none dark:hover:bg-zinc-700 dark:hover:text-zinc-100" aria-label={`Edit ${project.projectName}`}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
          </button>
          <button type="button" draggable={false} onClick={() => onDelete(project)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/75 text-slate-500 shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:bg-zinc-800 dark:text-zinc-400 dark:shadow-none dark:hover:bg-zinc-700 dark:hover:text-zinc-100" aria-label={`Delete ${project.projectName}`}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4h8v2" /><path strokeLinecap="round" strokeLinejoin="round" d="m6 6 1 15h10l1-15" /></svg>
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-black uppercase tracking-wide text-slate-400 dark:text-zinc-500">{project.clientName}</p>
        <h3 className="mt-1 text-base font-black leading-snug text-slate-950 dark:text-zinc-100">{project.projectName}</h3>
        {project.description && <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">{project.description}</p>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={project.status} />
        <PriorityBadge priority={project.priority} />
        {overdue && <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white dark:bg-red-500/80">Overdue</span>}
      </div>

      <div className="mt-4 border-t border-white/70 pt-3 text-xs font-bold text-slate-600 dark:border-zinc-800 dark:text-zinc-400">
        Due Date: <span className={overdue ? "text-red-700 dark:text-red-300" : "text-slate-950 dark:text-zinc-100"}>{formatDate(project.dueDate)}</span>
      </div>
    </article>
  );
}

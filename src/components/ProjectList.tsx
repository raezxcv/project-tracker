import { useState, type DragEvent } from "react";
import type { Project, ProjectStatus } from "../types/project";
import ProjectCard from "./ProjectCard";

interface Props {
  projects: Project[];
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onMove: (projectId: number, status: ProjectStatus) => void;
}

interface Lane {
  title: string;
  statuses: ProjectStatus[];
  targetStatus: ProjectStatus;
  dot: string;
}

const lanes: Lane[] = [
  { title: "To Do", statuses: ["Planning", "On Hold"], targetStatus: "Planning", dot: "bg-[#7c2d2d]" },
  { title: "In Progress", statuses: ["In Progress"], targetStatus: "In Progress", dot: "bg-[#8a5a00]" },
  { title: "Completed", statuses: ["Completed"], targetStatus: "Completed", dot: "bg-[#68215d]" },
];

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3" aria-label="Loading projects" aria-busy="true">
      {lanes.map((lane) => (
        <div key={lane.title} className="rounded-lg border border-slate-200 bg-white/45 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-4 h-11 animate-pulse rounded-lg bg-slate-100 dark:bg-zinc-800" />
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="h-52 animate-pulse rounded-lg bg-white dark:bg-zinc-900" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-lg border border-dashed border-slate-300 bg-white/75 p-10 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
      <div>
        <h2 className="text-base font-bold text-slate-950 dark:text-zinc-100">No projects found</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Create a project or adjust your search and filters.</p>
      </div>
    </div>
  );
}

export default function ProjectList({ projects, loading, onEdit, onDelete, onMove }: Props) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverLane, setDragOverLane] = useState<string | null>(null);

  if (loading) return <LoadingSkeleton />;
  if (projects.length === 0) return <EmptyState />;

  function handleDragStart(project: Project, event: DragEvent<HTMLElement>) {
    setDraggingId(project.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(project.id));
  }

  function handleDrop(status: ProjectStatus, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const projectId = Number(event.dataTransfer.getData("text/plain") || draggingId);
    if (Number.isFinite(projectId)) onMove(projectId, status);
    setDraggingId(null);
    setDragOverLane(null);
  }

  return (
    <section id="projects" className="scroll-mt-5 grid gap-4 lg:grid-cols-3" aria-label="Project board">
      {lanes.map((lane) => {
        const laneProjects = projects.filter((project) => lane.statuses.includes(project.status));
        const isDragOver = dragOverLane === lane.title;

        return (
          <div
            key={lane.title}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDragEnter={() => setDragOverLane(lane.title)}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragOverLane(null);
            }}
            onDrop={(event) => handleDrop(lane.targetStatus, event)}
            className={`rounded-lg border p-3 shadow-sm transition dark:shadow-none ${
              isDragOver
                ? "border-slate-400 bg-slate-100/80 ring-2 ring-slate-300 dark:border-zinc-500 dark:bg-zinc-800/80 dark:ring-zinc-700"
                : "border-slate-200 bg-white/35 dark:border-zinc-800 dark:bg-zinc-900/50"
            }`}
          >
            <div className="mb-4 flex h-11 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${lane.dot}`} />
                <h2 className="text-sm font-black text-slate-950 dark:text-zinc-100">{lane.title}</h2>
              </div>
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-slate-100 px-2 text-xs font-black text-slate-500 dark:bg-zinc-800 dark:text-zinc-300">
                {laneProjects.length}
              </span>
            </div>

            <div className="min-h-[140px] space-y-3">
              {laneProjects.length > 0 ? (
                laneProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDragStart={handleDragStart}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOverLane(null);
                    }}
                    dragging={draggingId === project.id}
                  />
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-slate-200 bg-white/60 p-5 text-center text-xs font-semibold text-slate-400 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-500">
                  Drop a project here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

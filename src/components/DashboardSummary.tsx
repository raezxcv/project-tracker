import type { Project, ProjectPriority, ProjectStatus } from "../types/project";
import { formatDate } from "../utils/formatDate";

interface Props {
  projects: Project[];
}

const statusStyles: Record<ProjectStatus, { dot: string; bg: string; text: string; border: string; gradient: string; icon: string }> = {
  Planning: {
    dot: "bg-sky-500",
    bg: "bg-sky-50 dark:bg-sky-500/10",
    text: "text-sky-700 dark:text-sky-200",
    border: "border-sky-200 dark:border-sky-500/25",
    gradient: "from-sky-50 via-white to-white dark:from-sky-950/25 dark:via-zinc-950 dark:to-zinc-950",
    icon: "compass",
  },
  "In Progress": {
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-200",
    border: "border-amber-200 dark:border-amber-500/25",
    gradient: "from-amber-50 via-white to-white dark:from-amber-950/25 dark:via-zinc-950 dark:to-zinc-950",
    icon: "play",
  },
  "On Hold": {
    dot: "bg-violet-500",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-200",
    border: "border-violet-200 dark:border-violet-500/25",
    gradient: "from-violet-50 via-white to-white dark:from-violet-950/25 dark:via-zinc-950 dark:to-zinc-950",
    icon: "pause",
  },
  Completed: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-200",
    border: "border-emerald-200 dark:border-emerald-500/25",
    gradient: "from-emerald-50 via-white to-white dark:from-emerald-950/25 dark:via-zinc-950 dark:to-zinc-950",
    icon: "check",
  },
};

const priorityStyles: Record<ProjectPriority, string> = {
  Low: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700",
  Medium: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-200 dark:ring-orange-500/25",
  High: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-200 dark:ring-red-500/25",
};

const statuses = Object.keys(statusStyles) as ProjectStatus[];

function Icon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const base = {
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "layers":
      return <svg {...base}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
    case "folder-open":
      return <svg {...base}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v2H3V7z" /><path d="M3 11v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H3z" /></svg>;
    case "activity":
      return <svg {...base}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
    case "alert":
      return <svg {...base}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
    case "check":
      return <svg {...base}><polyline points="20 6 9 17 4 12" /></svg>;
    case "clock":
      return <svg {...base}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>;
    case "target":
      return <svg {...base}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>;
    case "chart":
      return <svg {...base}><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M12 16V8" /><path d="M16 16v-3" /></svg>;
    case "calendar":
      return <svg {...base}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>;
    case "sparkles":
      return <svg {...base}><path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" /><path d="M5 14l.7 1.8L7.5 16.5l-1.8.7L5 19l-.7-1.8-1.8-.7 1.8-.7L5 14z" /></svg>;
    case "compass":
      return <svg {...base}><circle cx="12" cy="12" r="9" /><path d="m15 9-2 5-5 2 2-5 5-2z" /></svg>;
    case "play":
      return <svg {...base}><polygon points="7 4 19 12 7 20 7 4" fill="currentColor" stroke="none" /></svg>;
    case "pause":
      return <svg {...base}><rect x="7" y="5" width="3" height="14" rx="1" /><rect x="14" y="5" width="3" height="14" rx="1" /></svg>;
    default:
      return <svg {...base}><path d="M12 5v14M5 12h14" /></svg>;
  }
}

function MetricCard({
  label,
  value,
  helper,
  icon,
  accent,
  gradient,
}: {
  label: string;
  value: number | string;
  helper: string;
  icon: string;
  accent: string;
  gradient: string;
}) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-gradient-to-br p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 ${gradient}`}>
      <div className="flex items-center justify-between gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg shadow-sm ${accent}`}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">{label}</span>
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-zinc-100">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-zinc-400">{helper}</p>
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-950 to-slate-700 text-white shadow-sm dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-950">
        <Icon name={icon} />
      </span>
      <div>
        <p className="text-sm font-black text-slate-950 dark:text-zinc-100">{title}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
}

function ProgressBar({ value, className = "bg-gradient-to-r from-slate-950 to-slate-600 dark:from-zinc-100 dark:to-zinc-400" }: { value: number; className?: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
      <div className={`h-full rounded-full transition-all duration-500 ${className}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function DashboardSummary({ projects }: Props) {
  const total = projects.length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const active = projects.filter((p) => p.status === "In Progress").length;
  const open = projects.filter((p) => p.status !== "Completed").length;
  const highPriority = projects.filter((p) => p.priority === "High").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const dueSoon = [...projects]
    .filter((p) => p.status !== "Completed")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const focusItems = [
    { label: "Open Projects", value: open, detail: "Need delivery attention", icon: "folder-open", accent: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200", gradient: "from-sky-50 via-white to-white dark:from-sky-950/20 dark:via-zinc-950 dark:to-zinc-950" },
    { label: "Completed", value: completed, detail: "Closed successfully", icon: "check", accent: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200", gradient: "from-emerald-50 via-white to-white dark:from-emerald-950/20 dark:via-zinc-950 dark:to-zinc-950" },
    { label: "High Priority", value: highPriority, detail: "Flagged as urgent", icon: "alert", accent: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200", gradient: "from-red-50 via-white to-white dark:from-red-950/20 dark:via-zinc-950 dark:to-zinc-950" },
  ];

  return (
    <section id="dashboard" className="space-y-4" aria-label="Project dashboard">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50/70 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-sky-950/20">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/75 dark:text-zinc-400">
                  <Icon name="sparkles" className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
                  Workspace overview
                </span>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-zinc-100">Project Workspace Overview</h2>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-slate-500 dark:text-zinc-400">
                  A unified readout for workload, delivery momentum, and priority pressure across active client projects.
                </p>
              </div>

              <div className="w-full rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75 lg:max-w-xs">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">Completion</p>
                    <p className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-zinc-100">{completionRate}%</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-950 to-slate-700 text-white shadow-sm dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-950">
                    <Icon name="target" />
                  </span>
                </div>
                <div className="mt-4">
                  <ProgressBar value={completionRate} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total" value={total} helper="All projects" icon="layers" accent="bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300" gradient="from-white via-white to-slate-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950" />
            <MetricCard label="Open" value={open} helper="Not yet completed" icon="folder-open" accent="bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200" gradient="from-white via-sky-50/40 to-white dark:from-zinc-900 dark:via-sky-950/15 dark:to-zinc-950" />
            <MetricCard label="Active" value={active} helper="In progress now" icon="activity" accent="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200" gradient="from-white via-amber-50/40 to-white dark:from-zinc-900 dark:via-amber-950/15 dark:to-zinc-950" />
            <MetricCard label="High" value={highPriority} helper="High priority" icon="alert" accent="bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200" gradient="from-white via-red-50/40 to-white dark:from-zinc-900 dark:via-red-950/15 dark:to-zinc-950" />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
          <div className="flex items-center justify-between gap-3">
            <SectionTitle icon="chart" title="Status Mix" subtitle="Counts by workflow stage" />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
              {total} total
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {statuses.map((status) => {
              const count = projects.filter((p) => p.status === status).length;
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              const style = statusStyles[status];

              return (
                <div key={status}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-700 dark:text-zinc-300">
                    <span className="flex items-center gap-2">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-md ${style.bg} ${style.text}`}>
                        <Icon name={style.icon} className="h-3.5 w-3.5" />
                      </span>
                      {status}
                    </span>
                    <span className="text-slate-950 dark:text-zinc-100">{count}</span>
                  </div>
                  <ProgressBar value={percentage} className={style.dot} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.45fr)]">
        <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
          <div className="flex items-center justify-between gap-3">
            <SectionTitle icon="calendar" title="Upcoming Work" subtitle="Open projects sorted by due date" />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
              {dueSoon.length}
            </span>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {dueSoon.length > 0 ? (
              dueSoon.map((project) => {
                const statusStyle = statusStyles[project.status];
                return (
                  <article
                    key={project.id}
                    className={`rounded-lg border bg-gradient-to-br p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${statusStyle.gradient} ${statusStyle.border}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${statusStyle.bg} ${statusStyle.text}`}>
                            <Icon name={statusStyle.icon} className="h-3.5 w-3.5" />
                          </span>
                          <p className="truncate text-sm font-black tracking-tight text-slate-950 dark:text-zinc-100">{project.projectName}</p>
                        </div>
                        <p className="mt-1.5 truncate text-xs font-bold text-slate-500 dark:text-zinc-400">{project.clientName}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ring-inset ${priorityStyles[project.priority]}`}>
                        {project.priority}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs font-bold text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {project.status}
                      </span>
                      <span className="flex items-center gap-1 text-slate-700 dark:text-zinc-300">
                        <Icon name="clock" className="h-3.5 w-3.5" />
                        {formatDate(project.dueDate)}
                      </span>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                No open projects.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
          <SectionTitle icon="sparkles" title="Delivery Focus" subtitle="Simple workload readout" />

          <div className="mt-5 space-y-3">
            {focusItems.map((item) => (
              <div key={item.label} className={`flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-gradient-to-br p-4 dark:border-zinc-800 ${item.gradient}`}>
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm ${item.accent}`}>
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black leading-tight text-slate-950 dark:text-zinc-100">{item.label}</p>
                    <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500 dark:text-zinc-400">{item.detail}</p>
                  </div>
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-zinc-100">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

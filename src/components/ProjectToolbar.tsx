import type { ProjectStatus, ProjectPriority } from "../types/project";
import { PROJECT_STATUSES, PROJECT_PRIORITIES } from "../types/project";
import CustomSelect, { type SelectOption } from "./CustomSelect";

export type SortField = "dueDate" | "startDate" | "priority" | "projectName";

interface Props {
  statusFilter: ProjectStatus | "All";
  onStatusFilterChange: (value: ProjectStatus | "All") => void;
  priorityFilter: ProjectPriority | "All";
  onPriorityFilterChange: (value: ProjectPriority | "All") => void;
  sortField: SortField;
  onSortFieldChange: (value: SortField) => void;
}

const panelClass =
  "relative flex h-16 items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 shadow-sm transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800";

const statusOptions: SelectOption<ProjectStatus | "All">[] = [
  { value: "All", label: "All" },
  ...PROJECT_STATUSES.map((status) => ({ value: status, label: status })),
];

const priorityOptions: SelectOption<ProjectPriority | "All">[] = [
  { value: "All", label: "All" },
  ...PROJECT_PRIORITIES.map((priority) => ({ value: priority, label: priority })),
];

const sortOptions: SelectOption<SortField>[] = [
  { value: "dueDate", label: "Due Date" },
  { value: "startDate", label: "Start Date" },
  { value: "priority", label: "Priority" },
  { value: "projectName", label: "Project Name" },
];

function sortText(value: SortField) {
  return sortOptions.find((option) => option.value === value)?.label ?? "Due Date";
}

export default function ProjectToolbar({
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortField,
  onSortFieldChange,
}: Props) {
  return (
    <section className="grid gap-3 md:grid-cols-3" aria-label="Project controls">
      <label className={panelClass}>
        <span className="min-w-0">
          <span className="block text-sm font-black text-slate-950 dark:text-zinc-100">Task Overview</span>
          <span className="block text-[11px] text-slate-400 dark:text-zinc-500">Filter by status</span>
        </span>
        <CustomSelect value={statusFilter} options={statusOptions} onChange={onStatusFilterChange} ariaLabel="Filter by status" />
      </label>

      <label className={panelClass}>
        <span className="min-w-0">
          <span className="block text-sm font-black text-slate-950 dark:text-zinc-100">Daily Workflow</span>
          <span className="block text-[11px] text-slate-400 dark:text-zinc-500">Filter by priority</span>
        </span>
        <CustomSelect value={priorityFilter} options={priorityOptions} onChange={onPriorityFilterChange} ariaLabel="Filter by priority" />
      </label>

      <label className={panelClass}>
        <span className="min-w-0">
          <span className="block text-sm font-black text-slate-950 dark:text-zinc-100">Sort & Filter</span>
          <span className="block text-[11px] text-slate-400 dark:text-zinc-500">{sortText(sortField)}</span>
        </span>
        <CustomSelect value={sortField} options={sortOptions} onChange={onSortFieldChange} ariaLabel="Sort projects" />
      </label>
    </section>
  );
}

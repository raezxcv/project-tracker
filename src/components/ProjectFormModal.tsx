import { useState, useEffect, useRef } from "react";
import type { Project, ProjectStatus, ProjectPriority } from "../types/project";
import { PROJECT_STATUSES, PROJECT_PRIORITIES } from "../types/project";
import CustomSelect, { type SelectOption } from "./CustomSelect";
import {
  validateProject,
  hasErrors,
  type ProjectFormData,
  type ValidationErrors,
} from "../utils/projectValidation";

interface Props {
  project?: Project | null;
  onSave: (data: Omit<Project, "id">) => void;
  onClose: () => void;
}

const statusOptions: SelectOption<ProjectStatus | "">[] = [
  { value: "", label: "Select status..." },
  ...PROJECT_STATUSES.map((status) => ({ value: status, label: status })),
];

const priorityOptions: SelectOption<ProjectPriority | "">[] = [
  { value: "", label: "Select priority..." },
  ...PROJECT_PRIORITIES.map((priority) => ({ value: priority, label: priority })),
];

const EMPTY_FORM: ProjectFormData = {
  clientName: "",
  projectName: "",
  description: "",
  status: "",
  priority: "",
  startDate: "",
  dueDate: "",
};

function projectToForm(project?: Project | null): ProjectFormData {
  if (!project) return EMPTY_FORM;
  return {
    clientName: project.clientName,
    projectName: project.projectName,
    description: project.description,
    status: project.status,
    priority: project.priority,
    startDate: project.startDate,
    dueDate: project.dueDate,
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-300">{message}</p>;
}

export default function ProjectFormModal({ project, onSave, onClose }: Props) {
  const isEdit = Boolean(project);
  const [form, setForm] = useState<ProjectFormData>(() => projectToForm(project));
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => firstInputRef.current?.focus(), 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleChange(field: keyof ProjectFormData, value: string) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (submitted) setErrors(validateProject(updated));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    const errs = validateProject(form);
    setErrors(errs);
    if (hasErrors(errs)) return;

    onSave({
      clientName: form.clientName.trim(),
      projectName: form.projectName.trim(),
      description: form.description.trim(),
      status: form.status as ProjectStatus,
      priority: form.priority as ProjectPriority,
      startDate: form.startDate,
      dueDate: form.dueDate,
    });
    onClose();
  }

  const inputBase =
    "w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-4";
  const inputNormal = `${inputBase} border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-200/70 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-800`;
  const inputError = `${inputBase} border-red-300 bg-red-50/50 text-red-900 focus:border-red-400 focus:ring-red-100 dark:border-red-900 dark:bg-red-950/20 dark:text-red-200 dark:focus:ring-red-950/50`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md animate-fade-in dark:bg-black/70"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-2xl transition-colors duration-300 animate-slide-up dark:border-zinc-800 dark:bg-zinc-900">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 id="modal-title" className="text-base font-black text-slate-950 dark:text-zinc-100">
            {isEdit ? "Edit Project Details" : "Create New Project"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 px-6 py-5">
          <div>
            <label htmlFor="form-clientName" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Client Name <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="form-clientName"
              type="text"
              value={form.clientName}
              onChange={(event) => handleChange("clientName", event.target.value)}
              className={errors.clientName ? inputError : inputNormal}
              placeholder="e.g. Acme Corporation"
              aria-required="true"
            />
            <FieldError message={errors.clientName} />
          </div>

          <div>
            <label htmlFor="form-projectName" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Project Name <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="form-projectName"
              type="text"
              value={form.projectName}
              onChange={(event) => handleChange("projectName", event.target.value)}
              className={errors.projectName ? inputError : inputNormal}
              placeholder="e.g. Website Redesign"
              aria-required="true"
            />
            <FieldError message={errors.projectName} />
          </div>

          <div>
            <label htmlFor="form-description" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Description <span className="font-semibold normal-case text-slate-400 dark:text-zinc-500">(optional)</span>
            </label>
            <textarea
              id="form-description"
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
              rows={3}
              className={`${inputNormal} resize-none`}
              placeholder="Brief overview of the project scope..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Status <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <CustomSelect
                value={form.status as ProjectStatus | ""}
                options={statusOptions}
                onChange={(value) => handleChange("status", value)}
                placeholder="Select status..."
                ariaLabel="Project status"
                invalid={Boolean(errors.status)}
              />
              <FieldError message={errors.status} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Priority <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <CustomSelect
                value={form.priority as ProjectPriority | ""}
                options={priorityOptions}
                onChange={(value) => handleChange("priority", value)}
                placeholder="Select priority..."
                ariaLabel="Project priority"
                invalid={Boolean(errors.priority)}
              />
              <FieldError message={errors.priority} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="form-startDate" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Start Date
              </label>
              <input
                id="form-startDate"
                type="date"
                value={form.startDate}
                onChange={(event) => handleChange("startDate", event.target.value)}
                className={inputNormal}
              />
            </div>

            <div>
              <label htmlFor="form-dueDate" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Due Date
              </label>
              <input
                id="form-dueDate"
                type="date"
                value={form.dueDate}
                onChange={(event) => handleChange("dueDate", event.target.value)}
                className={errors.dueDate ? inputError : inputNormal}
              />
              <FieldError message={errors.dueDate} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-3.5 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4.5 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-slate-950 px-5.5 py-2.5 text-sm font-black text-white shadow-md transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300 dark:focus:ring-offset-zinc-900"
            >
              {isEdit ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


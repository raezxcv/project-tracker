import { useState, useMemo, useCallback, useEffect } from "react";
import { useProjects } from "./hooks/useProjects";
import type { Project, ProjectStatus, ProjectPriority } from "./types/project";
import DashboardSummary from "./components/DashboardSummary";
import ProjectToolbar, { type SortField } from "./components/ProjectToolbar";
import ProjectList from "./components/ProjectList";
import ProjectFormModal from "./components/ProjectFormModal";
import ConfirmDialog from "./components/ConfirmDialog";
import ThemeSwitch from "./components/ThemeSwitch";
import { isOverdue } from "./utils/formatDate";

const PRIORITY_ORDER: Record<ProjectPriority, number> = { High: 3, Medium: 2, Low: 1 };

type SectionId = "dashboard" | "projects";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

function Icon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const common = {
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "search") return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></svg>;
  if (name === "grid") return <svg {...common}><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /></svg>;
  if (name === "folder") return <svg {...common}><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
  if (name === "chart") return <svg {...common}><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M12 16V8" /><path d="M16 16v-3" /></svg>;
  return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
}

export default function App() {
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | "All">("All");
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [confirmProject, setConfirmProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>(() => {
    const stored = localStorage.getItem("activeSection");
    return (stored === "dashboard" || stored === "projects") ? stored : "projects";
  });
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".notif-container")) setNotifOpen(false);
      if (!target.closest(".profile-container")) setProfileOpen(false);
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3000);
  }, []);

  const displayedProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...projects]
      .filter((project) => {
        const matchesSearch =
          !query ||
          project.clientName.toLowerCase().includes(query) ||
          project.projectName.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query);
        const matchesStatus = statusFilter === "All" || project.status === statusFilter;
        const matchesPriority = priorityFilter === "All" || project.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortField === "priority") return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
        if (sortField === "projectName") return a.projectName.localeCompare(b.projectName);
        return a[sortField].localeCompare(b[sortField]);
      });
  }, [projects, search, statusFilter, priorityFilter, sortField]);

  function handleOpenCreate() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function handleOpenEdit(project: Project) {
    setEditingProject(project);
    setModalOpen(true);
  }

  function handleSave(data: Omit<Project, "id">) {
    if (editingProject) {
      updateProject(editingProject.id, data);
      showToast("Project updated", "success");
    } else {
      createProject(data);
      showToast("Project created", "success");
    }
  }

  function handleMoveProject(projectId: number, status: ProjectStatus) {
    const project = projects.find((item) => item.id === projectId);
    if (!project || project.status === status) return;
    updateProject(project.id, { ...project, status });
    showToast(`Moved to ${status}`, "info");
  }

  function handleConfirmDelete() {
    if (!confirmProject) return;
    deleteProject(confirmProject.id);
    showToast("Project deleted", "info");
    setConfirmProject(null);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setSortField("dueDate");
  }

  function goToSection(section: SectionId) {
    setActiveSection(section);
    localStorage.setItem("activeSection", section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const hasFilters = search.trim() !== "" || statusFilter !== "All" || priorityFilter !== "All" || sortField !== "dueDate";
  const activeCount = projects.filter((project) => project.status === "In Progress").length;
  const completedCount = projects.filter((project) => project.status === "Completed").length;
  const highPriorityCount = projects.filter((project) => project.priority === "High").length;
  const overdueCount = useMemo(() => {
    return projects.filter((project) => isOverdue(project.dueDate) && project.status !== "Completed").length;
  }, [projects]);
  const totalCount = projects.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f4f1f7] text-[#17151f] dark:bg-zinc-950 dark:text-zinc-100">
      <div className="grid min-h-screen w-full grid-cols-[72px_minmax(0,1fr)] bg-white/70 dark:bg-zinc-950 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="sticky top-0 flex h-screen flex-col border-r border-slate-200/70 bg-gradient-to-b from-white to-[#f7ecf7] p-3 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900 lg:p-5">
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </span>
            <span className="hidden text-lg font-black tracking-tight lg:inline">Project Tracker</span>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300"
            aria-label="Start a Task"
          >
            <Icon name="plus" />
            <span className="hidden lg:inline">Start a Task</span>
          </button>

          <nav className="mt-6 space-y-2" aria-label="Workspace sections">
            {[
              { id: "dashboard" as const, label: "Dashboard", icon: "chart" },
              { id: "projects" as const, label: "Projects", icon: "folder" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSection(item.id)}
                className={`flex h-10 w-full items-center justify-center gap-3 rounded-lg px-3 text-sm font-bold transition lg:justify-start ${activeSection === item.id
                    ? "bg-white text-slate-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                aria-current={activeSection === item.id ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon name={item.icon} />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/50 p-4 shadow-sm dark:border-zinc-800/80 dark:from-zinc-900 dark:to-zinc-950 lg:block">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs font-black text-slate-900 dark:text-zinc-100">Workspace Health</p>
              </div>
              <span className="text-[11px] font-black text-slate-800 dark:text-zinc-300">{completionPercentage}% Done</span>
            </div>

            <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-slate-950 dark:bg-zinc-100 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="mt-3.5 grid grid-cols-3 gap-1.5 text-center">
              <div className="rounded-xl bg-slate-50/70 p-2 dark:bg-zinc-900/50 border border-slate-100/50 dark:border-zinc-800/20">
                <p className="text-sm font-black text-slate-950 dark:text-zinc-100">{activeCount}</p>
                <p className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Active</p>
              </div>
              <div className="rounded-xl bg-slate-50/70 p-2 dark:bg-zinc-900/50 border border-slate-100/50 dark:border-zinc-800/20">
                <p className="text-sm font-black text-slate-950 dark:text-zinc-100">{completedCount}</p>
                <p className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Done</p>
              </div>
              <div className="rounded-xl bg-slate-50/70 p-2 dark:bg-zinc-900/50 border border-slate-100/50 dark:border-zinc-800/20">
                <p className="text-sm font-black text-slate-950 dark:text-zinc-100">{highPriorityCount}</p>
                <p className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">High</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-col gap-4 p-4 sm:p-6 animate-fade-in">
          <header className="flex flex-col gap-4 border-b border-slate-200/70 pb-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight text-slate-950 dark:text-zinc-100">
                {activeSection === "dashboard" ? "Dashboard" : "Project Board"}
              </h1>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                {activeSection === "dashboard"
                  ? "Project performance and workspace analytics at a glance"
                  : "Drag and drop tasks between columns to update their status"}
              </p>
            </div>

            <div className="flex w-full flex-1 flex-wrap items-center justify-start gap-3 sm:max-w-xl sm:justify-end">
              <div className="relative w-full sm:max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500"><Icon name="search" /></span>
                <input
                  id="project-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search projects..."
                  className="h-10 w-full rounded-full border border-slate-200 bg-white/80 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200/60 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:bg-zinc-900 dark:focus:ring-zinc-800"
                />

                {search.trim() !== "" && isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-60 overflow-y-auto rounded-2xl border border-slate-200/85 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 animate-slide-up">
                    {displayedProjects.length > 0 ? (
                      displayedProjects.map((project) => (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => {
                            goToSection("projects");
                            handleOpenEdit(project);
                            setSearch("");
                          }}
                          className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-zinc-900 transition duration-150 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-zinc-100 truncate">{project.projectName}</p>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 truncate">{project.clientName}</p>
                          </div>
                          <span className="inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold ring-1 ring-inset shrink-0 bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/30">
                            {project.status}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="p-3 text-center text-xs text-slate-400 dark:text-zinc-500 font-bold">No matches found</p>
                    )}
                  </div>
                )}
              </div>

              <ThemeSwitch checked={darkMode} onChange={setDarkMode} />

              {/* Notification icon */}
              <div className="relative notif-container">
                <button
                  type="button"
                  onClick={() => setNotifOpen((prev) => !prev)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition"
                  aria-label="Toggle notifications"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {overdueCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-650 px-1 text-[9px] font-black text-white ring-2 ring-white dark:ring-zinc-950 animate-pulse">
                      {overdueCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute top-full right-0 mt-2 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 animate-slide-up text-left">
                    <p className="text-xs font-black text-slate-900 dark:text-zinc-100 mb-2 px-1">Notifications</p>
                    <div className="space-y-1.5">
                      {[
                        { id: "n1", text: "Acme Corp Website redesign deadline is approaching", time: "2 hours ago", unread: true },
                        { id: "n2", text: "Nova Fitness App marked High Priority", time: "1 day ago", unread: false },
                        { id: "n3", text: "Patient Appointment System has been Completed", time: "2 days ago", unread: false },
                      ].map((notif) => (
                        <div key={notif.id} className="rounded-xl p-2 hover:bg-slate-50 dark:hover:bg-zinc-900 transition text-xs cursor-pointer">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-slate-800 dark:text-zinc-200 leading-snug">{notif.text}</p>
                            {notif.unread && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1" />}
                          </div>
                          <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile icon beside notif */}
              <div className="relative profile-container">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition"
                  aria-label="Toggle profile menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute top-full right-0 mt-2 z-50 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 animate-slide-up text-left">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800">
                      <p className="text-xs font-black text-slate-900 dark:text-zinc-100">Jane Cooper</p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500">Workspace Admin</p>
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {["Profile Settings", "Workspace Settings", "Sign Out"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setProfileOpen(false)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-900 transition ${
                            opt === "Sign Out" ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-zinc-300"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">{error}</div>}

          {activeSection === "dashboard" ? (
            <DashboardSummary projects={projects} />
          ) : (
            <>
              <ProjectToolbar
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                sortField={sortField}
                onSortFieldChange={setSortField}
              />

              {hasFilters && !loading && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-zinc-400">
                  <span>Showing <strong className="text-slate-800 dark:text-zinc-100">{displayedProjects.length}</strong> of <strong className="text-slate-800 dark:text-zinc-100">{projects.length}</strong> projects</span>
                  <button type="button" onClick={clearFilters} className="font-semibold text-slate-700 hover:text-slate-950 dark:text-zinc-300 dark:hover:text-white">Clear filters</button>
                </div>
              )}

              <ProjectList projects={displayedProjects} loading={loading} onEdit={handleOpenEdit} onDelete={setConfirmProject} onMove={handleMoveProject} />
            </>
          )}
        </main>
      </div>

      {modalOpen && <ProjectFormModal key={editingProject?.id ?? "new"} project={editingProject} onSave={handleSave} onClose={() => setModalOpen(false)} />}
      {confirmProject && <ConfirmDialog projectName={confirmProject.projectName} onConfirm={handleConfirmDelete} onCancel={() => setConfirmProject(null)} />}

      <div className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950 dark:text-emerald-100" : toast.type === "error" ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950 dark:text-red-100" : "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/50 dark:bg-sky-950 dark:text-sky-100"}`} role="status">
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}





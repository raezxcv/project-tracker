import { useEffect } from "react";

interface Props {
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ projectName, onConfirm, onCancel }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 flex flex-col gap-5 animate-slide-up transition-colors duration-300">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 shrink-0">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 id="confirm-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
              Delete Project
            </h3>
            <p id="confirm-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">"{projectName}"</span>? This
              action cannot be undone and will permanently remove this project.
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <button
            type="button"
            onClick={onCancel}
            className="px-4.5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className="px-5 py-2.5 text-sm font-bold bg-slate-950 hover:bg-slate-800 active:scale-95 text-white rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-offset-slate-900 cursor-pointer"
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}

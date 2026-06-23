import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  ariaLabel: string;
  invalid?: boolean;
}

interface MenuPosition {
  left: number;
  top: number;
  width: number;
}

export default function CustomSelect<T extends string>({
  value,
  options,
  onChange,
  placeholder = "Select...",
  ariaLabel,
  invalid = false,
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!wrapperRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    function updateMenuPosition() {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      const menuWidth = Math.max(rect.width, 180);
      const left = Math.min(Math.max(12, rect.right - menuWidth), window.innerWidth - menuWidth - 12);
      setMenuPosition({ left, top: rect.bottom + 8, width: menuWidth });
    }

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open]);

  const menu = open && menuPosition
    ? createPortal(
        <div
          ref={menuRef}
          className="z-[80] max-h-[240px] overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
          role="listbox"
          style={{
            position: "fixed",
            left: menuPosition.left,
            top: menuPosition.top,
            width: menuPosition.width,
          } satisfies CSSProperties}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold transition ${
                  isSelected
                    ? "bg-slate-100 text-slate-950 dark:bg-zinc-100 dark:text-zinc-950"
                    : "text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <span>{option.label}</span>
                {isSelected && <span className="text-xs">✓</span>}
              </button>
            );
          })}
        </div>,
        document.body
      )
    : null;

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex h-10 w-full min-w-[132px] items-center justify-between gap-3 rounded-lg border bg-slate-50 px-3 text-left text-xs font-bold outline-none transition hover:bg-slate-100 focus:ring-4 dark:bg-zinc-800 dark:hover:bg-zinc-700 ${
          invalid
            ? "border-red-300 text-red-900 focus:ring-red-100 dark:border-red-900 dark:text-red-200 dark:focus:ring-red-950/50"
            : "border-slate-200 text-slate-700 focus:border-slate-400 focus:ring-slate-200/70 dark:border-zinc-700 dark:text-zinc-200 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className={`truncate ${selected ? "" : "text-slate-400 dark:text-zinc-500"}`}>
          {selected?.label ?? placeholder}
        </span>
        <svg className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" />
        </svg>
      </button>
      {menu}
    </div>
  );
}

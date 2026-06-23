import { useState, useEffect, useCallback } from "react";
import type { Project } from "../types/project";
import initialData from "../data/test_data.json";

const STORAGE_KEY = "client-project-tracker:projects";

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  createProject: (data: Omit<Project, "id">) => void;
  updateProject: (id: number, data: Omit<Project, "id">) => void;
  deleteProject: (id: number) => void;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setProjects(stored ? (JSON.parse(stored) as Project[]) : (initialData as Project[]));
      } catch (err) {
        console.error("Failed to load projects from localStorage:", err);
        setError("Project data could not be loaded. Showing default data instead.");
        setProjects(initialData as Project[]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  const persist = useCallback((updated: Project[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      console.warn("Could not persist projects to localStorage.");
    }
  }, []);

  const createProject = useCallback(
    (data: Omit<Project, "id">) => {
      const newProject: Project = { ...data, id: Date.now() };
      setProjects((prev) => {
        const updated = [newProject, ...prev];
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const updateProject = useCallback(
    (id: number, data: Omit<Project, "id">) => {
      setProjects((prev) => {
        const updated = prev.map((project) => (project.id === id ? { ...data, id } : project));
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const deleteProject = useCallback(
    (id: number) => {
      setProjects((prev) => {
        const updated = prev.filter((project) => project.id !== id);
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  return { projects, loading, error, createProject, updateProject, deleteProject };
}

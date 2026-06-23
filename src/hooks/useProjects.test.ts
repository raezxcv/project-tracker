import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProjects } from "./useProjects";
import initialData from "../data/test_data.json";
import type { Project } from "../types/project";

const STORAGE_KEY = "client-project-tracker:projects";

describe("useProjects hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should start in a loading state and load initial data after timer", () => {
    const { result } = renderHook(() => useProjects());
    expect(result.current.loading).toBe(true);
    expect(result.current.projects).toEqual([]);

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.projects.length).toBe(initialData.length);
    expect(result.current.error).toBeNull();
  });

  it("should load existing data from localStorage if available", () => {
    const customData: Project[] = [
      {
        id: 999,
        clientName: "Test Client",
        projectName: "Test Project",
        description: "Test Desc",
        status: "Planning",
        priority: "Low",
        startDate: "2026-06-01",
        dueDate: "2026-06-30",
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customData));

    const { result } = renderHook(() => useProjects());
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.projects).toEqual(customData);
    expect(result.current.error).toBeNull();
  });

  it("should create a new project and persist it", () => {
    const { result } = renderHook(() => useProjects());
    act(() => {
      vi.advanceTimersByTime(250);
    });

    const originalLength = result.current.projects.length;
    const newProjectData = {
      clientName: "New Client",
      projectName: "New Project",
      description: "Description of new project",
      status: "Planning" as const,
      priority: "Low" as const,
      startDate: "2026-06-23",
      dueDate: "2026-07-23",
    };

    act(() => {
      result.current.createProject(newProjectData);
    });

    expect(result.current.projects.length).toBe(originalLength + 1);
    expect(result.current.projects[0]).toMatchObject(newProjectData);
    expect(result.current.projects[0].id).toBeDefined();

    // Verify it is persisted in localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!) as Project[];
    expect(parsed.length).toBe(originalLength + 1);
    expect(parsed[0]).toMatchObject(newProjectData);
  });

  it("should update an existing project and persist it", () => {
    const { result } = renderHook(() => useProjects());
    act(() => {
      vi.advanceTimersByTime(250);
    });

    const projectToUpdate = result.current.projects[0];
    const updatedData = {
      ...projectToUpdate,
      projectName: "Updated Project Name",
      status: "Completed" as const,
    };
    // Exclude id from the update payload
    const { id, ...updatePayload } = updatedData;

    act(() => {
      result.current.updateProject(id, updatePayload);
    });

    expect(result.current.projects[0].projectName).toBe("Updated Project Name");
    expect(result.current.projects[0].status).toBe("Completed");

    // Verify it is persisted in localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(stored!) as Project[];
    expect(parsed[0].projectName).toBe("Updated Project Name");
    expect(parsed[0].status).toBe("Completed");
  });

  it("should delete a project and persist it", () => {
    const { result } = renderHook(() => useProjects());
    act(() => {
      vi.advanceTimersByTime(250);
    });

    const originalLength = result.current.projects.length;
    const projectToDelete = result.current.projects[0];

    act(() => {
      result.current.deleteProject(projectToDelete.id);
    });

    expect(result.current.projects.length).toBe(originalLength - 1);
    expect(result.current.projects.find((p) => p.id === projectToDelete.id)).toBeUndefined();

    // Verify it is persisted in localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(stored!) as Project[];
    expect(parsed.length).toBe(originalLength - 1);
    expect(parsed.find((p) => p.id === projectToDelete.id)).toBeUndefined();
  });

  it("should show error and fall back to initial data if localStorage contains invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "invalid-json");

    // Suppress console.error in tests for this block
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useProjects());
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current.projects.length).toBe(initialData.length);
    expect(result.current.error).toBe("Project data could not be loaded. Showing default data instead.");

    consoleSpy.mockRestore();
  });
});

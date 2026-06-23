import { describe, it, expect } from "vitest";
import { validateProject, hasErrors, type ProjectFormData } from "./projectValidation";
import type { ProjectStatus, ProjectPriority } from "../types/project";

describe("projectValidation", () => {
  const validData: ProjectFormData = {
    clientName: "Acme Corp",
    projectName: "Website Redesign",
    description: "Modernize corporate website",
    status: "In Progress",
    priority: "High",
    startDate: "2026-06-01",
    dueDate: "2026-07-15",
  };

  it("should pass validation with valid data", () => {
    const errors = validateProject(validData);
    expect(hasErrors(errors)).toBe(false);
    expect(errors).toEqual({});
  });

  it("should fail validation if clientName is empty", () => {
    const data = { ...validData, clientName: "   " };
    const errors = validateProject(data);
    expect(hasErrors(errors)).toBe(true);
    expect(errors.clientName).toBe("Client Name is required.");
  });

  it("should fail validation if projectName is empty", () => {
    const data = { ...validData, projectName: "" };
    const errors = validateProject(data);
    expect(hasErrors(errors)).toBe(true);
    expect(errors.projectName).toBe("Project Name is required.");
  });

  it("should fail validation if status is empty", () => {
    const data = { ...validData, status: "" as unknown as ProjectStatus };
    const errors = validateProject(data);
    expect(hasErrors(errors)).toBe(true);
    expect(errors.status).toBe("Status is required.");
  });

  it("should fail validation if status is invalid value", () => {
    const data = { ...validData, status: "InvalidStatus" as unknown as ProjectStatus };
    const errors = validateProject(data);
    expect(hasErrors(errors)).toBe(true);
    expect(errors.status).toBe("Invalid status selected.");
  });

  it("should fail validation if priority is empty", () => {
    const data = { ...validData, priority: "" as unknown as ProjectPriority };
    const errors = validateProject(data);
    expect(hasErrors(errors)).toBe(true);
    expect(errors.priority).toBe("Priority is required.");
  });

  it("should fail validation if priority is invalid value", () => {
    const data = { ...validData, priority: "SuperHigh" as unknown as ProjectPriority };
    const errors = validateProject(data);
    expect(hasErrors(errors)).toBe(true);
    expect(errors.priority).toBe("Invalid priority selected.");
  });

  it("should fail validation if dueDate is earlier than startDate", () => {
    const data = { ...validData, startDate: "2026-06-15", dueDate: "2026-06-10" };
    const errors = validateProject(data);
    expect(hasErrors(errors)).toBe(true);
    expect(errors.dueDate).toBe("Due Date cannot be earlier than Start Date.");
  });

  it("should pass validation if dueDate matches startDate", () => {
    const data = { ...validData, startDate: "2026-06-10", dueDate: "2026-06-10" };
    const errors = validateProject(data);
    expect(hasErrors(errors)).toBe(false);
  });

  it("should pass validation if only dueDate is provided", () => {
    const data = { ...validData, startDate: "", dueDate: "2026-06-10" };
    const errors = validateProject(data);
    expect(hasErrors(errors)).toBe(false);
  });

  it("should pass validation if only startDate is provided", () => {
    const data = { ...validData, startDate: "2026-06-10", dueDate: "" };
    const errors = validateProject(data);
    expect(hasErrors(errors)).toBe(false);
  });
});

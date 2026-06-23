import {
  PROJECT_STATUSES,
  PROJECT_PRIORITIES,
  type ProjectStatus,
  type ProjectPriority,
} from "../types/project";

/** Shape of the create/edit form before ID assignment. */
export type ProjectFormData = {
  clientName: string;
  projectName: string;
  description: string;
  status: ProjectStatus | "";
  priority: ProjectPriority | "";
  startDate: string;
  dueDate: string;
};

/** Validation error map — only fields with errors are present. */
export type ValidationErrors = Partial<Record<keyof ProjectFormData, string>>;

/**
 * Validates a project form and returns any field-level errors.
 * Returns an empty object when the form is valid.
 */
export function validateProject(data: ProjectFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.clientName.trim()) {
    errors.clientName = "Client Name is required.";
  }

  if (!data.projectName.trim()) {
    errors.projectName = "Project Name is required.";
  }

  if (!data.status) {
    errors.status = "Status is required.";
  } else if (!PROJECT_STATUSES.includes(data.status as ProjectStatus)) {
    errors.status = "Invalid status selected.";
  }

  if (!data.priority) {
    errors.priority = "Priority is required.";
  } else if (!PROJECT_PRIORITIES.includes(data.priority as ProjectPriority)) {
    errors.priority = "Invalid priority selected.";
  }

  if (data.startDate && data.dueDate && data.dueDate < data.startDate) {
    errors.dueDate = "Due Date cannot be earlier than Start Date.";
  }

  return errors;
}

/** Returns true if the errors object contains any errors. */
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

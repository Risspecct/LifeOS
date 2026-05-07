export const BASE_TASK_STATUSES = ["TO_DO", "IN_PROGRESS", "PAUSED", "COMPLETED"];

export const normalizeTaskStatus = (value) => String(value ?? "").trim().toUpperCase();

export const getTaskStatusLabel = (status) => {
  const normalized = normalizeTaskStatus(status);
  if (!normalized) return "Unknown";
  return normalized.replaceAll("_", " ");
};

export const buildTaskStatusOptions = (...statusSources) => {
  const fromTasks = statusSources
    .flat()
    .map((value) => normalizeTaskStatus(value))
    .filter(Boolean);

  return Array.from(new Set([...BASE_TASK_STATUSES, ...fromTasks])).map((value) => ({
    value,
    label: getTaskStatusLabel(value)
  }));
};


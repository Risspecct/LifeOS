export const formatDueDate = (value) => {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No due date";

  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((date.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / dayMs);

  if (diffDays === 0) {
    return `Today ${new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;

  return new Date(value).toLocaleDateString([], { month: "short", day: "numeric" });
};

export const getStatusLabel = (status) => {
  if (!status) return "Unknown";
  return status.replaceAll("_", " ");
};

export const getPriorityTone = (task) => {
  const status = task?.status;
  if (status === "IN_PROGRESS") {
    return {
      bar: "bg-primary",
      chip: "bg-primary-container/10 text-primary",
      chipText: "Active"
    };
  }
  if (status === "PAUSED") {
    return {
      bar: "bg-tertiary-container",
      chip: "bg-tertiary-container/10 text-tertiary",
      chipText: "Paused"
    };
  }
  if (status === "COMPLETED") {
    return {
      bar: "bg-secondary",
      chip: "bg-surface-container-highest text-on-surface-variant",
      chipText: "Done"
    };
  }

  return {
    bar: "bg-primary",
    chip: "bg-primary-container/10 text-primary",
    chipText: "Queued"
  };
};

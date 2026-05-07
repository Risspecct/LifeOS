import { normalizeTaskStatus } from "./taskStatus";

const STATUS_STYLES = {
  TO_DO: "bg-slate-400/15 text-slate-300",
  IN_PROGRESS: "bg-sky-400/15 text-sky-300",
  COMPLETED: "bg-emerald-400/15 text-emerald-300",
  PAUSED: "bg-amber-400/15 text-amber-300",
  CANCELLED: "bg-rose-400/15 text-rose-300"
};

export const getTaskStatusStyle = (status) => {
  const normalized = normalizeTaskStatus(status);
  return STATUS_STYLES[normalized] ?? "bg-slate-400/15 text-slate-300";
};


import { formatDueDate } from "../../utils/taskUtils";

const tone = {
  CRITICAL: "bg-rose-400",
  HIGH: "bg-amber-300",
  MEDIUM: "bg-cyan-300",
  LOW: "bg-slate-400"
};

const normalizePriority = (task) => {
  const raw = String(task?.smartPriority || task?.priority || "").toUpperCase();
  if (["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(raw)) return raw;
  return "LOW";
};

const TaskPriorityFocusStrip = ({ tasks, loading, onOpenTask }) => {
  if (loading) {
    return <p className="text-on-surface-variant text-label-sm">Loading focus tasks...</p>;
  }

  if (!tasks.length) return null;

  return (
    <section className="space-y-sm">
      <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Priority Focus</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
        {tasks.slice(0, 3).map((task) => {
          const priority = normalizePriority(task);
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => onOpenTask(task.id)}
              className="text-left rounded-xl border border-outline-variant bg-surface-container p-md hover:border-primary/50 transition-all"
            >
              <div className={`h-1 rounded-full mb-sm ${tone[priority]}`} />
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-on-surface-variant">
                <span>{priority}</span>
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
              <p className="mt-2 font-label-sm text-on-surface line-clamp-2">{task.title}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default TaskPriorityFocusStrip;

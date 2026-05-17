import { formatDueDate, getStatusLabel } from "../../utils/taskUtils";

const PRIORITY_TONE = {
  CRITICAL: {
    bar: "bg-orange-400",
    glow: "hover:shadow-[0_0_18px_rgba(251,146,60,0.2)] hover:border-orange-300/50",
    chip: "bg-orange-400/15 text-orange-300 border-orange-300/30"
  },
  HIGH: {
    bar: "bg-amber-300",
    glow: "hover:shadow-[0_0_18px_rgba(252,211,77,0.2)] hover:border-amber-300/50",
    chip: "bg-amber-300/15 text-amber-200 border-amber-300/30"
  },
  MEDIUM: {
    bar: "bg-cyan-300",
    glow: "hover:shadow-[0_0_18px_rgba(103,232,249,0.18)] hover:border-cyan-300/50",
    chip: "bg-cyan-300/15 text-cyan-200 border-cyan-300/30"
  },
  LOW: {
    bar: "bg-slate-400",
    glow: "hover:shadow-[0_0_12px_rgba(148,163,184,0.12)] hover:border-slate-300/50",
    chip: "bg-slate-300/15 text-slate-300 border-slate-300/20"
  }
};

const getPriorityTone = (value) => PRIORITY_TONE[value] ?? PRIORITY_TONE.LOW;

const DashboardTaskPreview = ({ tasks, loading, error, onOpenTasks, onOpenTask }) => {
  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-md lg:p-lg space-y-md">
      <div className="flex items-center justify-between">
        <h3 className="font-h3 text-h3 flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">priority_high</span>
          Prioritized Focus
        </h3>
        <button type="button" onClick={onOpenTasks} className="text-primary font-label-sm hover:underline">
          View All Tasks
        </button>
      </div>

      {loading ? <p className="text-on-surface-variant text-label-sm">Loading tasks...</p> : null}
      {error ? <p className="text-error text-label-sm">{error}</p> : null}
      {!loading && !error && tasks.length === 0 ? <p className="text-on-surface-variant text-label-sm">No prioritized tasks yet.</p> : null}

      <div className="space-y-sm">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => onOpenTask?.(task.id)}
            className={`w-full text-left rounded-xl border border-outline-variant bg-surface-container-high p-md transition-all ${getPriorityTone(task.priority).glow}`}
          >
            <div className="flex items-start justify-between gap-sm">
              <div className="flex items-start gap-sm min-w-0">
                <div className={`w-1.5 h-12 rounded-full mt-0.5 ${getPriorityTone(task.priority).bar}`} />
                <div className="min-w-0">
                  <p className="font-label-sm text-on-surface truncate">{task.title}</p>
                  <div className="flex items-center gap-xs mt-2 flex-wrap">
                    <span className={`text-[10px] uppercase tracking-wider border px-2 py-0.5 rounded ${getPriorityTone(task.priority).chip}`}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider border border-outline-variant px-2 py-0.5 rounded text-on-surface-variant">
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>{formatDueDate(task.dueDate)}</span>
              <span className="truncate max-w-[45%] text-right">{task.displayLabel}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default DashboardTaskPreview;

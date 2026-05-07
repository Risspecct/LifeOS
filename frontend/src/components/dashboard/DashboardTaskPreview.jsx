import { formatDueDate, getStatusLabel } from "../../utils/taskUtils";

const DashboardTaskPreview = ({ tasks, loading, error, onOpenTasks }) => {
  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-md space-y-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-h3 text-h3 flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">task</span>
          Prioritized Tasks
        </h3>
        <button type="button" onClick={onOpenTasks} className="text-primary font-label-sm hover:underline">
          View All Tasks
        </button>
      </div>

      {loading ? <p className="text-on-surface-variant text-label-sm">Loading tasks...</p> : null}
      {error ? <p className="text-error text-label-sm">{error}</p> : null}
      {!loading && !error && tasks.length === 0 ? (
        <p className="text-on-surface-variant text-label-sm">No tasks available yet.</p>
      ) : null}

      <div className="space-y-xs">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={onOpenTasks}
            className="w-full text-left rounded-lg border border-outline-variant bg-surface-container-high p-sm hover:border-primary/50 transition-colors"
          >
            <p className="font-label-sm text-on-surface">{task.title}</p>
            <div className="flex items-center justify-between mt-1 text-label-xs text-on-surface-variant">
              <span>{formatDueDate(task.dueDate)}</span>
              <span>{getStatusLabel(task.status)}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default DashboardTaskPreview;

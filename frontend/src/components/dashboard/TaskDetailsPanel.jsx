import { formatDueDate, getStatusLabel } from "../../utils/taskUtils";

const TaskDetailsPanel = ({ task, loading }) => {
  if (loading) {
    return (
      <div className="bg-surface-container/50 border border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center">
        <p className="font-label-sm text-on-surface-variant font-medium">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-surface-container/50 border border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-sm">dock_to_left</span>
        <p className="font-label-sm text-on-surface-variant font-medium">Select a task to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-md space-y-sm">
      <h4 className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Task Details</h4>
      <h5 className="font-h3 text-h3">{task.title}</h5>
      <p className="text-body-md text-on-surface-variant">{task.description || "No description added."}</p>
      <div className="flex flex-wrap gap-xs">
        <span className="px-2 py-0.5 rounded text-[10px] bg-primary-container/10 text-primary uppercase font-bold tracking-wider">
          {getStatusLabel(task.status)}
        </span>
        {task.label ? (
          <span className="px-2 py-0.5 rounded text-[10px] bg-tertiary-container/10 text-tertiary uppercase font-bold tracking-wider">
            {task.label}
          </span>
        ) : null}
        {task.taskType ? (
          <span className="px-2 py-0.5 rounded text-[10px] bg-surface-container-highest text-on-surface-variant uppercase font-bold tracking-wider">
            {task.taskType}
          </span>
        ) : null}
      </div>
      <p className="text-label-sm text-on-surface-variant">Due: {formatDueDate(task.dueDate)}</p>
    </div>
  );
};

export default TaskDetailsPanel;

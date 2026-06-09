import { formatDueDate } from "../../utils/taskUtils";
import TaskStatusSelector from "./TaskStatusSelector";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskTypeChip from "./TaskTypeChip";

const TaskDetailsSidebar = ({
  task,
  loading,
  deleting,
  statusUpdating,
  statusOptions,
  onEdit,
  onDelete,
  onStatusChange,
  onClose
}) => {
  if (loading) {
    return (
      <div className="bg-surface-container/50 border border-dashed border-outline-variant rounded-xl p-lg text-center">
        <p className="font-label-sm text-on-surface-variant font-medium">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-surface-container/50 border border-dashed border-outline-variant rounded-xl p-lg text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-sm">dock_to_right</span>
        <p className="font-label-sm text-on-surface-variant font-medium">Select a task to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-md space-y-md">
      <div className="flex items-start justify-between gap-sm">
        <h4 className="font-h3 text-h3">{task.title}</h4>
        <button type="button" onClick={onClose} className="lg:hidden text-on-surface-variant">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <p className="text-body-md text-on-surface-variant">{task.description || "No description added."}</p>

      <div className="flex flex-wrap gap-xs">
        <TaskStatusBadge status={task.status} />
        {task.label ? (
          <span className="px-2 py-0.5 rounded text-[10px] bg-tertiary-container/10 text-tertiary uppercase font-bold tracking-wider">
            {task.label}
          </span>
        ) : null}
        {task.taskType ? (
          <TaskTypeChip taskType={task.taskType} />
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-sm rounded-lg bg-surface-container-high border border-outline-variant p-sm">
        <p className="text-label-sm text-on-surface-variant">Status</p>
        <TaskStatusSelector
          id={`task-status-${task.id}`}
          value={task.status}
          options={statusOptions}
          disabled={statusUpdating}
          onChange={onStatusChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-sm">
        <div className="rounded-lg bg-surface-container-high border border-outline-variant p-sm">
          <p className="text-label-xs uppercase tracking-wide text-on-surface-variant">Due Date</p>
          <p className="text-body-md text-on-surface">{formatDueDate(task.dueDate)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-sm pt-xs">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg px-md py-xs bg-primary text-on-primary"
        >
          Edit Task
        </button>
        <button
          type="button"
          onClick={() => onStatusChange("COMPLETED")}
          disabled={statusUpdating || task.status === "COMPLETED"}
          className="rounded-lg px-md py-xs border border-outline-variant text-on-surface-variant disabled:opacity-60"
        >
          {statusUpdating ? "Updating..." : task.status === "COMPLETED" ? "Completed" : "Mark Complete"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="rounded-lg px-md py-xs border border-error text-error disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsSidebar;

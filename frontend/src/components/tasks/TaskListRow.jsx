import { getDueDateMetadata } from "../../utils/taskUtils";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskTypeChip from "./TaskTypeChip";

const TaskListRow = ({ task, isActive, onSelectTask }) => {
  const dueDateMeta = getDueDateMetadata(task.dueDate);

  return (
    <button
      type="button"
      onClick={() => onSelectTask(task.id)}
      className={`w-full text-left rounded-xl border p-sm transition-colors ${
        isActive ? "border-primary bg-primary/5" : "border-outline-variant bg-surface-container hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-sm">
        <div className="min-w-0">
          <p className="font-label-sm text-on-surface truncate">{task.title}</p>
          <div className="mt-1 flex items-center gap-xs flex-wrap">
            <TaskTypeChip taskType={task.taskType} />
            {task.label ? (
              <span className="px-2 py-0.5 rounded border border-tertiary/20 bg-tertiary/10 text-tertiary text-[10px] uppercase font-bold tracking-wider">
                {task.label}
              </span>
            ) : null}
            <span className={`text-label-xs ${dueDateMeta.tone}`}>
              {dueDateMeta.label}
              {dueDateMeta.hint ? ` · ${dueDateMeta.hint}` : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-xs shrink-0">
          <TaskStatusBadge status={task.status} />
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
        </div>
      </div>
    </button>
  );
};

export default TaskListRow;

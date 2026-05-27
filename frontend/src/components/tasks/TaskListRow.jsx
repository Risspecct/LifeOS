import { getDueDateMetadata } from "../../utils/taskUtils";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskTypeChip from "./TaskTypeChip";
import { useState } from "react";

const TaskListRow = ({ task, isActive, onSelectTask, priorityView = false }) => {
  const dueDateMeta = getDueDateMetadata(task.dueDate);
  const reasons = Array.isArray(task?.reasons) ? task.reasons.filter(Boolean) : [];
  const [showReasons, setShowReasons] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelectTask(task.id)}
      className={`w-full text-left rounded-xl border p-sm transition-colors group ${
        isActive ? "border-primary bg-primary/5" : "border-outline-variant bg-surface-container hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-sm md:gap-md">
        <div className="min-w-0 flex-1">
          <p className="font-label-sm text-on-surface truncate">{task.title}</p>
          <div className="mt-1 flex items-center gap-xs flex-wrap">
            <TaskTypeChip taskType={task.taskType} />
            {priorityView && task.smartPriority ? (
              <span className="px-2 py-0.5 rounded border border-primary/20 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider">
                {task.smartPriority}
              </span>
            ) : null}
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
        {priorityView && reasons.length > 0 ? (
          <div className="hidden md:block w-0 opacity-0 translate-x-2 group-hover:w-64 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out overflow-hidden border-l border-outline-variant/70 pl-sm">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Priority Insights</p>
            <ul className="mt-1 space-y-1 text-label-xs text-on-surface-variant">
              {reasons.slice(0, 4).map((reason, index) => (
                <li key={`${task.id}-reason-${index}`} className="truncate">• {reason}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      {priorityView && reasons.length > 0 ? (
        <div className="mt-2 md:hidden">
          <span
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              setShowReasons((prev) => !prev);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                setShowReasons((prev) => !prev);
              }
            }}
            className="text-label-xs text-primary"
          >
            {showReasons ? "Hide Priority Reasons ▲" : "View Priority Reasons ▼"}
          </span>
          {showReasons ? (
            <ul className="mt-2 space-y-1 text-label-xs text-on-surface-variant">
              {reasons.map((reason, index) => (
                <li key={`${task.id}-mobile-reason-${index}`}>• {reason}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </button>
  );
};

export default TaskListRow;

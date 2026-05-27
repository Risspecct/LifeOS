import { useState } from "react";
import { getDueDateMetadata } from "../../utils/taskUtils";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskTypeChip from "./TaskTypeChip";

const TaskBoardCard = ({ task, isActive, onSelectTask, priorityView = false }) => {
  const dueDateMeta = getDueDateMetadata(task.dueDate);
  const isCompleted = task?.status === "COMPLETED";
  const hasDescription = Boolean(task.description);
  const reasons = Array.isArray(task?.reasons) ? task.reasons.filter(Boolean) : [];
  const [showReasons, setShowReasons] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelectTask(task.id)}
      className={`w-full h-full text-left bg-surface-container rounded-xl p-5 flex flex-col gap-4 group transition-colors shadow-sm hover:shadow-md border ${
        isActive ? "border-primary bg-primary/5" : "border-outline-variant/30 hover:border-primary/40"
      }`}
    >
      <div className="flex items-start justify-between w-full gap-3">
        <h4 className="font-body-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {task.title}
        </h4>
        <div className="shrink-0 mt-0.5 flex items-center gap-xs">
          {priorityView && task.smartPriority ? (
            <span className="px-2 py-0.5 rounded border border-primary/20 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider">
              {task.smartPriority}
            </span>
          ) : null}
          <TaskStatusBadge status={task.status} />
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col justify-start">
        {hasDescription ? (
          <p className="text-label-sm text-on-surface-variant line-clamp-2 leading-snug">
            {task.description}
          </p>
        ) : (
          <div className="mt-1">
            <TaskTypeChip taskType={task.taskType} label={task.label} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-outline-variant/30">
        <div className="flex items-center gap-2">
          {hasDescription && (task.taskType || task.label) ? (
            <TaskTypeChip taskType={task.taskType} label={task.label} />
          ) : null}
        </div>

        {isCompleted ? (
          <span className="text-label-xs text-on-surface-variant/50 flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
          </span>
        ) : task.dueDate ? (
          <span className={`text-label-xs flex items-center gap-1.5 font-medium ${dueDateMeta.tone}`}>
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {dueDateMeta.label}{dueDateMeta.hint ? ` · ${dueDateMeta.hint}` : ""}
          </span>
        ) : (
          <span className="text-label-xs text-on-surface-variant/50 flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            No due date
          </span>
        )}
      </div>

      {priorityView && reasons.length > 0 ? (
        <div className="w-full">
          <div className="hidden md:block border border-outline-variant/70 bg-surface rounded-lg p-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Priority Insights</p>
            <ul className="mt-1 space-y-1 text-label-xs text-on-surface-variant">
              {reasons.slice(0, 4).map((reason, index) => (
                <li key={`${task.id}-reason-${index}`} className="truncate">• {reason}</li>
              ))}
            </ul>
          </div>
          <div className="md:hidden mt-1">
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
        </div>
      ) : null}
    </button>
  );
};

export default TaskBoardCard;

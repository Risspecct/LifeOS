import { getDueDateMetadata } from "../../utils/taskUtils";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskTypeChip from "./TaskTypeChip";

const TaskBoardCard = ({ task, isActive, onSelectTask }) => {
  const dueDateMeta = getDueDateMetadata(task.dueDate);
  const hasDescription = Boolean(task.description);

  return (
    <button
      type="button"
      onClick={() => onSelectTask(task.id)}
      className={`w-full h-full text-left bg-surface-container rounded-xl p-5 flex flex-col gap-4 group transition-colors shadow-sm hover:shadow-md border ${
        isActive ? "border-primary bg-primary/5" : "border-outline-variant/30 hover:border-primary/40"
      }`}
    >
      {/* TOP: Title and Status */}
      <div className="flex items-start justify-between w-full gap-3">
        <h4 className="font-body-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {task.title}
        </h4>
        <div className="shrink-0 mt-0.5">
          <TaskStatusBadge status={task.status} />
        </div>
      </div>

      {/* MIDDLE: Description OR Task Type */}
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

      {/* BOTTOM: Due Date and Metadata */}
      <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-outline-variant/30">
        <div className="flex items-center gap-2">
           {hasDescription && (task.taskType || task.label) ? (
             <TaskTypeChip taskType={task.taskType} label={task.label} />
           ) : null}
        </div>
        
        {task.dueDate ? (
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
    </button>
  );
};

export default TaskBoardCard;

import { formatDueDate, getPriorityTone, getStatusLabel } from "../../utils/taskUtils";

const PrioritizedTaskCard = ({ task, isActive, onSelect }) => {
  const tone = getPriorityTone(task);

  return (
    <div
      onClick={() => onSelect(task.id)}
      className={`cursor-pointer bg-surface-container border rounded-xl p-md flex items-center justify-between group transition-colors ${
        isActive ? "border-primary" : "border-outline-variant hover:border-primary/50"
      }`}
    >
      <div className="flex items-center gap-md">
        <div className={`w-1 ${tone.bar} h-12 rounded-full`} />
        <div>
          <h4 className="font-body-md font-bold group-hover:text-primary transition-colors">{task.title}</h4>
          <div className="flex gap-xs items-center mt-1 flex-wrap">
            <span className="font-label-xs text-label-xs text-on-surface-variant">{formatDueDate(task.dueDate)}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${tone.chip}`}>
              {task.label || task.taskType || "General"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-md">
        <span className="font-label-sm text-label-sm bg-surface-container-highest px-sm py-1 rounded-lg">
          {getStatusLabel(task.status)}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
      </div>
    </div>
  );
};

export default PrioritizedTaskCard;

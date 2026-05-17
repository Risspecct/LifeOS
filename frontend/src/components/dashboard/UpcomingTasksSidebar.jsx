import { formatDueDate } from "../../utils/taskUtils";

const UpcomingTasksSidebar = ({ tasks, loading, onOpenTask }) => {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-md">
      <h4 className="font-label-sm font-bold text-on-surface-variant mb-md uppercase tracking-wider">Upcoming Deadlines</h4>

      {loading ? <p className="text-label-sm text-on-surface-variant">Loading upcoming tasks...</p> : null}
      {!loading && tasks.length === 0 ? <p className="text-label-sm text-on-surface-variant">No upcoming tasks.</p> : null}

      <div className="space-y-md relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">
        {tasks.map((task, index) => (
          <button key={task.id} type="button" onClick={() => onOpenTask?.(task.id)} className="pl-xl relative text-left w-full">
            <div
              className={`absolute left-1 top-1 w-2 h-2 rounded-full ring-4 ring-background ${
                index === 0 ? "bg-primary" : "bg-outline-variant"
              }`}
            />
            <p className="font-label-sm font-bold">{task.title}</p>
            <p className="text-[12px] text-on-surface-variant">{formatDueDate(task.dueDate)}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTasksSidebar;

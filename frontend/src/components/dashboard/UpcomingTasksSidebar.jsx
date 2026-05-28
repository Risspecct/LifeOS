import { formatDueDate } from "../../utils/taskUtils";
import { Skeleton } from "../ui/Skeleton";
import { useDelayedLoading } from "../../hooks/useDelayedLoading";

const UpcomingTasksSidebar = ({ tasks, loading, onOpenTask }) => {
  const showSkeleton = useDelayedLoading(loading, 200);

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-md">
      <h4 className="font-label-sm font-bold text-on-surface-variant mb-md uppercase tracking-wider">Upcoming Deadlines</h4>

      {showSkeleton ? (
        <div className="space-y-md relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="pl-xl relative text-left w-full space-y-2">
              <div
                className={`absolute left-1 top-1 w-2 h-2 rounded-full ring-4 ring-background ${
                  index === 0 ? "bg-primary/50" : "bg-outline-variant/50"
                }`}
              />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : !loading && tasks.length === 0 ? (
        <p className="text-label-sm text-on-surface-variant">No upcoming tasks.</p>
      ) : (
        <div className="space-y-md relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">
          {tasks.map((task, index) => (
            <button key={task.id} type="button" onClick={() => onOpenTask?.(task.id)} className="pl-xl relative text-left w-full group">
              <div
                className={`absolute left-1 top-1 w-2 h-2 rounded-full ring-4 ring-background group-hover:scale-125 transition-transform ${
                  index === 0 ? "bg-primary" : "bg-outline-variant"
                }`}
              />
              <p className="font-label-sm font-bold group-hover:text-primary transition-colors">{task.title}</p>
              <p className="text-[12px] text-on-surface-variant">{formatDueDate(task.dueDate)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingTasksSidebar;

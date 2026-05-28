import TaskGridView from "./TaskGridView";
import TaskListView from "./TaskListView";
import { Skeleton, SkeletonCard } from "../ui/Skeleton";
import { useDelayedLoading } from "../../hooks/useDelayedLoading";

const TaskBoard = ({ tasks, selectedTaskId, onSelectTask, loading, error, viewMode = "list", priorityView = false }) => {
  const showSkeleton = useDelayedLoading(loading, 200);

  if (showSkeleton) {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} className="h-[180px] flex flex-col justify-between">
              <div>
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/3 mb-4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6 mt-1" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-[1px] bg-outline-variant/30 rounded-xl overflow-hidden border border-outline-variant">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-surface-container flex items-center p-md gap-4">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full hidden sm:block" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (loading) return <div className="min-h-[400px]"></div>; // Keep minimum height to prevent flicker before skeleton shows

  if (error) {
    return <p className="text-error text-label-sm">{error}</p>;
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-surface-container/50 border border-dashed border-outline-variant rounded-xl p-lg text-center">
        <p className="text-on-surface-variant">No tasks match these filters.</p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return <TaskGridView tasks={tasks} selectedTaskId={selectedTaskId} onSelectTask={onSelectTask} priorityView={priorityView} />;
  }

  return <TaskListView tasks={tasks} selectedTaskId={selectedTaskId} onSelectTask={onSelectTask} priorityView={priorityView} />;
};

export default TaskBoard;

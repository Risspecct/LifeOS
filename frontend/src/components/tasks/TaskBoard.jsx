import TaskGridView from "./TaskGridView";
import TaskListView from "./TaskListView";

const TaskBoard = ({ tasks, selectedTaskId, onSelectTask, loading, error, viewMode = "list" }) => {
  if (loading) {
    return <p className="text-on-surface-variant text-label-sm">Loading tasks...</p>;
  }

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
    return <TaskGridView tasks={tasks} selectedTaskId={selectedTaskId} onSelectTask={onSelectTask} />;
  }

  return <TaskListView tasks={tasks} selectedTaskId={selectedTaskId} onSelectTask={onSelectTask} />;
};

export default TaskBoard;

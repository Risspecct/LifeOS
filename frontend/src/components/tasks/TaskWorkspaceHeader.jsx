import TasksViewSwitcher from "./TasksViewSwitcher";

const TaskWorkspaceHeader = ({ taskCountLabel, onCreateTask, viewMode, onChangeViewMode }) => {
  return (
    <div className="flex items-center justify-between gap-sm">
      <h1 className="font-h2 text-h2 flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">view_kanban</span>
        Tasks Workspace
      </h1>
      <div className="flex items-center gap-sm flex-wrap justify-end">
        <span className="text-label-sm text-on-surface-variant hidden sm:inline">{taskCountLabel}</span>
        <TasksViewSwitcher viewMode={viewMode} onChangeViewMode={onChangeViewMode} />
        <button
          type="button"
          onClick={onCreateTask}
          className="rounded-lg px-md py-xs bg-primary text-on-primary font-label-sm hover:opacity-90"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskWorkspaceHeader;

import TasksViewSwitcher from "./TasksViewSwitcher";

const TaskWorkspaceToolbar = ({
  filters,
  onChangeFilters,
  sortBy,
  onChangeSortBy,
  viewMode,
  onChangeViewMode,
  onCreateTask,
  statusOptions,
  labels = [],
  onOpenLabelManager
}) => {
  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center justify-between gap-sm">
        <h1 className="font-h2 text-h2">Tasks Workspace</h1>
        <div className="flex items-center gap-sm">
          <TasksViewSwitcher viewMode={viewMode} onChangeViewMode={onChangeViewMode} />
          <button type="button" onClick={onCreateTask} className="rounded-full px-md py-xs bg-primary text-on-primary font-label-sm">
            + New Task
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-xs">
        <input
          value={filters.search}
          onChange={(event) => onChangeFilters({ ...filters, search: event.target.value })}
          placeholder="Search"
          className="bg-surface border border-outline-variant rounded-full px-sm py-xs text-label-sm min-w-[12rem]"
        />
        <select
          value={filters.status}
          onChange={(event) => onChangeFilters({ ...filters, status: event.target.value })}
          className="bg-surface border border-outline-variant rounded-full px-sm py-xs text-label-sm"
        >
          <option value="">Status</option>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
        <select
          value={filters.labelId}
          onChange={(event) => onChangeFilters({ ...filters, labelId: event.target.value })}
          className="bg-surface border border-outline-variant rounded-full px-sm py-xs text-label-sm"
        >
          <option value="">Label</option>
          {labels.map((label) => (
            <option key={label.id} value={label.id}>{label.name}</option>
          ))}
        </select>
        <input
          value={filters.taskType}
          onChange={(event) => onChangeFilters({ ...filters, taskType: event.target.value })}
          placeholder="Type"
          className="bg-surface border border-outline-variant rounded-full px-sm py-xs text-label-sm w-24"
        />
        <select
          value={sortBy}
          onChange={(event) => onChangeSortBy(event.target.value)}
          className="bg-surface border border-outline-variant rounded-full px-sm py-xs text-label-sm"
        >
          <option value="dueAsc">Sort</option>
          <option value="dueAsc">Due: Upcoming</option>
          <option value="dueDesc">Due: Farthest</option>
          <option value="addedDesc">Recently Added</option>
          <option value="titleAsc">Title: A-Z</option>
          <option value="titleDesc">Title: Z-A</option>
        </select>
        <button
          type="button"
          onClick={() => onChangeFilters({ search: '', status: '', labelId: '', taskType: '' })}
          className="bg-surface border border-outline-variant rounded-full px-sm py-xs text-label-sm hover:bg-surface-variant transition-colors"
        >
          Clear Filters
        </button>
        <button
          type="button"
          onClick={onOpenLabelManager}
          className="bg-surface border border-outline-variant rounded-full px-sm py-xs text-label-sm text-primary hover:border-primary/40"
        >
          Manage Labels
        </button>
      </div>
    </div>
  );
};

export default TaskWorkspaceToolbar;

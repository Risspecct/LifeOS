import TasksViewSwitcher from "./TasksViewSwitcher";
import PriorityModeToggle from "./PriorityModeToggle";
import { useMemo, useState } from "react";

const TaskWorkspaceToolbar = ({
  filters,
  onChangeFilters,
  sortBy,
  onChangeSortBy,
  sortOptions = [],
  taskTypeOptions = [],
  viewMode,
  onChangeViewMode,
  workspaceMode,
  onChangeWorkspaceMode,
  onCreateTask,
  statusOptions,
  labels = [],
  onOpenLabelManager
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const taskTypeSuggestions = useMemo(() => taskTypeOptions.filter(Boolean), [taskTypeOptions]);
  const activeFilterCount = [
    filters.status,
    filters.labelId,
    filters.taskType,
    workspaceMode === "priority" ? "" : sortBy !== "dueAsc" ? sortBy : ""
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    onChangeFilters({ search: "", status: "", labelId: "", taskType: "" });
    onChangeSortBy("dueAsc");
  };

  return (
    <div className="flex flex-col gap-sm">
      <h1 className="font-h2 text-h2">Tasks Workspace</h1>
      <div className="flex flex-wrap items-center gap-sm">
        <PriorityModeToggle mode={workspaceMode} onChangeMode={onChangeWorkspaceMode} />
        <TasksViewSwitcher viewMode={viewMode} onChangeViewMode={onChangeViewMode} />
        <button type="button" onClick={onCreateTask} className="rounded-full px-md py-xs bg-primary text-on-primary font-label-sm whitespace-nowrap">
          + New Task
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-xs">
        <input
          value={filters.search}
          onChange={(event) => onChangeFilters({ ...filters, search: event.target.value })}
          placeholder="Search tasks"
          className="flex-1 bg-surface border border-outline-variant rounded-full px-sm py-xs text-label-sm min-w-[12rem]"
        />
        <button
          type="button"
          onClick={() => setIsFiltersOpen(true)}
          className="inline-flex items-center justify-center gap-1 rounded-full border border-outline-variant bg-surface px-sm py-xs text-label-sm hover:bg-surface-variant transition-colors whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          Filters
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-primary-container text-on-primary-container px-1.5 text-[10px]">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>

      {isFiltersOpen ? (
        <>
          <button type="button" onClick={() => setIsFiltersOpen(false)} className="hidden md:block fixed inset-0 z-30" aria-label="Close filters" />
          <div className="hidden md:block relative">
            <div className="absolute right-0 z-40 mt-1 w-[24rem] rounded-xl border border-outline-variant bg-surface shadow-xl p-sm space-y-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-label-sm uppercase tracking-wider text-on-surface-variant">Filters</h3>
                <button type="button" onClick={() => setIsFiltersOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="space-y-xs">
                <p className="text-label-xs uppercase tracking-wider text-on-surface-variant">Status</p>
                <select
                  value={filters.status}
                  onChange={(event) => onChangeFilters({ ...filters, status: event.target.value })}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-label-sm"
                >
                  <option value="">All statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-xs">
                <div className="flex items-center justify-between gap-sm">
                  <p className="text-label-xs uppercase tracking-wider text-on-surface-variant">Labels</p>
                  <button type="button" onClick={onOpenLabelManager} className="text-label-xs text-primary hover:underline">
                    Manage Labels
                  </button>
                </div>
                <select
                  value={filters.labelId}
                  onChange={(event) => onChangeFilters({ ...filters, labelId: event.target.value })}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-label-sm"
                >
                  <option value="">All labels</option>
                  {labels.map((label) => (
                    <option key={label.id} value={label.id}>{label.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-xs">
                <p className="text-label-xs uppercase tracking-wider text-on-surface-variant">Type</p>
                <input
                  value={filters.taskType}
                  onChange={(event) => onChangeFilters({ ...filters, taskType: event.target.value })}
                  placeholder="Filter by type"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-label-sm"
                  list="task-type-suggestions"
                />
              </div>
              {workspaceMode !== "priority" ? (
                <div className="space-y-xs">
                  <p className="text-label-xs uppercase tracking-wider text-on-surface-variant">Sort</p>
                  <select
                    value={sortBy}
                    onChange={(event) => onChangeSortBy(event.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-label-sm"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ) : null}
              <div className="pt-xs">
                <button type="button" onClick={clearAllFilters} className="text-label-sm text-on-surface-variant hover:text-on-surface">
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          <div className="md:hidden fixed inset-0 z-[57]">
            <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setIsFiltersOpen(false)} aria-label="Close filters" />
            <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl border border-outline-variant bg-surface p-md space-y-sm max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-h3 text-h3">Filters</h3>
                <button type="button" onClick={() => setIsFiltersOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="space-y-xs">
                <p className="text-label-xs uppercase tracking-wider text-on-surface-variant">Status</p>
                <select
                  value={filters.status}
                  onChange={(event) => onChangeFilters({ ...filters, status: event.target.value })}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-label-sm"
                >
                  <option value="">All statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-xs">
                <div className="flex items-center justify-between gap-sm">
                  <p className="text-label-xs uppercase tracking-wider text-on-surface-variant">Labels</p>
                  <button type="button" onClick={onOpenLabelManager} className="text-label-xs text-primary hover:underline">
                    Manage Labels
                  </button>
                </div>
                <select
                  value={filters.labelId}
                  onChange={(event) => onChangeFilters({ ...filters, labelId: event.target.value })}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-label-sm"
                >
                  <option value="">All labels</option>
                  {labels.map((label) => (
                    <option key={label.id} value={label.id}>{label.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-xs">
                <p className="text-label-xs uppercase tracking-wider text-on-surface-variant">Type</p>
                <input
                  value={filters.taskType}
                  onChange={(event) => onChangeFilters({ ...filters, taskType: event.target.value })}
                  placeholder="Filter by type"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-label-sm"
                  list="task-type-suggestions"
                />
              </div>
              {workspaceMode !== "priority" ? (
                <div className="space-y-xs">
                  <p className="text-label-xs uppercase tracking-wider text-on-surface-variant">Sort</p>
                  <select
                    value={sortBy}
                    onChange={(event) => onChangeSortBy(event.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-label-sm"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ) : null}
              <div className="pt-xs flex justify-between items-center">
                <button type="button" onClick={clearAllFilters} className="text-label-sm text-on-surface-variant hover:text-on-surface">
                  Clear All Filters
                </button>
                <button type="button" onClick={() => setIsFiltersOpen(false)} className="rounded-lg px-md py-xs bg-primary text-on-primary text-label-sm">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <datalist id="task-type-suggestions">
        {taskTypeSuggestions.map((taskType) => (
          <option key={taskType} value={taskType} />
        ))}
      </datalist>
    </div>
  );
};

export default TaskWorkspaceToolbar;

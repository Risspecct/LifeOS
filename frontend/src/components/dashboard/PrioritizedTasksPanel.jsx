import PrioritizedTaskCard from "../tasks/PrioritizedTaskCard";

const PrioritizedTasksPanel = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  filters,
  onChangeFilters,
  loading,
  error
}) => {
  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between">
        <h3 className="font-h3 text-h3 flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">priority_high</span>
          Prioritized Focus
        </h3>
        <button className="text-primary font-label-sm hover:underline">View All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
        <select
          value={filters.status}
          onChange={(event) => onChangeFilters({ ...filters, status: event.target.value })}
          className="bg-surface-container border border-outline-variant rounded-xl px-sm py-xs text-label-sm"
        >
          <option value="">All Status</option>
          <option value="TO_DO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="PAUSED">Paused</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <input
          value={filters.label}
          onChange={(event) => onChangeFilters({ ...filters, label: event.target.value })}
          placeholder="Filter by label"
          className="bg-surface-container border border-outline-variant rounded-xl px-sm py-xs text-label-sm"
        />
        <input
          value={filters.taskType}
          onChange={(event) => onChangeFilters({ ...filters, taskType: event.target.value })}
          placeholder="Filter by task type"
          className="bg-surface-container border border-outline-variant rounded-xl px-sm py-xs text-label-sm"
        />
      </div>

      {loading ? <p className="text-on-surface-variant text-label-sm">Loading prioritized tasks...</p> : null}
      {error ? <p className="text-error text-label-sm">{error}</p> : null}
      {!loading && !error && tasks.length === 0 ? (
        <p className="text-on-surface-variant text-label-sm">No prioritized tasks found for current filters.</p>
      ) : null}

      <div className="space-y-sm">
        {tasks.map((task) => (
          <PrioritizedTaskCard
            key={task.id}
            task={task}
            isActive={selectedTaskId === task.id}
            onSelect={onSelectTask}
          />
        ))}
      </div>
    </div>
  );
};

export default PrioritizedTasksPanel;

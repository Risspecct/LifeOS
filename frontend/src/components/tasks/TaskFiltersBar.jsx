const TaskFiltersBar = ({ filters, onChangeFilters, statusOptions = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
      <select
        value={filters.status}
        onChange={(event) => onChangeFilters({ ...filters, status: event.target.value })}
        className="bg-surface-container border border-outline-variant rounded-xl px-sm py-xs text-label-sm"
      >
        <option value="">All Status</option>
        {statusOptions.map((status) => (
          <option key={status.value} value={status.value}>{status.label}</option>
        ))}
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
  );
};

export default TaskFiltersBar;

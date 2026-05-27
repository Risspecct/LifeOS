const TaskStatusSelector = ({ value, options, disabled, onChange, id = "task-status-selector" }) => {
  return (
    <select
      id={id}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="w-full min-w-0 rounded-lg px-sm py-xs bg-surface border border-outline-variant text-label-sm disabled:opacity-60"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default TaskStatusSelector;

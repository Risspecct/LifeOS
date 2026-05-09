const TaskTypeChip = ({ taskType, label }) => {
  const displayValue = taskType || label;

  if (!displayValue) {
    return (
      <span className="text-on-surface-variant/50 text-[10px] uppercase font-bold tracking-wider">
        UNSPECIFIED
      </span>
    );
  }

  return (
    <span className="text-primary text-[10px] uppercase font-bold tracking-wider">
      {String(displayValue).trim().replaceAll("_", " ").toUpperCase()}
    </span>
  );
};

export default TaskTypeChip;

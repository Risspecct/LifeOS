const PriorityModeToggle = ({ mode = "standard", onChangeMode }) => {
  const isPriority = mode === "priority";

  return (
    <div className="inline-flex items-center rounded-lg border border-outline-variant bg-surface-container p-1">
      <button
        type="button"
        onClick={() => onChangeMode("standard")}
        className={`px-sm py-1 rounded-md text-label-sm transition-colors ${
          !isPriority ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        Standard View
      </button>
      <button
        type="button"
        onClick={() => onChangeMode("priority")}
        className={`px-sm py-1 rounded-md text-label-sm transition-colors ${
          isPriority ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        Priority View
      </button>
    </div>
  );
};

export default PriorityModeToggle;

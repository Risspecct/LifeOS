const TasksViewSwitcher = ({ viewMode, onChangeViewMode }) => {
  const isList = viewMode === "list";

  return (
    <div className="inline-flex items-center rounded-lg border border-outline-variant bg-surface-container p-1">
      <button
        type="button"
        onClick={() => onChangeViewMode("list")}
        className={`px-sm py-1 rounded-md text-label-sm flex items-center gap-1 transition-colors ${
          isList ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">view_list</span>
        List
      </button>
      <button
        type="button"
        onClick={() => onChangeViewMode("grid")}
        className={`px-sm py-1 rounded-md text-label-sm flex items-center gap-1 transition-colors ${
          !isList ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">grid_view</span>
        Grid
      </button>
    </div>
  );
};

export default TasksViewSwitcher;

import { useState } from "react";
import { formatDueDate } from "../../utils/taskUtils";
import TaskStatusBadge from "./TaskStatusBadge";
import NotesPreview from "../notes/NotesPreview";

const tabs = ["Overview", "Notes"];

const TaskSlideOverPanel = ({
  task,
  loading,
  onClose,
  onExpand,
  onEdit,
  onDelete,
  deleting,
  onStatusChange,
  statusUpdating,
  labels = [],
  statusOptions = [],
  onLabelChange,
  notesPreview = [],
  notesCount = 0,
  onCreateNote,
  onViewAllNotes,
  onOpenNote
}) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);

  const activeLabel =
    labels.find((label) => String(label.id) === String(task?.labelId)) ||
    labels.find((label) => String(label.name).toLowerCase() === String(task?.label || "").toLowerCase());
  const selectedLabelId = activeLabel?.id ?? "";

  if (!task && !loading) return null;

  return (
    <div className="fixed inset-0 z-[55] flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close preview" />
      <aside className="relative h-full w-full sm:w-[32rem] bg-surface border-l border-outline-variant shadow-2xl p-md overflow-y-auto transition-transform duration-300">
        {loading ? <p className="text-on-surface-variant">Loading task...</p> : null}
        {!loading && task ? (
          <div className="space-y-md">
            <header className="space-y-sm">
              <div className="flex items-start justify-between gap-sm">
                <h2 className="font-h3 text-h3">{task.title}</h2>
                <div className="flex items-center gap-xs">
                  <button type="button" onClick={() => onExpand(task.id)} className="p-1 text-on-surface-variant hover:text-primary">
                    <span className="material-symbols-outlined">open_in_full</span>
                  </button>
                  <button type="button" onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-sm pt-1">
                {isEditingStatus ? (
                  <select
                    value={task.status || ""}
                    onChange={async (event) => {
                      await onStatusChange(event.target.value);
                      setIsEditingStatus(false);
                    }}
                    onBlur={() => setIsEditingStatus(false)}
                    autoFocus
                    className="rounded-full border border-outline-variant bg-surface px-3 py-1.5 text-label-sm"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                ) : (
                  <button type="button" onClick={() => setIsEditingStatus(true)}>
                    <TaskStatusBadge status={task.status} />
                  </button>
                )}
                {isEditingLabel ? (
                  <select
                    value={selectedLabelId}
                    onChange={async (event) => {
                      await onLabelChange?.(event.target.value);
                      setIsEditingLabel(false);
                    }}
                    onBlur={() => setIsEditingLabel(false)}
                    autoFocus
                    className="rounded-full border border-outline-variant bg-surface px-3 py-1.5 text-label-sm"
                  >
                    <option value="">No label</option>
                    {labels.map((label) => (
                      <option key={label.id} value={label.id}>{label.name}</option>
                    ))}
                  </select>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingLabel(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm border border-outline-variant bg-surface-container-high text-on-surface shadow-[0_0_10px_rgba(87,241,219,0.08)]"
                    style={activeLabel?.color ? { borderColor: activeLabel.color, color: activeLabel.color } : undefined}
                  >
                    <span className="material-symbols-outlined text-[14px]">label</span>
                    {task.label || "No Label"}
                  </button>
                )}
                <span className="text-label-sm text-on-surface-variant">Due {formatDueDate(task.dueDate)}</span>
                {task.taskType &&
                String(task.taskType).toLowerCase() !== String(task.label || "").toLowerCase() ? (
                  <span className="text-label-sm text-on-surface-variant/80">{String(task.taskType).replaceAll("_", " ")}</span>
                ) : null}
              </div>
            </header>

            <div className="flex items-center gap-xs border-b border-outline-variant">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-sm py-xs text-label-sm ${activeTab === tab ? "text-primary border-b-2 border-primary" : "text-on-surface-variant"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Overview" ? (
              <div className="space-y-sm">
                <p className="text-body-md text-on-surface-variant">{task.description || "No description available."}</p>
                <div className="rounded-xl border border-outline-variant bg-surface-container p-sm text-label-sm text-on-surface-variant">
                  Click Status or Label pills above to edit inline.
                </div>
              </div>
            ) : (
              <NotesPreview
                notes={notesPreview}
                totalCount={notesCount}
                onCreateNote={onCreateNote}
                onViewAll={onViewAllNotes}
                onViewNote={onOpenNote}
              />
            )}

            <div className="flex flex-wrap gap-sm pt-sm">
              <button type="button" onClick={onEdit} className="rounded-lg px-md py-xs bg-primary text-on-primary">Edit</button>
              <button
                type="button"
                onClick={() => onStatusChange("COMPLETED")}
                disabled={statusUpdating || task.status === "COMPLETED"}
                className="rounded-lg px-md py-xs border border-outline-variant text-on-surface-variant disabled:opacity-60"
              >
                {statusUpdating ? "Updating..." : "Mark Complete"}
              </button>
              <button type="button" onClick={onDelete} disabled={deleting} className="rounded-lg px-md py-xs border border-error text-error disabled:opacity-60">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
};

export default TaskSlideOverPanel;

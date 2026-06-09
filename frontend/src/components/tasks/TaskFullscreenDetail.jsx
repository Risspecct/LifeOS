import { formatDueDate } from "../../utils/taskUtils";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskTypeChip from "./TaskTypeChip";
import { useState } from "react";
import NotesList from "../notes/NotesList";

const TaskFullscreenDetail = ({
  task,
  loading,
  onBack,
  onEdit,
  onDelete,
  deleting,
  onStatusChange,
  statusUpdating,
  labels = [],
  statusOptions = [],
  onLabelChange,
  notes = [],
  onViewAllNotes,
  onViewNote
}) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const activeLabel =
    labels.find((label) => String(label.id) === String(task?.labelId)) ||
    labels.find((label) => String(label.name).toLowerCase() === String(task?.label || "").toLowerCase());
  const selectedLabelId = activeLabel?.id ?? "";

  if (loading) {
    return <p className="text-on-surface-variant">Loading task details...</p>;
  }

  if (!task) {
    return <p className="text-error">Unable to load this task.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-surface border border-outline-variant rounded-xl p-lg space-y-lg">
      <div className="flex items-center justify-between gap-sm">
        <button type="button" onClick={onBack} className="text-on-surface-variant hover:text-primary flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to workspace
        </button>
      </div>

      <header className="space-y-sm border-b border-outline-variant pb-md">
        <h1 className="font-h2 text-h2">{task.title}</h1>
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
          {task.taskType ? <TaskTypeChip taskType={task.taskType} /> : null}
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

      <section className="space-y-xs">
        <h3 className="font-label-sm uppercase tracking-wider text-on-surface-variant">Description</h3>
        <p className="text-body-md text-on-surface-variant whitespace-pre-line">
          {task.description || "No description provided."}
        </p>
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface-container p-sm">
        <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Metadata</h4>
        <p className="text-label-sm text-on-surface-variant">Click status and label pills above to edit inline.</p>
      </section>

      <section className="space-y-sm">
        <div className="flex items-center justify-between gap-sm">
          <div>
            <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Notes</h4>
            <p className="text-label-sm text-on-surface-variant">Recent notes linked to this task.</p>
          </div>
          {onViewAllNotes ? (
            <button type="button" onClick={onViewAllNotes} className="text-label-sm text-primary hover:underline">
              View All
            </button>
          ) : null}
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container p-sm">
          {notes.length === 0 ? (
            <p className="text-label-sm text-on-surface-variant">No notes yet.</p>
          ) : (
            <NotesList
              notes={notes}
              layout="list"
              showContent={false}
              maxHeight="max-h-[280px]"
              onViewNote={onViewNote}
            />
          )}
        </div>
      </section>

      <div className="flex flex-wrap gap-sm pt-sm border-t border-outline-variant">
        <button type="button" onClick={onEdit} className="rounded-lg px-md py-xs bg-primary text-on-primary">Edit Task</button>
        <button
          type="button"
          onClick={() => onStatusChange("COMPLETED")}
          disabled={statusUpdating || task.status === "COMPLETED"}
          className="rounded-lg px-md py-xs border border-outline-variant text-on-surface-variant disabled:opacity-60"
        >
          {statusUpdating ? "Updating..." : "Mark Complete"}
        </button>
        <button type="button" onClick={onDelete} disabled={deleting} className="rounded-lg px-md py-xs border border-error text-error disabled:opacity-60">
          {deleting ? "Deleting..." : "Delete Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskFullscreenDetail;

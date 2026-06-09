import EmptyNotesState from "./EmptyNotesState";
import NoteDetail from "./NoteDetail";
import NotesList from "./NotesList";

const TaskNotesWorkspace = ({
  task,
  notes = [],
  loading = false,
  error = "",
  selectedNote = null,
  selectedNoteLoading = false,
  selectedNoteError = "",
  onBackToTask,
  onBackToNotesList,
  onCreateNote,
  onViewNote,
  onEditNote,
  onDeleteNote
}) => {
  if (selectedNote || selectedNoteLoading || selectedNoteError) {
    return (
      <div className="space-y-sm">
        <div className="flex items-center justify-between gap-sm">
          <div>
            <p className="text-label-xs uppercase tracking-widest text-on-surface-variant">Task Notes</p>
            <h1 className="font-h2 text-h2 text-on-surface">{task?.title || "Task Notes"}</h1>
          </div>
          {onCreateNote ? (
            <button type="button" onClick={onCreateNote} className="rounded-xl bg-primary px-sm py-xs text-label-sm font-bold text-on-primary">
              Create Note
            </button>
          ) : null}
        </div>

        <NoteDetail
          note={selectedNote}
          loading={selectedNoteLoading}
          error={selectedNoteError}
          onBack={onBackToNotesList || onBackToTask}
          onEdit={selectedNote ? () => onEditNote?.(selectedNote) : undefined}
          onDelete={selectedNote ? () => onDeleteNote?.(selectedNote) : undefined}
          backLabel="Back to Notes"
        />
      </div>
    );
  }

  return (
    <div className="space-y-md">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-sm">
        <div className="space-y-xs">
          <button type="button" onClick={onBackToTask} className="inline-flex items-center gap-xs text-on-surface-variant hover:text-primary text-label-sm">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to task
          </button>
          <div>
            <p className="text-label-xs uppercase tracking-widest text-on-surface-variant">Task Notes</p>
            <h1 className="font-h2 text-h2 text-on-surface">{task?.title || "Notes"}</h1>
            <p className="text-label-sm text-on-surface-variant mt-xs">
              Document research, logs, and meeting summaries for this task.
            </p>
          </div>
        </div>
        {onCreateNote ? (
          <button type="button" onClick={onCreateNote} className="inline-flex items-center gap-xs rounded-xl bg-primary px-sm py-xs text-label-sm font-bold text-on-primary hover:opacity-90">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Note
          </button>
        ) : null}
      </div>

      {loading ? (
        <NotesList loading />
      ) : error ? (
        <p className="text-error text-label-sm">{error}</p>
      ) : notes.length === 0 ? (
        <EmptyNotesState onCreateNote={onCreateNote} />
      ) : (
        <NotesList
          notes={notes}
          onViewNote={onViewNote}
          onEditNote={onEditNote}
          onDeleteNote={onDeleteNote}
        />
      )}
    </div>
  );
};

export default TaskNotesWorkspace;

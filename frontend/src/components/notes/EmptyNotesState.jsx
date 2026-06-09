const EmptyNotesState = ({ onCreateNote, compact = false }) => {
  return (
    <div className={`rounded-xl border border-dashed border-outline-variant bg-surface-container/40 ${compact ? "p-sm" : "p-md"}`}>
      <div className="flex flex-col items-center justify-center text-center gap-xs">
        <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">edit_note</span>
        <div>
          <h3 className="font-label-sm font-bold text-on-surface">{compact ? "No notes yet" : "No notes yet"}</h3>
          <p className="text-label-sm text-on-surface-variant mt-1 max-w-lg">
            Capture quick thoughts, research, and task-linked context without cluttering your task list.
          </p>
        </div>
        {onCreateNote ? (
          <button
            type="button"
            onClick={onCreateNote}
            className="inline-flex items-center gap-xs rounded-xl bg-primary px-sm py-xs text-label-sm font-bold text-on-primary hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Note
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default EmptyNotesState;

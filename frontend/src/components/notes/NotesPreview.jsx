import NoteCard from "./NoteCard";

const NotesPreview = ({ notes = [], totalCount = 0, onCreateNote, onViewAll, onViewNote }) => {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container p-sm space-y-sm">
      <div className="flex items-center justify-between gap-sm">
        <div>
          <h4 className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Notes Preview</h4>
          <p className="text-[12px] text-on-surface-variant">{totalCount} note{totalCount === 1 ? "" : "s"}</p>
        </div>
        {onViewAll ? (
          <button type="button" onClick={onViewAll} className="text-label-sm text-primary hover:underline">
            View All Notes
          </button>
        ) : null}
      </div>

      {notes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-sm text-center space-y-xs">
          <p className="text-label-sm text-on-surface-variant">No notes yet</p>
          {onCreateNote ? (
            <button type="button" onClick={onCreateNote} className="rounded-lg bg-primary px-sm py-xs text-label-sm font-bold text-on-primary">
              Add Note
            </button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-2">
          {notes.slice(0, 2).map((note) => (
            <NoteCard key={note.id} note={note} compact onView={() => onViewNote?.(note)} />
          ))}
          {onCreateNote ? (
            <button type="button" onClick={onCreateNote} className="w-full rounded-xl border border-dashed border-outline-variant px-sm py-xs text-label-sm text-on-surface-variant hover:text-primary hover:border-primary/40">
              Add Note
            </button>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default NotesPreview;

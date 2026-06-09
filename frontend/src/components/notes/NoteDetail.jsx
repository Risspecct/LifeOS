import { formatNoteDateTime } from "../../utils/noteUtils";

const NoteDetail = ({ note, loading = false, error = "", onBack, onEdit, onDelete, backLabel = "Back to Notes" }) => {
  if (loading) {
    return <p className="text-on-surface-variant">Loading note...</p>;
  }

  if (error) {
    return <p className="text-error">{error}</p>;
  }

  if (!note) {
    return <p className="text-on-surface-variant">Unable to load this note.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto rounded-2xl border border-outline-variant bg-surface p-md md:p-lg space-y-md">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-xs text-label-sm text-on-surface-variant hover:text-primary">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        {backLabel}
      </button>

      <header className="space-y-sm border-b border-outline-variant pb-sm md:pb-md">
        <div className="flex items-start justify-between gap-md">
          <div className="min-w-0">
            <h1 className="font-h2 text-h2 text-on-surface break-words">{note.title || "Untitled note"}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-xs text-label-sm text-on-surface-variant">
              {note.taskTitle ? (
                <span className="rounded-full border border-outline-variant bg-surface-container-high px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  {note.taskTitle}
                </span>
              ) : (
                <span className="rounded-full border border-outline-variant bg-surface-container-high px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  Standalone note
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-xs shrink-0">
            {onEdit ? (
              <button type="button" onClick={onEdit} className="rounded-lg border border-outline-variant px-sm py-xs text-label-sm text-on-surface-variant hover:text-primary">
                Edit
              </button>
            ) : null}
            {onDelete ? (
              <button type="button" onClick={onDelete} className="rounded-lg border border-error px-sm py-xs text-label-sm text-error hover:bg-error/10">
                Delete
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-sm text-[12px] text-on-surface-variant">
          <span>Created {formatNoteDateTime(note.createdAt)}</span>
          <span>Updated {formatNoteDateTime(note.updatedAt)}</span>
        </div>
      </header>

      <section className="space-y-xs">
        <h2 className="font-label-sm uppercase tracking-wider text-on-surface-variant">Content</h2>
        <div className="rounded-xl border border-outline-variant bg-surface-container p-sm md:p-md">
          <p className="text-body-md text-on-surface whitespace-pre-line leading-relaxed">
            {note.message || note.content || "No content provided."}
          </p>
        </div>
      </section>
    </div>
  );
};

export default NoteDetail;

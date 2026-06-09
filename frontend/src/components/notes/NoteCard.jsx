import { clampText, formatNoteTimestamp } from "../../utils/noteUtils";

const NoteCard = ({ note, compact = false, showContent = true, onView, onEdit, onDelete }) => {
  return (
    <article
      className={`group relative flex flex-col rounded-xl border border-outline-variant bg-surface-container-high transition-all hover:border-primary/40 hover:shadow-[0_0_18px_rgba(87,241,219,0.08)] ${
        compact ? "p-xs" : "p-sm min-h-[138px]"
      }`}
    >
      <div className="flex items-start justify-between gap-xs">
        <button
          type="button"
          onClick={onView}
          className="min-w-0 flex-1 text-left"
          title={note.title || "Untitled note"}
          aria-label={note.title || "Untitled note"}
        >
          <div className="flex items-center gap-xs min-w-0">
            <h3 className="font-label-sm text-on-surface group-hover:text-primary transition-colors truncate min-w-0">
              {note.title || "Untitled note"}
            </h3>
            {note.updatedAt ? (
              <span className="shrink-0 text-[9px] uppercase tracking-wider text-on-surface-variant whitespace-nowrap">
                {formatNoteTimestamp(note.updatedAt)}
              </span>
            ) : null}
          </div>
        </button>

        <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
              aria-label="Edit note"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg p-1 text-on-surface-variant hover:text-error hover:bg-surface-container-low"
              aria-label="Delete note"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-1 flex items-center gap-1 min-w-0">
        {note.taskTitle ? (
          <span className="rounded-full border border-outline-variant bg-surface px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant truncate">
            {note.taskTitle}
          </span>
        ) : (
          <span className="rounded-full border border-outline-variant bg-surface px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
            Standalone
          </span>
        )}
      </div>

      {showContent ? (
        <button type="button" onClick={onView} className="mt-sm text-left">
          <p className="text-label-sm text-on-surface-variant line-clamp-2">
            {clampText(note.message || note.content || "No content yet.", compact ? 68 : 110)}
          </p>
        </button>
      ) : null}
    </article>
  );
};

export default NoteCard;

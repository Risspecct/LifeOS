import NoteCard from "./NoteCard";
import { Skeleton, SkeletonCard } from "../ui/Skeleton";

const NotesList = ({
  notes = [],
  loading = false,
  error = "",
  onViewNote,
  onEditNote,
  onDeleteNote,
  layout = "grid",
  showContent = true,
  maxHeight = ""
}) => {
  if (loading) {
    const loadingListClass = layout === "list" ? "space-y-2" : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-sm";
    return (
      <div className={`${loadingListClass} ${maxHeight} ${layout === "list" ? "overflow-y-auto pr-1" : ""}`}>
        {Array.from({ length: layout === "list" ? 4 : 6 }).map((_, index) => (
          <SkeletonCard key={index} className={`space-y-2 p-sm ${layout === "list" ? "min-h-[72px]" : "min-h-[140px]"}`}>
            <Skeleton className="h-4 w-2/3" />
            {layout === "grid" ? (
              <>
                <div className="flex gap-2">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-5/6" />
              </>
            ) : (
              <div className="flex gap-2">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-20" />
              </div>
            )}
          </SkeletonCard>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-error text-label-sm">{error}</p>;
  }

  if (notes.length === 0) {
    return null;
  }

  if (layout === "list") {
    return (
      <div className={`${maxHeight} overflow-y-auto pr-1 space-y-2`}>
        {notes.map((note) => (
          <button
            key={note.id}
            type="button"
            onClick={() => onViewNote?.(note)}
            className="w-full text-left rounded-xl border border-outline-variant bg-surface-container-high px-sm py-sm transition-colors hover:border-primary/40 hover:bg-surface-container"
          >
            <div className="flex items-start justify-between gap-sm">
              <div className="min-w-0">
                <p className="font-label-sm text-on-surface truncate">{note.title || "Untitled note"}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-wider text-on-surface-variant">
                  <span>{note.taskTitle || "Standalone"}</span>
                  {note.updatedAt ? <span>Updated</span> : null}
                  {note.updatedAt ? <span>{new Date(note.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}</span> : null}
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-sm">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          showContent={showContent}
          onView={() => onViewNote?.(note)}
          onEdit={onEditNote ? () => onEditNote(note) : undefined}
          onDelete={onDeleteNote ? () => onDeleteNote(note) : undefined}
        />
      ))}
    </div>
  );
};

export default NotesList;

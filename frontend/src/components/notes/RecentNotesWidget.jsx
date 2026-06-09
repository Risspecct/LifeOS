import { useDelayedLoading } from "../../hooks/useDelayedLoading";
import { Skeleton, SkeletonCard } from "../ui/Skeleton";
import NoteCard from "./NoteCard";

const RecentNotesWidget = ({ notes = [], loading = false, error = "", onViewNote, onCreateNote, compact = false }) => {
  const showSkeleton = useDelayedLoading(loading, 200);

  return (
    <section className={`bg-surface-container border border-outline-variant rounded-xl ${compact ? "p-sm h-[300px]" : "p-sm lg:p-md"} flex flex-col overflow-hidden`}>
      <div className="flex items-center justify-between gap-sm">
        <h3 className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary text-[18px]">note_stack</span>
          Recent Notes
        </h3>
        {onCreateNote ? (
          <button type="button" onClick={onCreateNote} className="text-primary font-label-sm hover:underline">
            Add Note
          </button>
        ) : null}
      </div>

      {showSkeleton ? (
        <div className="mt-2 flex-1 space-y-1.5 overflow-y-auto pr-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} className={`space-y-2 ${compact ? "p-xs" : "p-sm"}`}>
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3.5 w-24" />
              </div>
              <Skeleton className="h-3.5 w-full" />
            </SkeletonCard>
          ))}
        </div>
      ) : error ? (
        <p className="mt-2 text-error text-label-sm">{error}</p>
      ) : notes.length === 0 ? (
        <p className="mt-2 text-label-sm text-on-surface-variant">No notes yet.</p>
      ) : (
        <div className="mt-2 flex-1 space-y-1.5 overflow-y-auto pr-1">
          {notes.slice(0, 5).map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              compact={compact}
              showContent={false}
              onView={() => onViewNote?.(note)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentNotesWidget;

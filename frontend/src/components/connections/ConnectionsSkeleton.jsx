const ConnectionsSkeleton = ({ rows = 4 }) => {
  return (
    <div className="space-y-sm">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="rounded-xl border border-outline-variant bg-surface-container p-md animate-pulse">
          <div className="flex items-start justify-between gap-sm">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 rounded-full bg-surface-variant" />
              <div className="space-y-2">
                <div className="h-3 w-28 rounded bg-surface-variant" />
                <div className="h-2.5 w-20 rounded bg-surface-variant" />
              </div>
            </div>
            <div className="h-7 w-20 rounded-lg bg-surface-variant" />
          </div>
          <div className="mt-3 h-10 rounded-lg bg-surface-variant" />
          <div className="mt-3 flex gap-xs">
            <div className="h-7 w-24 rounded-lg bg-surface-variant" />
            <div className="h-7 w-20 rounded-lg bg-surface-variant" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectionsSkeleton;

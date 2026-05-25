const ConnectionsSkeleton = ({ rows = 4 }) => {
  return (
    <div className="space-y-sm">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-16 rounded-xl border border-outline-variant bg-surface-container animate-pulse" />
      ))}
    </div>
  );
};

export default ConnectionsSkeleton;

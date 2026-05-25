const LeaderboardSkeleton = () => {
  return (
    <div className="space-y-xs">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="h-14 rounded-xl border border-outline-variant bg-surface-container animate-pulse" />
      ))}
    </div>
  );
};

export default LeaderboardSkeleton;

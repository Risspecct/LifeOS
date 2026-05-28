import { Skeleton } from "../ui/Skeleton";

const LeaderboardSkeleton = ({ rows = 6 }) => {
  return (
    <div className="space-y-xs">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-14 rounded-xl border border-outline-variant bg-surface-container flex items-center px-4 gap-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
};

export default LeaderboardSkeleton;

import { Skeleton, SkeletonAvatar, SkeletonCard } from "../ui/Skeleton";

const ConnectionsSkeleton = ({ rows = 4 }) => {
  return (
    <div className="space-y-sm">
      {Array.from({ length: rows }).map((_, idx) => (
        <SkeletonCard key={idx} className="p-md">
          <div className="flex items-start justify-between gap-sm">
            <div className="flex items-center gap-sm">
              <SkeletonAvatar />
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
          <Skeleton className="mt-3 h-10 w-full rounded-lg" />
          <div className="mt-3 flex gap-xs">
            <Skeleton className="h-7 w-24 rounded-lg" />
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
};

export default ConnectionsSkeleton;

import { Skeleton, SkeletonCard, SkeletonText } from "../ui/Skeleton";

const ActivitySkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="h-24" />
        ))}
      </div>
      <SkeletonCard className="h-64" />
      <div className="grid lg:grid-cols-2 gap-lg">
        <SkeletonCard className="h-72" />
        <SkeletonCard className="h-72" />
      </div>
      <SkeletonCard className="h-48" />
      <SkeletonCard className="h-[400px]" />
    </>
  );
};

export default ActivitySkeleton;

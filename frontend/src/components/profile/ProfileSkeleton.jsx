import { Skeleton, SkeletonCard } from "../ui/Skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
      <div className="lg:col-span-1 space-y-md">
        <SkeletonCard className="flex flex-col items-center text-center p-xl">
          <Skeleton className="w-32 h-32 rounded-full mb-6" />
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-32 mb-6" />
          
          <div className="w-full space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </SkeletonCard>
      </div>

      <div className="lg:col-span-2 space-y-md">
        <SkeletonCard className="p-xl">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6" />
        </SkeletonCard>

        <SkeletonCard className="p-xl">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
};

export default ProfileSkeleton;

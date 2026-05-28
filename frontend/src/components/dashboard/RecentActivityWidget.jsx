import { Skeleton } from "../ui/Skeleton";
import { useDelayedLoading } from "../../hooks/useDelayedLoading";

const RecentActivityWidget = ({ activities, loading, onOpenTask }) => {
  const showSkeleton = useDelayedLoading(loading, 200);

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-md">
      <h4 className="font-label-sm font-bold text-on-surface-variant mb-md uppercase tracking-wider">
        Recent Activity
      </h4>

      {showSkeleton ? (
        <div className="space-y-sm">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-full flex items-start gap-sm rounded-lg border border-outline-variant/70 bg-surface-container-high px-sm py-sm"
            >
              <Skeleton className="w-5 h-5 rounded mt-0.5" />
              <div className="min-w-0 w-full space-y-2">
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-2 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : !loading && activities.length === 0 ? (
        <p className="text-label-sm text-on-surface-variant">No recent activity yet.</p>
      ) : (
        <div className="space-y-sm">
          {activities.map((activity, index) => (
            <button
              key={`${activity.id}-${index}`}
              type="button"
              onClick={() => (activity.taskId ? onOpenTask?.(activity.taskId) : undefined)}
              className="w-full text-left flex items-start gap-sm rounded-lg border border-outline-variant/70 bg-surface-container-high px-sm py-sm transition-colors hover:bg-surface-variant"
            >
              <span className={`material-symbols-outlined text-lg mt-0.5 ${activity.iconTone}`}>
                {activity.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-on-surface leading-tight">{activity.text}</p>
                <p className="text-[11px] text-on-surface-variant mt-1">{activity.time}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivityWidget;

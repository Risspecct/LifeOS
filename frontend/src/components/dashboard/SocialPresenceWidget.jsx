import ConnectionAvatar from "../connections/ConnectionAvatar";
import { useDelayedLoading } from "../../hooks/useDelayedLoading";
import { formatRelativeTime } from "../../utils/dateTime";
import { Skeleton } from "../ui/Skeleton";

const ACTIVITY_ICON_MAP = {
  LEVEL_UP: { icon: "stars", tone: "text-primary" },
  STREAK_MILESTONE: { icon: "local_fire_department", tone: "text-tertiary" },
  PRODUCTIVITY_MILESTONE: { icon: "workspace_premium", tone: "text-cyan-300" }
};

const getActivityIcon = (activityType) => {
  return ACTIVITY_ICON_MAP[activityType] ?? { icon: "bolt", tone: "text-on-surface-variant" };
};

const SocialPresenceWidget = ({ activities = [], loading = false, error = "" }) => {
  const showSkeleton = useDelayedLoading(loading, 200);

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-md">
      <h4 className="font-label-sm font-bold text-on-surface-variant mb-md uppercase tracking-wider">
        Friend Highlights
      </h4>

      {showSkeleton ? (
        <div className="space-y-sm">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-start gap-sm rounded-lg border border-outline-variant/70 bg-surface-container-high px-sm py-sm"
            >
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-2 w-14" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-label-sm text-on-surface-variant">Unable to load friend highlights right now.</p>
      ) : activities.length === 0 ? (
        <p className="text-label-sm text-on-surface-variant">No friend milestones yet. Check back soon.</p>
      ) : (
        <div className="space-y-sm">
          {activities.slice(0, 4).map((activity) => {
            const { icon, tone } = getActivityIcon(activity.activityType);

            return (
              <div
                key={activity.id}
                className="flex items-start gap-sm rounded-lg border border-outline-variant/70 bg-surface-container-high px-sm py-sm"
              >
                <ConnectionAvatar name={activity.username} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-sm">
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-on-surface truncate">{activity.username}</p>
                      <p className="text-[12px] text-on-surface-variant leading-tight mt-0.5">{activity.description}</p>
                    </div>
                    <span className={`material-symbols-outlined text-[18px] ${tone}`}>{icon}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    {formatRelativeTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SocialPresenceWidget;

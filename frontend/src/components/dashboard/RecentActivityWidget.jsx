const RecentActivityWidget = ({ activities, loading, onOpenTask }) => {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-md">
      <h4 className="font-label-sm font-bold text-on-surface-variant mb-md uppercase tracking-wider">
        Recent Activity
      </h4>

      {loading ? <p className="text-label-sm text-on-surface-variant">Loading activity...</p> : null}
      {!loading && activities.length === 0 ? (
        <p className="text-label-sm text-on-surface-variant">No recent activity yet.</p>
      ) : null}

      <div className="space-y-sm">
        {activities.map((activity, index) => (
          <button
            key={`${activity.id}-${index}`}
            type="button"
            onClick={() => (activity.taskId ? onOpenTask?.(activity.taskId) : undefined)}
            className="w-full text-left flex items-start gap-sm rounded-lg border border-outline-variant/70 bg-surface-container-high px-sm py-sm"
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
    </div>
  );
};

export default RecentActivityWidget;

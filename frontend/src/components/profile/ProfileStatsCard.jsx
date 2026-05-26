const formatValue = (value) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
};

const ProfileStatsCard = ({ stats, loading, error, onRetry }) => {
  if (loading) {
    return (
      <section className="bg-surface-container border border-outline-variant rounded-xl p-md">
        <h3 className="font-h3 text-h3 text-on-surface mb-sm">Performance Signals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-sm">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className="h-[78px] rounded-lg bg-surface-container-high border border-outline-variant p-sm animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-surface-container border border-outline-variant rounded-xl p-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm">
          <div>
            <h3 className="font-h3 text-h3 text-on-surface mb-1">Performance Signals</h3>
            <p className="text-on-surface-variant font-body-sm">{error}</p>
          </div>
          {typeof onRetry === "function" ? (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg px-md py-xs border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Retry
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="bg-surface-container border border-outline-variant rounded-xl p-md">
        <h3 className="font-h3 text-h3 text-on-surface mb-1">Performance Signals</h3>
        <p className="text-on-surface-variant">No performance data available yet.</p>
      </section>
    );
  }

  const statItems = [
    { label: "Total Points", value: formatValue(stats.totalPoints) },
    { label: "Tasks Completed", value: formatValue(stats.tasksCompleted) },
    { label: "Current Streak", value: formatValue(stats.currentStreak) },
    { label: "Longest Streak", value: formatValue(stats.longestStreak) }
  ];

  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-md">
      <h3 className="font-h3 text-h3 text-on-surface mb-sm">Performance Signals</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-sm">
        {statItems.map((item) => (
          <div key={item.label} className="rounded-lg bg-surface-container-high border border-outline-variant p-sm">
            <p className="text-on-surface-variant font-label-sm">{item.label}</p>
            <p className="text-on-surface font-h3 text-h3">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileStatsCard;

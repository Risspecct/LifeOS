import { useDelayedLoading } from "../../hooks/useDelayedLoading";

const formatDays = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const asNumber = Number(value);
  if (!Number.isFinite(asNumber)) return "—";
  const safe = Math.max(0, Math.floor(asNumber));
  return `${safe} Day${safe === 1 ? "" : "s"}`;
};

const StudyStreakWidget = ({ streakDays, loading, error }) => {
  const showSkeleton = useDelayedLoading(loading, 200);

  if (loading) {
    return (
      <div className={`bg-primary text-on-primary rounded-xl p-md shadow-lg shadow-primary/10 relative overflow-hidden ${showSkeleton ? 'animate-pulse' : ''} min-h-[120px]`}>
        {showSkeleton ? (
          <div className="relative z-10">
          <div className="flex items-center gap-sm mb-xs">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <span className="font-label-sm font-bold uppercase tracking-wider">Study Streak</span>
          </div>
          <div className="h-[28px] w-32 rounded bg-on-primary/20" />
          <div className="h-[14px] w-48 rounded bg-on-primary/15 mt-2" />
        </div>
        ) : <div />}
        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12">
          local_fire_department
        </span>
      </div>
    );
  }

  const valueLabel = error ? "—" : formatDays(streakDays);

  return (
    <div className="bg-primary text-on-primary rounded-xl p-md shadow-lg shadow-primary/10 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-sm mb-xs">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_fire_department
          </span>
          <span className="font-label-sm font-bold uppercase tracking-wider">Study Streak</span>
        </div>
        <p className="font-h3 text-h3 leading-none">{valueLabel}</p>
        <p className="text-[12px] opacity-80 mt-1">
          {error ? "Unable to load streak right now." : "Consistency is your superpower."}
        </p>
      </div>
      <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12">
        local_fire_department
      </span>
    </div>
  );
};

export default StudyStreakWidget;

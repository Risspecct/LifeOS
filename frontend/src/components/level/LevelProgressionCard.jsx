import { Skeleton, SkeletonCard } from "../ui/Skeleton";

const formatPoints = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "0";
  return Number(value).toLocaleString();
};

const getProgressValues = (levelData) => {
  const level = Math.max(1, Number(levelData?.level || 1));
  const totalPoints = Math.max(0, Number(levelData?.totalPoints || 0));
  const currentLevelProgress = Math.max(0, Number(levelData?.currentLevelProgress || 0));
  const pointsRequiredForNextLevel = Math.max(0, Number(levelData?.pointsRequiredForNextLevel || 0));
  const progressPoints = Math.min(currentLevelProgress, pointsRequiredForNextLevel);
  const progressPercent = pointsRequiredForNextLevel > 0 ? Math.min(100, Math.round((progressPoints / pointsRequiredForNextLevel) * 100)) : 0;
  const pointsUntilNextLevel = Math.max(0, pointsRequiredForNextLevel - currentLevelProgress);

  return {
    level,
    totalPoints,
    currentLevelProgress,
    pointsRequiredForNextLevel,
    progressPercent,
    pointsUntilNextLevel
  };
};

const LevelProgressionCard = ({ levelData, loading, error, onRetry, variant = "dashboard" }) => {
  const isProfileVariant = variant === "profile";

  if (loading) {
    return (
      <SkeletonCard className={variant === "dashboard" ? "min-h-[220px] flex-1" : ""}>
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      </SkeletonCard>
    );
  }

  if (error) {
    return (
      <section className="bg-surface-container border border-outline-variant rounded-xl p-md">
        <div className="flex flex-col gap-sm">
          <div>
            <h3 className="font-h3 text-h3 text-on-surface">Level Progression</h3>
            <p className="text-on-surface-variant text-sm mt-1">{error}</p>
          </div>
          {typeof onRetry === "function" ? (
            <button
              type="button"
              onClick={onRetry}
              className="w-fit rounded-lg px-md py-xs border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Retry
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  if (!levelData) {
    return (
      <section className="bg-surface-container border border-outline-variant rounded-xl p-md">
        <h3 className="font-h3 text-h3 text-on-surface mb-1">Level Progression</h3>
        <p className="text-on-surface-variant text-sm">Level data is unavailable.</p>
      </section>
    );
  }

  const {
    level,
    totalPoints,
    currentLevelProgress,
    pointsRequiredForNextLevel,
    progressPercent,
    pointsUntilNextLevel
  } = getProgressValues(levelData);

  const nextLevel = level + 1;
  const progressLabel = `${progressPercent}% Complete`;
  const levelLabel = `Level ${formatPoints(level)}`;

  if (isProfileVariant) {
    return (
      <section className="bg-surface-container border border-outline-variant rounded-xl p-lg space-y-md">
        <div className="space-y-1">
          <h3 className="font-h3 text-h3 text-on-surface">Level Progression</h3>
          <p className="text-on-surface-variant text-sm">Track your progress toward the next level.</p>
        </div>

        <div className="space-y-1">
          <p className="text-on-surface-variant text-[11px] font-bold tracking-[0.24em] uppercase">Current Level</p>
          <p className="text-on-surface font-semibold text-2xl leading-tight tracking-tight">{levelLabel}</p>
        </div>

        <div className="space-y-2">
          <div
            className="h-3 w-full overflow-hidden rounded-full bg-surface-container-high"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Level progression"
          >
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-on-surface-variant text-sm">{pointsUntilNextLevel} XP until Level {nextLevel}</p>
        </div>

        <p className="text-on-surface-variant text-sm">Total XP {formatPoints(totalPoints)}</p>
      </section>
    );
  }

  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-md lg:p-lg min-h-[220px] flex-1 space-y-md">
      <div className="space-y-1">
        <p className="text-on-surface-variant font-label-sm">Level Progression</p>
        <h3 className="font-semibold text-2xl leading-tight tracking-tight text-on-surface">{levelLabel}</h3>
      </div>

      <div className="space-y-3">
        <p className="text-on-surface font-medium">{progressLabel}</p>
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container-high">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="text-on-surface-variant text-sm">{pointsUntilNextLevel} XP until Level {nextLevel}</p>
      </div>
    </section>
  );
};

export default LevelProgressionCard;

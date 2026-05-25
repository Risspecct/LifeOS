const CurrentUserCard = ({ stats, loading }) => {
  if (loading) {
    return <div className="h-[88px] rounded-xl border border-outline-variant bg-surface-container animate-pulse" />;
  }

  if (!stats) return null;

  return (
    <section className="rounded-xl border border-primary/30 bg-primary/5 p-md">
      <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Your standing</p>
      <div className="grid grid-cols-3 gap-sm">
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Rank</p>
          <p className="font-title-lg text-title-lg text-on-surface">#{stats.rank}</p>
        </div>
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Points</p>
          <p className="font-title-lg text-title-lg text-on-surface">{stats.points}</p>
        </div>
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Streak</p>
          <p className="font-title-lg text-title-lg text-on-surface">{stats.streak}d</p>
        </div>
      </div>
    </section>
  );
};

export default CurrentUserCard;

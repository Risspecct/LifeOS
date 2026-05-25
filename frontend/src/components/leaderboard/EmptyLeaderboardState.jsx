const EmptyLeaderboardState = () => {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container p-lg text-center">
      <p className="font-title-sm text-title-sm text-on-surface mb-xs">No rankings available yet</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Progress will appear here once members start completing tasks and building streaks.
      </p>
    </div>
  );
};

export default EmptyLeaderboardState;

import LeaderboardRow from "./LeaderboardRow";

const LeaderboardTable = ({ entries, currentUserId, currentUsername, onOpenProfile }) => {
  return (
    <div className="space-y-xs">
      <div className="hidden sm:grid grid-cols-[40px_1.5fr_1fr_1fr] gap-md px-sm py-xs text-label-sm text-on-surface-variant">
        <p>Rank</p>
        <p>Name</p>
        <p>Points</p>
        <p className="text-right">Streak</p>
      </div>

      {entries.map((entry) => {
        const isCurrentUser =
          (currentUserId && String(entry.userId) === String(currentUserId)) ||
          (currentUsername && String(entry.username).toLowerCase() === String(currentUsername).toLowerCase());
        return (
          <LeaderboardRow
            key={entry.userId}
            entry={entry}
            highlightCurrentUser={Boolean(isCurrentUser)}
            onOpenProfile={onOpenProfile}
          />
        );
      })}
    </div>
  );
};

export default LeaderboardTable;

const buildInitials = (username = "") => {
  const chunks = String(username).trim().split(/\s+/).filter(Boolean);
  if (!chunks.length) return "U";
  if (chunks.length === 1) return chunks[0].slice(0, 2).toUpperCase();
  return `${chunks[0][0] || ""}${chunks[1][0] || ""}`.toUpperCase();
};

const LeaderboardRow = ({ entry, highlightCurrentUser }) => {
  const rank = Number(entry?.rank ?? 0);
  const rankTone =
    rank === 1
      ? "text-primary"
      : rank === 2
        ? "text-on-surface"
        : rank === 3
          ? "text-on-surface-variant"
          : "text-on-surface-variant";

  return (
    <div
      className={`grid grid-cols-[32px_1fr_auto] sm:grid-cols-[40px_1.5fr_1fr_1fr] gap-sm sm:gap-md items-center p-sm rounded-xl border ${
        highlightCurrentUser ? "border-primary/40 bg-primary/5" : "border-outline-variant bg-surface-container/50"
      } transition-colors hover:bg-surface-container`}
    >
      <div className={`font-title-md ${rankTone}`}>#{entry.rank}</div>

      <div className="flex items-center gap-sm min-w-0">
        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm">
          {buildInitials(entry.username)}
        </div>
        <p className="font-body-md text-body-md text-on-surface truncate">{entry.username}</p>
      </div>

      <p className="hidden sm:block font-label-sm text-label-sm text-on-surface-variant">
        {entry.points} pts
      </p>

      <p className="font-label-sm text-label-sm text-on-surface-variant sm:hidden">
        {entry.points} pts - {entry.streak}d
      </p>

      <p className="hidden sm:block font-label-sm text-label-sm text-on-surface-variant text-right">
        {entry.streak}d streak
      </p>
    </div>
  );
};

export default LeaderboardRow;

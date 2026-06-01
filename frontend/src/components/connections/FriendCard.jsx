import ConnectionAvatar from "./ConnectionAvatar";

const FriendCard = ({ friend, onRemove, removing, onViewProfile, onCompare }) => {
  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container p-md space-y-sm">
      <div className="flex items-start justify-between gap-sm">
        <button type="button" onClick={() => onViewProfile(friend)} className="flex items-center gap-sm min-w-0 text-left">
          <ConnectionAvatar name={friend.username} size="lg" />
          <div className="min-w-0">
            <p className="text-body-md text-on-surface truncate">{friend.username}</p>
            <p className="text-label-sm text-on-surface-variant truncate">{friend.college || "LifeOS member"}</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onRemove(friend.id)}
          disabled={removing}
          className="px-sm py-xs rounded-lg border border-outline-variant text-label-sm text-on-surface-variant hover:text-on-surface disabled:opacity-60"
        >
          {removing ? "Removing..." : "Remove"}
        </button>
      </div>

      <div className="rounded-lg border border-outline-variant/60 bg-surface p-sm">
        <p className="text-label-sm text-on-surface-variant">Productivity insights coming soon</p>
        <p className="text-label-xs text-on-surface-variant/80 mt-1">Streak tracking and compare stats are being added.</p>
      </div>

      <div className="flex flex-wrap items-center gap-xs">
        <button
          type="button"
          onClick={() => onCompare(friend)}
          className="px-sm py-xs rounded-lg border border-outline-variant text-label-sm text-on-surface-variant hover:text-on-surface"
        >
          Compare
        </button>
      </div>
    </article>
  );
};

export default FriendCard;

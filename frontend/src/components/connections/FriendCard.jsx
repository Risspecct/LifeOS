const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const FriendCard = ({ friend, onRemove, removing }) => {
  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container p-md flex items-center justify-between gap-sm">
      <div className="flex items-center gap-sm min-w-0">
        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm">
          {initials(friend.username)}
        </div>
        <div className="min-w-0">
          <p className="text-body-md text-on-surface truncate">{friend.username}</p>
          <p className="text-label-sm text-on-surface-variant truncate">{friend.college || "CampusOS member"}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(friend.id)}
        disabled={removing}
        className="px-sm py-xs rounded-lg border border-outline-variant text-label-sm text-on-surface-variant hover:text-on-surface disabled:opacity-60"
      >
        {removing ? "Removing..." : "Remove"}
      </button>
    </article>
  );
};

export default FriendCard;

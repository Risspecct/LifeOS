const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const DiscoverUserCard = ({ user, onSendRequest, actionState }) => {
  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container p-md flex items-center justify-between gap-sm">
      <div className="flex items-center gap-sm min-w-0">
        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm">
          {initials(user.username)}
        </div>
        <div className="min-w-0">
          <p className="text-body-md text-on-surface truncate">{user.username}</p>
          <p className="text-label-sm text-on-surface-variant truncate">{user.college || "CampusOS member"}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onSendRequest(user.id)}
        disabled={actionState === "loading" || actionState === "success"}
        className="px-sm py-xs rounded-lg border border-outline-variant text-label-sm text-on-surface-variant hover:text-on-surface disabled:opacity-60"
      >
        {actionState === "loading" ? "Sending..." : actionState === "success" ? "Sent" : "Send Request"}
      </button>
    </article>
  );
};

export default DiscoverUserCard;

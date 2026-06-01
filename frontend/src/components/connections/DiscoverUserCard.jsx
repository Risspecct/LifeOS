import ConnectionAvatar from "./ConnectionAvatar";

const DiscoverUserCard = ({ user, onSendRequest, actionState, onOpenProfile }) => {
  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container p-md flex items-center justify-between gap-sm">
      <button type="button" onClick={() => onOpenProfile?.(user.id)} className="flex items-center gap-sm min-w-0 text-left">
        <ConnectionAvatar name={user.username} />
        <div className="min-w-0">
          <p className="text-body-md text-on-surface truncate">{user.username}</p>
          <p className="text-label-sm text-on-surface-variant truncate">{user.college || "LifeOS member"}</p>
        </div>
      </button>
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

import ConnectionAvatar from "./ConnectionAvatar";

const FriendRequestCard = ({ request, type, onAccept, onReject, loading, college, onOpenProfile }) => {
  const username = type === "incoming" ? request.senderUsername : request.receiverUsername;
  const profileUserId = type === "incoming" ? request.senderId : request.receiverId;

  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container p-md flex items-center justify-between gap-sm">
      <button
        type="button"
        onClick={() => onOpenProfile?.(profileUserId)}
        className="flex items-center gap-sm min-w-0 text-left"
      >
        <ConnectionAvatar name={username} />
        <div className="min-w-0">
          <p className="text-body-md text-on-surface truncate">{username}</p>
          <p className="text-label-sm text-on-surface-variant">
            {college || "LifeOS member"} · Request ID #{request.requestId}
          </p>
        </div>
      </button>

      {type === "incoming" ? (
        <div className="flex items-center gap-xs">
          <button
            type="button"
            onClick={() => onAccept(request.requestId)}
            disabled={loading}
            className="px-sm py-xs rounded-lg bg-primary text-on-primary text-label-sm disabled:opacity-60"
          >
            {loading ? "..." : "Accept"}
          </button>
          <button
            type="button"
            onClick={() => onReject(request.requestId)}
            disabled={loading}
            className="px-sm py-xs rounded-lg border border-outline-variant text-label-sm text-on-surface-variant disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      ) : (
        <span className="px-sm py-xs rounded-full bg-surface-variant text-on-surface-variant text-label-sm">Pending</span>
      )}
    </article>
  );
};

export default FriendRequestCard;

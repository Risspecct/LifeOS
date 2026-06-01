import { useEffect, useMemo, useState } from "react";
import { getPublicProfile } from "../../api/profileApi";
import { acceptFriendRequest, rejectFriendRequest, sendFriendRequest } from "../../services/connectionsApi";
import { getApiErrorMessage } from "../../utils/errorUtils";

const PublicProfileDialog = ({ isOpen, userId, onClose, onRelationshipActionComplete }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadProfile = async () => {
    if (!isOpen || !userId) return;
    setLoading(true);
    setError("");
    setActionError("");
    try {
      const data = await getPublicProfile(userId);
      setProfile(data);
    } catch (err) {
      setProfile(null);
      setError(getApiErrorMessage(err, "Unable to load public profile."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setProfile(null);
      setLoading(false);
      setError("");
      setActionLoading(false);
      setActionError("");
      return;
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const status = profile?.status;

  const initials = useMemo(() => {
    const source = String(profile?.name || profile?.username || "").trim();
    const parts = source.split(/\s+/).filter(Boolean);
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }, [profile]);

  const metrics = useMemo(
    () => [
      { label: "Points", value: profile?.totalPoints ?? 0, icon: "stars" },
      { label: "Current", value: `${profile?.currentStreak ?? 0}d`, icon: "local_fire_department" },
      { label: "Longest", value: `${profile?.longestStreak ?? 0}d`, icon: "whatshot" },
      { label: "Completed", value: profile?.tasksCompleted ?? 0, icon: "task_alt" },
      { label: "Friends", value: profile?.friendCount ?? 0, icon: "group" }
    ],
    [profile]
  );

  const runAction = async (fn) => {
    setActionLoading(true);
    setActionError("");
    try {
      await fn();
      await loadProfile();
      onRelationshipActionComplete?.();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Unable to update relationship."));
    } finally {
      setActionLoading(false);
    }
  };

  const renderRelationshipActions = () => {
    if (!profile || status === "SELF") return null;

    if (status === "NOT_FRIENDS") {
      return (
        <button
          type="button"
          disabled={actionLoading}
          onClick={() => runAction(() => sendFriendRequest(profile.userId))}
          className="bg-primary-container px-md py-xs rounded-lg font-label-sm text-label-sm font-bold text-on-primary-container hover:brightness-110 inline-flex items-center justify-center gap-xs disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          {actionLoading ? "Sending..." : "Add Friend"}
        </button>
      );
    }

    if (status === "REQUEST_SENT") {
      return (
        <div className="border border-outline-variant px-md py-xs rounded-lg font-label-sm text-label-sm font-semibold text-on-surface-variant opacity-80 inline-flex items-center justify-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          Pending
        </div>
      );
    }

    if (status === "REQUEST_RECEIVED") {
      const requestId = Number(profile.pendingRequestId);
      const canUseRequest = Number.isFinite(requestId) && requestId > 0;
      return (
        <div className="flex items-center justify-center gap-xs">
          <button
            type="button"
            disabled={actionLoading || !canUseRequest}
            onClick={() => runAction(() => acceptFriendRequest(requestId))}
            className="bg-primary-container px-md py-xs rounded-lg font-label-sm text-label-sm font-bold text-on-primary-container inline-flex items-center justify-center gap-1 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            {actionLoading ? "..." : "Accept"}
          </button>
          <button
            type="button"
            disabled={actionLoading || !canUseRequest}
            onClick={() => runAction(() => rejectFriendRequest(requestId))}
            className="border border-outline-variant px-md py-xs rounded-lg font-label-sm text-label-sm font-bold text-on-surface-variant inline-flex items-center justify-center gap-1 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
            Reject
          </button>
        </div>
      );
    }

    if (status === "FRIENDS") {
      return (
        <div className="border border-outline-variant px-md py-xs rounded-lg font-label-sm text-label-sm text-on-surface-variant inline-flex items-center justify-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">check</span>
          Friends
        </div>
      );
    }

    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(14,21,19,0.8)] backdrop-blur-[8px] p-md sm:p-xl">
      <button type="button" onClick={onClose} className="absolute inset-0" aria-label="Close public profile dialog" />

      <section
  className="
    relative
    w-full
    max-w-[580px]
    bg-surface-container
    border border-outline-variant
    rounded-xl
    shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
    overflow-hidden
    max-h-[85vh]
    overflow-y-auto
  "
>
        {loading ? <div className="h-[320px] bg-surface-container-high animate-pulse" /> : null}

        {!loading && error ? (
          <div className="m-md rounded-xl border border-error-container bg-error-container/20 p-md text-error text-label-sm">
            {error}
          </div>
        ) : null}

        {!loading && !error && profile ? (
          <div className="flex flex-col">
            <div className="px-md sm:px-lg pt-sm pb-xs flex justify-end">
              <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1" aria-label="Close dialog">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="px-md sm:px-lg pb-xs flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mb-xs border-4 border-surface shadow-lg">
                <span className="text-on-primary-container text-[22px] font-bold">{initials}</span>
              </div>
              <h1 className="font-h3 text-h3 text-on-surface">{profile.name || profile.username}</h1>
              <p className="font-label-sm text-label-sm text-outline mt-1">@{profile.username}</p>
              <p className="text-label-sm text-on-surface-variant mt-1">
                {profile.college || "-"} • {profile.branchCode || "-"} • Year {profile.year ?? "-"}
              </p>
            </div>

            <div className="px-md sm:px-lg py-xs">
              <p className="text-on-surface-variant text-label-sm text-center leading-relaxed">
                {profile.bio || "No bio added yet."}
              </p>
            </div>

            <div className="px-md sm:px-lg py-xs flex justify-center">
              {renderRelationshipActions()}
            </div>

            <div className="px-md sm:px-lg pt-xs pb-md">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-xs max-w-[340px] mx-auto">
                {metrics.map((metric) => (
                  <article key={metric.label} className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-xs py-xs flex flex-col gap-[2px]">
                    <span className="font-label-xs text-[10px] leading-tight text-outline uppercase tracking-wider">{metric.label}</span>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-label-sm font-semibold text-on-surface">{metric.value}</span>
                      <span className={`material-symbols-outlined text-[14px] ${metric.icon === "stars" ? "text-primary/40" : "text-on-surface-variant"}`}>
                        {metric.icon}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {actionError ? <p className="px-md sm:px-lg pb-sm text-error text-label-sm text-center">{actionError}</p> : null}
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default PublicProfileDialog;

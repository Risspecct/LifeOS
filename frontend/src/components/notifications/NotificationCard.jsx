import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { acceptFriendRequest, rejectFriendRequest } from "../../services/connectionsApi";
import { markAsRead } from "../../services/notificationService";

const timeAgo = (iso) => {
  try {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const sec = Math.round((now - then) / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.round(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.round(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const d = Math.round(hr / 24);
    return `${d}d ago`;
  } catch (e) {
    return "just now";
  }
};

const NotificationCard = ({ notification, onMarkRead, onOpenProfile }) => {
  const navigate = useNavigate();

  const handleAccept = async () => {
    const requestId = notification?.metadata?.requestId;
    if (!requestId) return;
    try {
      await acceptFriendRequest(requestId);
      await markAsRead(notification.id);
      if (onMarkRead) onMarkRead();
    } catch (e) {
      // ignore
    }
  };

  const handleReject = async () => {
    const requestId = notification?.metadata?.requestId;
    if (!requestId) return;
    try {
      await rejectFriendRequest(requestId);
      await markAsRead(notification.id);
      if (onMarkRead) onMarkRead();
    } catch (e) {
      // ignore
    }
  };

  const handleNavigate = async (path) => {
    try {
      await markAsRead(notification.id);
    } catch (e) {}
    if (onMarkRead) onMarkRead();
    navigate(path);
  };

  const type = notification.type || "SYSTEM";
  const isTaskNotification = type === "TASK_DUE_SOON" || type === "TASK_OVERDUE";
  const isFriendNotification = type === "FRIEND_REQUEST_RECEIVED" || type === "FRIEND_REQUEST_ACCEPTED";
  const isNavigableNotification = isTaskNotification || isFriendNotification || type === "STREAK_RISK" || type === "USER_INACTIVE";

  const isRead = Boolean(notification.isRead);

  const primaryText = notification.message || notification.title || 'Notification';
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const el = textRef.current;
      if (!el) return;
      setIsTruncated(el.scrollWidth > el.clientWidth);
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [primaryText]);

  const handleCardClick = async () => {
    if (!isNavigableNotification) return;

    try {
      await markAsRead(notification.id);
      if (onMarkRead) onMarkRead();
    } catch (e) {
      // ignore
    }

    if (isTaskNotification) {
      const taskId = notification?.metadata?.taskId;
      if (taskId) {
        navigate(`/tasks/${taskId}`);
        return;
      }
    }

    if (isFriendNotification) {
      const relatedUserId =
        type === "FRIEND_REQUEST_RECEIVED" ? notification?.metadata?.senderId : notification?.metadata?.friendId;
      if (relatedUserId) {
        onOpenProfile?.(relatedUserId);
      }
      return;
    }

    if (type === "STREAK_RISK" || type === "USER_INACTIVE") {
      navigate("/dashboard");
      return;
    }
  };

  const handleCardKeyDown = async (event) => {
    if (!isNavigableNotification) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      await handleCardClick();
    }
  };

  return (
    <div
      role={isNavigableNotification ? 'button' : undefined}
      tabIndex={isNavigableNotification ? 0 : undefined}
      onClick={isNavigableNotification ? handleCardClick : undefined}
      onKeyDown={isNavigableNotification ? handleCardKeyDown : undefined}
      className={`group relative w-full flex gap-3 px-4 py-3 border border-outline-variant rounded-lg ${!isRead ? 'bg-surface-container-high' : 'bg-surface-container'} ${isTaskNotification ? 'cursor-pointer hover:bg-surface-container-highest' : ''}`}
    >
      <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant flex-shrink-0 bg-surface-container flex items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px]">{(type === 'TASK_DUE_SOON' || type === 'TASK_OVERDUE') ? 'description' : type.includes('FRIEND') ? 'person' : (type === 'STREAK_RISK' ? 'local_fire_department' : 'notifications')}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 relative">
              {!isRead && <span className="inline-block w-2 h-2 rounded-full bg-primary mt-0.5" />}
              <div
                className="min-w-0"
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
              >
                <p ref={textRef} className="font-semibold text-on-surface text-sm leading-6 truncate">{primaryText}</p>
                {isTruncated && isTooltipVisible && (
                  <div className="pointer-events-none absolute left-0 top-full z-20 mt-1 w-[min(22rem,calc(100vw-2rem))] max-w-[22rem] rounded-md border border-outline-variant bg-surface py-2 px-3 text-xs leading-5 text-on-surface shadow-lg">
                    {primaryText}
                  </div>
                )}
              </div>
            </div>
          </div>
          <span className="text-label-xs text-on-surface-variant whitespace-nowrap mt-0.5 flex-shrink-0">{timeAgo(notification.createdAt || notification.updatedAt || new Date())}</span>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium uppercase text-on-surface-variant bg-on-surface-variant/6 px-2 py-0.5 rounded-full">{type.replace(/_/g, ' ')}</span>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            {type === 'FRIEND_REQUEST_RECEIVED' && (
              <>
                <button onClick={(event) => { event.stopPropagation(); handleAccept(); }} className="bg-primary-container text-on-primary-container px-3 py-1 rounded-md text-sm">Accept</button>
                <button onClick={(event) => { event.stopPropagation(); handleReject(); }} className="border border-outline-variant text-primary px-3 py-1 rounded-md text-sm">Reject</button>
              </>
            )}

            {(type === 'STREAK_RISK' || type === 'USER_INACTIVE') && (
              <button onClick={(event) => { event.stopPropagation(); handleNavigate('/dashboard'); }} className="bg-primary-container text-on-primary-container px-3 py-1 rounded-md text-sm">Go to Dashboard</button>
            )}

            {!isRead && (
              <button onClick={async (event) => { event.stopPropagation(); await markAsRead(notification.id); if (onMarkRead) onMarkRead(); }} className="text-on-surface-variant text-sm">Mark read</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;

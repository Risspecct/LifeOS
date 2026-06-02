import React, { useEffect, useRef, useState } from "react";
import { getNotifications, getUnreadCount, markAllAsRead, markAsRead } from "../../services/notificationService";
import NotificationCard from "./NotificationCard";
import PublicProfileDialog from "../profile/PublicProfileDialog";
import { useToast } from "../ui/ToastProvider";

const NotificationDrawer = ({ isOpen, onClose, onCloseRefresh }) => {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const emitNotificationsUpdated = (nextUnreadCount) => {
    window.dispatchEvent(
      new CustomEvent("notificationsUpdated", {
        detail: typeof nextUnreadCount === "number" ? { unreadCount: nextUnreadCount } : undefined,
      })
    );
  };

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [list, count] = await Promise.all([getNotifications(), getUnreadCount()]);
      setNotifications(list);
      setUnreadCount(count);
    } catch (err) {
      setError(err.message || "Unable to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      fetchAll();
      window.requestAnimationFrame(() => setIsVisible(true));
    } else if (isMounted) {
      setIsVisible(false);
      const timeout = window.setTimeout(() => setIsMounted(false), 220);
      return () => window.clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isMounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      closeButtonRef.current?.focus();
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMounted, onClose]);

  const markNotificationReadOptimistic = async (id) => {
    const currentNotification = notifications.find((notification) => notification.id === id);
    if (!currentNotification || currentNotification.isRead) {
      return true;
    }

    const previousUnreadCount = unreadCount;
    const nextUnreadCount = Math.max(0, previousUnreadCount - 1);

    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification))
    );
    setUnreadCount(nextUnreadCount);
    emitNotificationsUpdated(nextUnreadCount);

    try {
      await markAsRead(id);
      if (onCloseRefresh) onCloseRefresh();
      return true;
    } catch (err) {
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: false } : notification))
      );
      setUnreadCount(previousUnreadCount);
      emitNotificationsUpdated(previousUnreadCount);
      showToast(err.message || "Unable to mark notification as read", "error");
      return false;
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    const previousNotifications = notifications;
    const previousUnreadCount = unreadCount;

    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    setUnreadCount(0);
    emitNotificationsUpdated(0);

    try {
      await markAllAsRead();
      if (onCloseRefresh) onCloseRefresh();
    } catch (err) {
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
      emitNotificationsUpdated(previousUnreadCount);
      showToast(err.message || "Unable to mark all notifications as read", "error");
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <div className="fixed inset-0 z-[55] flex justify-end">
        <button
          type="button"
          className={`absolute inset-0 bg-slate-950/24 backdrop-blur-sm transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
          onClick={onClose}
          aria-label="Close inbox"
        />
        <aside
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          className={`relative h-full w-full sm:w-[420px] bg-surface-container-low border-l border-outline-variant shadow-2xl p-0 overflow-y-auto transition-transform duration-200 ${isVisible ? "translate-x-0" : "translate-x-full"}`}
        >
          <header className="flex items-center justify-between h-12 border-b border-outline-variant bg-surface-container-high/95 backdrop-blur-md shadow-sm px-3">
            <div className="flex items-center gap-2">
              <h2 className="font-h3 text-h3 text-on-surface">Inbox</h2>
              <span className="inline-flex items-center justify-center bg-primary-container text-on-primary-container text-[11px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="text-primary font-label-sm opacity-70 disabled:opacity-40 transition-all px-2 py-1"
                disabled={unreadCount === 0}
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </button>
              <button
                ref={closeButtonRef}
                className="hover:bg-surface-container-highest p-2 rounded-full transition-colors text-on-surface-variant"
                onClick={onClose}
                aria-label="Close inbox"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-md space-y-md">
                <div className="h-20 bg-surface-container border border-outline-variant rounded-xl animate-pulse" />
                <div className="h-20 bg-surface-container border border-outline-variant rounded-xl animate-pulse" />
                <div className="h-20 bg-surface-container border border-outline-variant rounded-xl animate-pulse" />
              </div>
            ) : error ? (
              <div className="p-md text-on-surface-variant">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-lg flex flex-col items-center justify-center text-center opacity-70">
                <span className="material-symbols-outlined text-[48px] mb-2">archive</span>
                <p className="text-label-sm">You are all caught up.</p>
                <p className="text-label-sm">New notifications will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkRead={() => markNotificationReadOptimistic(notification.id)}
                    onOpenProfile={async (userId) => {
                      const id = Number(userId);
                      if (!Number.isFinite(id) || id <= 0) return;
                      await markNotificationReadOptimistic(notification.id);
                      setSelectedUserId(id);
                      setIsProfileDialogOpen(true);
                    }}
                    onActionError={(message) => showToast(message, "error")}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
      <PublicProfileDialog
        isOpen={isProfileDialogOpen}
        userId={selectedUserId}
        onClose={() => setIsProfileDialogOpen(false)}
        onRelationshipActionComplete={fetchAll}
      />
    </>
  );
};

export default NotificationDrawer;

import React, { useEffect, useState, useRef } from "react";
import { getNotifications, getUnreadCount, markAsRead } from "../../services/notificationService";
import NotificationCard from "./NotificationCard";

const NotificationDrawer = ({ isOpen, onClose, onCloseRefresh }) => {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

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
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMounted, onClose]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      const ev = new CustomEvent("notificationsUpdated");
      window.dispatchEvent(ev);
      if (onCloseRefresh) onCloseRefresh();
    } catch (e) {
      // ignore for now
    }
  };

  if (!isMounted) return null;

  return (
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
            <span className="inline-flex items-center justify-center bg-primary-container text-on-primary-container text-[11px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-primary font-label-sm opacity-70 disabled:opacity-40 transition-all px-2 py-1" disabled title="Mark all read is not available">Mark all as read</button>
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
              <p className="text-label-sm">You're all caught up.</p>
              <p className="text-label-sm">New notifications will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <NotificationCard key={n.id} notification={n} onMarkRead={() => handleMarkRead(n.id)} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default NotificationDrawer;

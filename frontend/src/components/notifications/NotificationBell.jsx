import React, { useEffect, useState } from "react";
import NotificationDrawer from "./NotificationDrawer";
import { getUnreadCount } from "../../services/notificationService";
import {
  initUnreadCount,
  getUnreadCountLocal,
  incrementUnreadLocal,
  setUnreadCountLocal,
} from "../../utils/notificationClientCache";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
      initUnreadCount(count);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    refresh();

    const notificationHandler = (event) => {
      // a notification payload arrived — increment local counter for snappy UI
      const notification = event?.detail;
      if (notification) {
        const next = incrementUnreadLocal(1);
        setUnreadCount(next);
        return;
      }
    };

    const handler = (event) => {
      const nextUnreadCount = event?.detail?.unreadCount;
      if (typeof nextUnreadCount === "number") {
        setUnreadCount(nextUnreadCount);
        setUnreadCountLocal(nextUnreadCount);
        return;
      }
      // fallback: fetch authoritative count
      refresh();
    };

    window.addEventListener("notificationReceived", notificationHandler);
    window.addEventListener("notificationsUpdated", handler);
    const openHandler = () => setIsOpen(true);
    window.addEventListener("openNotifications", openHandler);

    return () => {
      window.removeEventListener("notificationReceived", notificationHandler);
      window.removeEventListener("notificationsUpdated", handler);
      window.removeEventListener("openNotifications", openHandler);
    };
  }, []);
  

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative text-on-surface-variant hover:text-primary transition-all"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[11px] font-bold rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      <NotificationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} onCloseRefresh={refresh} />
    </>
  );
};

export default NotificationBell;

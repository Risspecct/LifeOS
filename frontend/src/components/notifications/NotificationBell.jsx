import React, { useEffect, useState } from "react";
import NotificationDrawer from "./NotificationDrawer";
import { getUnreadCount } from "../../services/notificationService";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("notificationsUpdated", handler);
    return () => window.removeEventListener("notificationsUpdated", handler);
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

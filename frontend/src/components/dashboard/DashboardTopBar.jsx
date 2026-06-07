import { useEffect } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "../notifications/NotificationBell";
import { useToast } from "../ui/ToastProvider";
import { connectWebSocket, disconnectWebSocket } from "../../services/websocketService";
import { incrementUnreadLocal } from "../../utils/notificationClientCache";
import { AUTH_TOKEN_KEY } from "../../utils/constants";

const DashboardTopBar = () => {
  const isCollapsed = useSidebar();
  const { token: authToken } = useAuth();
  const token = authToken || localStorage.getItem(AUTH_TOKEN_KEY);
  const { showToast } = useToast();

  console.log("DashboardTopBar rendered", { authTokenPresent: Boolean(authToken), tokenPresent: Boolean(token) });

  useEffect(() => {
    console.log("DashboardTopBar useEffect", { authTokenPresent: Boolean(authToken), tokenPresent: Boolean(token) });

    if (!token) {
      console.log("No JWT found");
      return;
    }

    console.log("Calling connectWebSocket");

    connectWebSocket(token, (notification) => {
      try {
        window.dispatchEvent(new CustomEvent("notificationReceived", { detail: notification }));
        // Trigger unread count refresh (NotificationBell will call API when no detail provided)
        const nextUnread = incrementUnreadLocal(1);
        window.dispatchEvent(new CustomEvent("notificationsUpdated", { detail: { unreadCount: nextUnread } }));

        const toastTypes = ["FRIEND_REQUEST_RECEIVED", "FRIEND_REQUEST_ACCEPTED"];
        if (notification && toastTypes.includes(notification.type)) {
          const message = notification.message || notification.title || "New notification";
          showToast(
            message,
            "success",
            4500,
            {
              position: "top-right",
              onClick: () => window.dispatchEvent(new CustomEvent("openNotifications")),
            }
          );
        }
      } catch (err) {
        console.error("Error handling incoming notification", err);
      }
    });

    return () => {
      disconnectWebSocket();
    };
  }, [authToken, showToast]);

  return (
    <header className={`flex justify-between items-center px-md h-16 sticky top-0 z-40 bg-surface border-b border-outline-variant ml-0 ${isCollapsed ? 'md:ml-20 md:w-[calc(100%-5rem)]' : 'md:ml-64 md:w-[calc(100%-16rem)]'} transition-all duration-300 ease-in-out`}>
      <div className="flex items-center gap-md">
        <div className="relative focus-within:ring-2 focus-within:ring-primary rounded-xl">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="bg-surface-container border border-outline-variant rounded-xl pl-xl pr-md py-xs text-body-md focus:outline-none w-64 transition-all"
            placeholder="Search resources..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-md">
        <NotificationBell />
        <button className="text-on-surface-variant hover:text-primary transition-all">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="h-8 w-8 rounded-full border border-primary overflow-hidden bg-surface-container-high" />
      </div>
    </header>
  );
};

export default DashboardTopBar;
import { useEffect } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "../notifications/NotificationBell";
import { connectWebSocket, disconnectWebSocket } from "../../services/websocketService";
import { AUTH_TOKEN_KEY } from "../../utils/constants";

const DashboardTopBar = () => {
  const isCollapsed = useSidebar();
  const { token: authToken } = useAuth();
  const token = authToken || localStorage.getItem(AUTH_TOKEN_KEY);

  console.log("DashboardTopBar rendered", { authTokenPresent: Boolean(authToken), tokenPresent: Boolean(token) });

  useEffect(() => {
    console.log("DashboardTopBar useEffect", { authTokenPresent: Boolean(authToken), tokenPresent: Boolean(token) });

    if (!token) {
      console.log("No JWT found");
      return;
    }

    console.log("Calling connectWebSocket");

    connectWebSocket(token, (notification) => {
      console.log("Notification received:", notification);
    });

    return () => {
      disconnectWebSocket();
    };
  }, [authToken]);

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
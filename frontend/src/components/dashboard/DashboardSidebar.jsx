import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DashboardSidebar = ({ onLogout, activeView = "dashboard" }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem("lifeos_sidebar_collapsed") === "true");

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("lifeos_sidebar_collapsed", newState);
    window.dispatchEvent(new CustomEvent("sidebarStateChange", { detail: newState }));
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard", route: "/dashboard", available: true },
    { key: "tasks", label: "Tasks", icon: "checklist", route: "/tasks", available: true },
    { key: "activity", label: "Activity", icon: "monitoring", route: "/activity", available: true },
    { key: "connections", label: "Connections", icon: "group", route: "/connections", available: true },
    { key: "leaderboard", label: "Leaderboard", icon: "leaderboard", route: "/leaderboard", available: true },
    { key: "profile", label: "Profile", icon: "person", route: "/profile", available: true },
    { key: "settings", label: "Settings", icon: "settings", route: "/settings", available: true }
  ];

  return (
    <aside className={`h-full ${isCollapsed ? 'w-20' : 'w-64'} hidden md:flex flex-col fixed left-0 top-0 border-r border-outline-variant bg-gradient-to-b from-surface via-[#0c1412] to-[#09100e] ${isCollapsed ? 'p-sm items-center' : 'p-md'} z-50 transition-all duration-300 ease-in-out`}>
      <div className={`flex w-full mb-lg ${isCollapsed ? 'flex-col items-center gap-md mt-xs' : 'justify-between items-start'}`}>
        {!isCollapsed ? (
          <div className="overflow-hidden whitespace-nowrap transition-opacity duration-300">
            <h1 className="font-h3 text-h3 font-bold text-primary">LifeOS</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Deep Work Mode</p>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex flex-shrink-0 items-center justify-center border border-primary/30 shadow-[0_0_18px_rgba(87,241,219,0.14)]">
            <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className={`text-on-surface-variant hover:text-primary transition-colors flex-shrink-0 hover:bg-secondary-container/10 rounded-lg p-1 ${!isCollapsed ? 'mt-1' : ''}`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined text-[20px]">{isCollapsed ? "menu" : "menu_open"}</span>
        </button>
      </div>

      <nav className={`flex-1 w-full ${isCollapsed ? 'space-y-sm' : 'space-y-xs'}`}>
        {navItems.map((item) => {
          const isActive = item.key === activeView;
          const canNavigate = Boolean(item.available && item.route);
          const isGroupBreak = item.key === 'activity' || item.key === 'leaderboard';

          return (
            <button
              key={item.key}
              type="button"
              onClick={canNavigate ? () => navigate(item.route) : undefined}
              disabled={!canNavigate}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-[10px]' : 'gap-sm p-sm'} rounded-xl text-left transition-all duration-200 group relative ${isGroupBreak ? 'mb-4' : ''} ${
                isActive
                  ? "text-primary bg-primary/10 border border-primary/30 shadow-[0_0_18px_rgba(87,241,219,0.14)]"
                  : canNavigate
                    ? "text-on-surface-variant hover:text-on-surface hover:bg-secondary-container/10"
                    : "text-on-surface-variant/70 opacity-85"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {!isCollapsed && <span className="font-body-md text-body-md whitespace-nowrap overflow-hidden transition-opacity duration-300">{item.label}</span>}
              
              {isCollapsed && (
                <div className="absolute left-full ml-sm px-sm py-xs bg-surface-variant text-on-surface text-label-sm font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-outline-variant/30">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className={`mt-auto flex items-center justify-center gap-xs bg-primary text-on-primary py-sm rounded-xl font-bold active:scale-95 transition-all duration-200 shadow-[0_0_16px_rgba(87,241,219,0.18)] group relative ${isCollapsed ? 'w-10 h-10 px-0 rounded-xl' : 'w-full px-md'}`}
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
        {!isCollapsed && <span className="whitespace-nowrap overflow-hidden transition-opacity duration-300">Logout</span>}
        {isCollapsed && (
          <div className="absolute left-full ml-sm px-sm py-xs bg-error text-on-error text-label-sm font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            Logout
          </div>
        )}
      </button>
    </aside>
  );
};

export default DashboardSidebar;

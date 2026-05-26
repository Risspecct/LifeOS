import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard", route: "/dashboard", available: true },
  { key: "tasks", label: "Tasks", icon: "checklist", route: "/tasks", available: true },
  { key: "activity", label: "Activity", icon: "monitoring", route: "/activity", available: true },
  { key: "leaderboard", label: "Leaderboard", icon: "leaderboard", route: "/leaderboard", available: true },
  { key: "connections", label: "Connections", icon: "group", route: "/connections", available: true },
  { key: "profile", label: "Profile", icon: "person", route: "/profile", available: true },
  { key: "settings", label: "Settings", icon: "settings", route: "/settings", available: true }
];

const MobileBottomNav = ({ activeView }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface border-t border-outline-variant md:hidden overflow-x-auto">
      <div className="flex items-center min-w-max px-xs py-xs">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === activeView;
          return (
            <button
              key={item.key}
              type="button"
              disabled={!item.available}
              onClick={item.available ? () => navigate(item.route) : undefined}
              className={`flex flex-col items-center justify-center rounded-xl px-sm py-xs min-w-[74px] transition-all ${
                isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant"
              } ${!item.available ? "opacity-60" : ""}`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

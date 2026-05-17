import { useNavigate } from "react-router-dom";

const DashboardSidebar = ({ onLogout, activeView = "dashboard" }) => {
  const navigate = useNavigate();
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard", route: "/dashboard", available: true },
    { key: "tasks", label: "Tasks", icon: "checklist", route: "/tasks", available: true },
    { key: "profile", label: "Profile", icon: "person", route: "/profile", available: true },
    { key: "activity", label: "Activity", icon: "timeline", route: "/activity", available: true },
    { key: "leaderboard", label: "Leaderboard", icon: "leaderboard", route: null, available: false },
    { key: "notes", label: "Notes", icon: "notes", route: null, available: false },
    { key: "settings", label: "Settings", icon: "settings", route: null, available: false }
  ];

  return (
    <aside className="h-full w-64 hidden md:flex flex-col fixed left-0 top-0 border-r border-outline-variant bg-gradient-to-b from-surface via-[#0c1412] to-[#09100e] p-md z-50">
      <div className="mb-lg">
        <h1 className="font-h3 text-h3 font-bold text-primary">CampusOS</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant">Deep Work Mode</p>
      </div>

      <nav className="flex-1 space-y-xs">
        {navItems.map((item) => {
          const isActive = item.key === activeView;
          const canNavigate = Boolean(item.available && item.route);

          return (
            <button
              key={item.key}
              type="button"
              onClick={canNavigate ? () => navigate(item.route) : undefined}
              disabled={!canNavigate}
              className={`w-full flex items-center gap-sm p-sm rounded-xl text-left transition-all duration-200 ${
                isActive
                  ? "text-primary bg-primary/10 border border-primary/30 shadow-[0_0_18px_rgba(87,241,219,0.14)]"
                  : canNavigate
                    ? "text-on-surface-variant hover:text-on-surface hover:bg-secondary-container/10"
                    : "text-on-surface-variant/70 opacity-85"
              }`}
            >
              <span
                className="material-symbols-outlined text-[19px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-body-md text-body-md">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="mt-auto flex items-center justify-center gap-xs bg-primary text-on-primary py-sm px-md rounded-xl font-bold active:scale-95 duration-200 shadow-[0_0_16px_rgba(87,241,219,0.18)]"
      >
        <span className="material-symbols-outlined">logout</span>
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default DashboardSidebar;

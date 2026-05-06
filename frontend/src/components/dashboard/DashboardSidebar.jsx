const DashboardSidebar = ({ onLogout }) => {
  return (
    <aside className="h-full w-64 hidden md:flex flex-col fixed left-0 top-0 border-r border-outline-variant bg-surface p-md z-50">
      <div className="mb-xl">
        <h1 className="font-h3 text-h3 font-bold text-primary">CampusOS</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant">Deep Work Mode</p>
      </div>

      <nav className="flex-1 space-y-xs">
        <button className="w-full flex items-center gap-sm p-sm rounded-xl text-primary font-bold border-r-2 border-primary bg-transparent text-left">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-body-md text-body-md">Dashboard</span>
        </button>
        <button className="w-full flex items-center gap-sm p-sm rounded-xl text-on-surface-variant hover:bg-secondary-container/10 transition-colors bg-transparent text-left">
          <span className="material-symbols-outlined">checklist</span>
          <span className="font-body-md text-body-md">Tasks</span>
        </button>
        <button className="w-full flex items-center gap-sm p-sm rounded-xl text-on-surface-variant hover:bg-secondary-container/10 transition-colors bg-transparent text-left">
          <span className="material-symbols-outlined">person</span>
          <span className="font-body-md text-body-md">Profile</span>
        </button>
      </nav>

      <button
        onClick={onLogout}
        className="mt-auto flex items-center justify-center gap-xs bg-primary text-on-primary py-sm px-md rounded-xl font-bold active:scale-95 duration-200"
      >
        <span className="material-symbols-outlined">logout</span>
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default DashboardSidebar;

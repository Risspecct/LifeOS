const DashboardTopBar = () => {
  return (
    <header className="flex justify-between items-center px-md h-16 sticky top-0 z-40 bg-surface border-b border-outline-variant ml-0 md:ml-64 md:w-[calc(100%-16rem)]">
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
        <button className="text-on-surface-variant hover:text-primary transition-all">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-all">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="h-8 w-8 rounded-full border border-primary overflow-hidden bg-surface-container-high" />
      </div>
    </header>
  );
};

export default DashboardTopBar;

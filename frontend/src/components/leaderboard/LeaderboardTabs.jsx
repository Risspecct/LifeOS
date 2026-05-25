const LeaderboardTabs = ({ tabs, activeScope, onChangeScope }) => {
  return (
    <div className="inline-flex rounded-xl p-1 bg-surface-container border border-outline-variant">
      {tabs.map((tab) => {
        const isActive = tab.value === activeScope;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChangeScope(tab.value)}
            className={`px-md py-xs rounded-lg font-label-sm text-label-sm transition-colors ${
              isActive
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default LeaderboardTabs;

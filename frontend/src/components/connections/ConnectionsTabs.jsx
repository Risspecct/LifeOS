const ConnectionsTabs = ({ activeTab, onChangeTab }) => {
  const tabs = ["friends", "requests", "discover"];
  return (
    <div className="inline-flex rounded-xl p-1 bg-surface-container border border-outline-variant">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChangeTab(tab)}
            className={`px-md py-xs rounded-lg font-label-sm text-label-sm capitalize transition-colors ${
              isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default ConnectionsTabs;

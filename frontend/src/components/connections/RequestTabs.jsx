const RequestTabs = ({ activeTab, incomingCount, onChangeTab }) => {
  const tabs = [
    { key: "incoming", label: "Incoming", count: incomingCount },
    { key: "outgoing", label: "Outgoing", count: null }
  ];

  return (
    <div className="inline-flex rounded-xl p-1 bg-surface-container border border-outline-variant">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChangeTab(tab.key)}
            className={`px-md py-xs rounded-lg font-label-sm text-label-sm transition-colors inline-flex items-center gap-xs ${
              isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" ? (
              <span className="px-xs py-[2px] rounded-full text-[11px] bg-surface/60">{tab.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default RequestTabs;

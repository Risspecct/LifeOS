const AchievementWidget = () => {
  const items = [
    { icon: "workspace_premium", tone: "text-primary", title: "Top Performer" },
    { icon: "history_edu", tone: "text-tertiary", title: "Consistency King" },
    { icon: "lock", tone: "text-on-surface-variant/30", title: "Locked" }
  ];

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-md">
      <h4 className="font-label-sm font-bold text-on-surface-variant mb-md uppercase tracking-wider">Achievements</h4>
      <div className="flex flex-wrap gap-sm">
        {items.map((item) => (
          <div
            key={item.title}
            className="h-10 w-10 rounded-lg bg-surface-container-highest border border-outline-variant flex items-center justify-center"
            title={item.title}
          >
            <span className={`material-symbols-outlined ${item.tone}`}>{item.icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementWidget;

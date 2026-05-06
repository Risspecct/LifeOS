const QuickActionsSection = () => {
  const actions = [
    { label: "Add Task", icon: "add_circle" },
    { label: "View Tasks", icon: "view_list" },
    { label: "Update Profile", icon: "account_circle" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
      {actions.map((action) => (
        <button key={action.label} className="flex items-center justify-between p-md bg-surface-container border border-outline-variant rounded-xl hover:bg-secondary-container/10 transition-colors group">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">{action.icon}</span>
            <span className="font-label-sm">{action.label}</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsSection;

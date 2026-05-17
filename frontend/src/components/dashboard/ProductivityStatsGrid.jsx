const ProductivityStatsGrid = ({ pendingCount, completedCount, overdueCount }) => {
  const items = [
    {
      label: "Pending Tasks",
      value: pendingCount,
      icon: "schedule",
      tone: "text-amber-300 border-amber-300/30 bg-amber-400/10"
    },
    {
      label: "Completed Tasks",
      value: completedCount,
      icon: "task_alt",
      tone: "text-primary border-primary/30 bg-primary/10"
    },
    {
      label: "Overdue Tasks",
      value: overdueCount,
      icon: "warning",
      tone: "text-rose-300 border-rose-300/30 bg-rose-400/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
      {items.map((item) => (
        <div key={item.label} className="bg-surface-container border border-outline-variant rounded-xl p-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-on-surface-variant font-label-sm">{item.label}</p>
              <p className="text-h2 font-h2 mt-1">{item.value}</p>
            </div>
            <span className={`material-symbols-outlined text-[18px] px-2 py-1 rounded-lg border ${item.tone}`}>
              {item.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductivityStatsGrid;

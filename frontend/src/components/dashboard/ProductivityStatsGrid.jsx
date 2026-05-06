const ProductivityStatsGrid = ({ pendingCount, completedCount, totalCount }) => {
  const completedRatio = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <div className="bg-surface-container border border-outline-variant rounded-xl p-md">
        <div className="flex justify-between items-start mb-md">
          <div>
            <p className="text-on-surface-variant font-label-sm">Total Tasks Pending</p>
            <p className="text-h1 font-h1 font-bold">{pendingCount}</p>
          </div>
          <span className="material-symbols-outlined text-primary">stacks</span>
        </div>
        <div className="h-1 bg-outline-variant rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${Math.max(8, 100 - completedRatio)}%` }} />
        </div>
        <p className="text-[10px] mt-xs text-on-surface-variant font-medium">
          {completedCount} OF {totalCount} COMPLETED
        </p>
      </div>

      <div className="bg-surface-container border border-outline-variant rounded-xl p-md">
        <div className="flex justify-between items-start mb-sm">
          <p className="text-on-surface-variant font-label-sm">Workload Intensity</p>
          <span className="material-symbols-outlined text-primary">monitoring</span>
        </div>
        <div className="flex items-end gap-1 h-12">
          {[30, 50, 80, 60, 90, 40, 20].map((height, index) => (
            <div
              key={index}
              className={`flex-1 rounded-t-sm ${height >= 60 ? "bg-primary" : "bg-primary-container/20"}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">
          <span>Mon</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
};

export default ProductivityStatsGrid;

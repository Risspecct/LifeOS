const DashboardWelcomeHero = ({ username, profile, focusScore, highPriorityCount }) => {
  return (
    <div className="glass-glow relative overflow-hidden bg-surface-container border border-outline-variant rounded-xl p-lg flex flex-col md:flex-row items-center gap-lg">
      <div className="flex-1 space-y-sm">
        <div className="flex items-center gap-sm">
          <div className="h-12 w-12 rounded-full border-2 border-primary p-0.5 bg-surface-container-high" />
          <h2 className="font-h2 text-h2">Welcome, {profile?.name || username || "Student"}</h2>
        </div>

        <p className="text-on-surface-variant font-body-md max-w-md">
          Your focus score is sitting at <span className="text-primary font-bold">{focusScore}%</span>. You&apos;ve cleared most blockers for the day.
        </p>

        <div className="flex gap-sm pt-xs flex-wrap">
          <span className="font-label-sm text-label-sm bg-primary-container/20 text-primary px-sm py-1 rounded-full flex items-center gap-xs">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            Peak Performance
          </span>
          <span className="font-label-sm text-label-sm bg-tertiary-container/10 text-tertiary px-sm py-1 rounded-full flex items-center gap-xs">
            <span className="material-symbols-outlined text-[14px]">target</span>
            {highPriorityCount} High Priority
          </span>
        </div>
      </div>

      <div className="w-32 h-32 relative">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3" />
          <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${focusScore}, 100`} strokeLinecap="round" strokeWidth="3" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-h3 text-h3">{focusScore}</span>
          <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Score</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcomeHero;

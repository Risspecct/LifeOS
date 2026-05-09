const StudyStreakWidget = () => {
  return (
    <div className="bg-primary text-on-primary rounded-xl p-md shadow-lg shadow-primary/10 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-sm mb-xs">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_fire_department
          </span>
          <span className="font-label-sm font-bold uppercase tracking-wider">Study Streak</span>
        </div>
        <p className="font-h3 text-h3 leading-none">12 Days</p>
        <p className="text-[12px] opacity-80 mt-1">Consistency is your superpower.</p>
      </div>
      <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12">
        local_fire_department
      </span>
    </div>
  );
};

export default StudyStreakWidget;

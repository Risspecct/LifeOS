import React from 'react';

const ActivityHero = ({ summary }) => {
    if (!summary) return null;
    
    return (
        <section className="bg-surface-container/40 backdrop-blur-md border border-outline-variant rounded-2xl p-sm px-md flex flex-col lg:flex-row items-center gap-md">
            <div className="flex-1">
                <h1 className="font-h3 text-h3 text-on-surface">
                    Momentum Snapshot 
                    <span className="text-primary font-normal text-body-md ml-2">{summary.momentum || "Moderate"}</span>
                </h1>
            </div>
            <div className="flex flex-wrap gap-sm justify-end">
                <div className="bg-surface-container/50 border border-outline-variant rounded-xl p-3 min-w-[120px]">
                    <p className="text-label-xs text-on-surface-variant mb-1">Completed</p>
                    <p className="text-body-lg font-bold text-on-surface">{summary.completedTasks ?? 0}</p>
                </div>
                <div className="bg-surface-container/50 border border-outline-variant rounded-xl p-3 min-w-[120px]">
                    <p className="text-label-xs text-on-surface-variant mb-1">Current Streak</p>
                    <p className="text-body-lg font-bold text-on-surface">{summary.currentStreak ?? 0} <span className="text-xs font-medium text-primary">days</span></p>
                </div>
                <div className="bg-surface-container/50 border border-outline-variant rounded-xl p-3 min-w-[120px]">
                    <p className="text-label-xs text-on-surface-variant mb-1">Overdue</p>
                    <p className="text-body-lg font-bold text-error">{summary.overdueTasks ?? 0} <span className="text-xs font-medium opacity-50">tasks</span></p>
                </div>
                <div className="bg-surface-container/50 border border-outline-variant rounded-xl p-3 min-w-[120px]">
                    <p className="text-label-xs text-on-surface-variant mb-1">Top Focus</p>
                    <p className="text-body-lg font-bold text-primary truncate max-w-[100px]">{summary.topFocus || "None"}</p>
                </div>
            </div>
        </section>
    );
};

export default ActivityHero;

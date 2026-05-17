import React from 'react';

const ActivityTimeline = ({ timelineData = [] }) => {
    
    if (!timelineData || timelineData.length === 0) {
        return (
            <section className="bg-surface-container/40 backdrop-blur-md border border-outline-variant rounded-2xl p-md">
                <div className="flex justify-between items-center mb-lg">
                    <h3 className="font-h3 text-h3 text-on-surface">Activity Timeline</h3>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-2">history</span>
                    <h4 className="font-bold text-on-surface text-lg">No recent activity yet</h4>
                    <p className="text-on-surface-variant text-sm mt-1">Complete tasks to build your activity history.</p>
                </div>
            </section>
        );
    }

    const groupTimelineData = (data) => {
        const groups = { Today: [], Yesterday: [], 'Earlier This Week': [] };
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        data.forEach(activity => {
            if (!activity.createdAt) return;
            const actDate = new Date(activity.createdAt);
            actDate.setHours(0, 0, 0, 0);
            
            if (actDate.getTime() === today.getTime()) {
                groups.Today.push(activity);
            } else if (actDate.getTime() === yesterday.getTime()) {
                groups.Yesterday.push(activity);
            } else if (actDate >= weekAgo) {
                groups['Earlier This Week'].push(activity);
            }
        });
        
        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    };

    const groupedData = groupTimelineData(timelineData);

    const getGroupIcon = (title) => {
        if (title === 'Today') return 'bolt';
        if (title === 'Yesterday') return 'history';
        return 'event_note';
    };

    const getGroupColor = (title) => {
        if (title === 'Today') return 'bg-primary text-on-primary shadow-[0_0_15px_rgba(87,241,219,0.3)]';
        return 'bg-surface-variant text-on-surface-variant border border-outline-variant';
    };

    return (
        <section className="bg-surface-container/40 backdrop-blur-md border border-outline-variant rounded-2xl p-md">
            <div className="flex justify-between items-center mb-lg">
                <h3 className="font-h3 text-h3 text-on-surface">Activity Timeline</h3>
                <div className="flex items-center gap-2 text-label-sm text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant">
                    <span className="material-symbols-outlined text-sm">filter_list</span>
                    <span>All Activities</span>
                </div>
            </div>
            
            <div className="space-y-xl relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-0.5 before:bg-outline-variant/30">
                {groupedData.map(([groupName, items], gIdx) => (
                    <div key={groupName} className="relative pl-12">
                        <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center z-10 ${getGroupColor(groupName)}`}>
                            <span className="material-symbols-outlined">{getGroupIcon(groupName)}</span>
                        </div>
                        <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-md">{groupName}</h4>
                        
                        <div className="space-y-sm">
                            {items.map((activity, idx) => (
                                <div key={activity.id || idx} className="flex flex-col sm:flex-row justify-between sm:items-center p-md bg-surface-container/60 hover:bg-surface-container-high rounded-xl border border-outline-variant transition-colors group gap-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="text-center min-w-[60px]">
                                            <p className={`font-bold text-lg ${gIdx === 0 && idx === 0 ? 'text-primary' : 'text-secondary'}`}>
                                                +{activity.points || 10}
                                            </p>
                                            <p className="text-[8px] uppercase text-on-surface-variant font-bold">Focus Score</p>
                                        </div>
                                        <div className="h-8 w-px bg-outline-variant/50"></div>
                                        <div>
                                            <p className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                                                {activity.description || 'Activity logged'}
                                            </p>
                                            <p className="font-label-xs text-label-xs text-on-surface-variant">
                                                {activity.activityType} • {new Date(activity.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>
                                    {activity.points >= 20 ? (
                                        <span className="self-start sm:self-auto bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-widest border border-primary/20">High Impact</span>
                                    ) : (
                                        <span className="hidden sm:block material-symbols-outlined text-on-surface-variant/50 text-xl">check_circle</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ActivityTimeline;

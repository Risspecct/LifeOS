import React from 'react';

const WeeklyTrendChart = ({ trendData = [] }) => {
    const displayData = trendData && trendData.length > 0 ? trendData : [
        { day: 'Mon', score: 0 }, { day: 'Tue', score: 0 }, { day: 'Wed', score: 0 },
        { day: 'Thu', score: 0 }, { day: 'Fri', score: 0 }, { day: 'Sat', score: 0 }, { day: 'Sun', score: 0 }
    ];

    return (
        <section className="bg-surface-container/40 backdrop-blur-md border border-outline-variant rounded-2xl p-md">
            <div className="flex justify-between items-center mb-md">
                <h3 className="font-h3 text-h3 text-on-surface">Weekly Focus Scores</h3>
                <button className="text-primary text-xs hover:underline flex items-center gap-1">Details <span className="material-symbols-outlined text-sm">open_in_new</span></button>
            </div>
            <div className="flex items-end justify-between h-48 gap-xs px-2">
                {displayData.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 flex-1 group h-full justify-end">
                        <div className="w-full bg-surface-container-highest rounded-full relative overflow-hidden" style={{ height: '100%' }}>
                            <div 
                                className="absolute bottom-0 w-full rounded-t-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:brightness-110" 
                                style={{ 
                                    height: `${item.score > 100 ? 100 : item.score}%`, 
                                    backgroundColor: `rgba(87, 241, 219, ${item.score > 80 ? 1 : item.score > 60 ? 0.9 : item.score > 40 ? 0.8 : item.score > 20 ? 0.6 : 0.4})`,
                                    boxShadow: '0 -4px 12px rgba(87,241,219,0.2)' 
                                }}
                            ></div>
                        </div>
                        <span className={`font-label-xs text-label-xs text-on-surface-variant group-hover:text-primary transition-colors ${item.score > 80 ? 'font-bold' : ''}`}>
                            {item.day}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WeeklyTrendChart;

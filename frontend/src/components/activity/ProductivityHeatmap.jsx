import React, { useEffect, useMemo, useState } from 'react';

const ProductivityHeatmap = ({ heatmapData = [], summary = {} }) => {
    // Responsive window sizing
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const visibleCount = windowWidth < 640 ? 2 : windowWidth < 1024 ? 3 : 4;

    // Elegant, muted color palette for the heatmap
    const colors = [
        'bg-[#1a211f]',      // No activity - muted slate
        'bg-[#23423f]',      // Low - soft desaturated teal
        'bg-[#2d7367]',      // Medium - muted cyan-teal
        'bg-[#37a694]',      // High - slightly brighter teal
        'bg-[#3da594]'       // Peak - strongest but still restrained accent
    ];
    
    // Process real data
    const { monthsList, activeCount } = useMemo(() => {
        const today = new Date();
        const dataMap = {};
        
        let sum = 0;
        let active = 0;
        let max = 0;

        if (heatmapData && heatmapData.length > 0) {
            heatmapData.forEach(item => {
                if (item.date) {
                    const dateStr = typeof item.date === 'string' ? item.date.split('T')[0] : item.date;
                    const score = item.score || 0;
                    dataMap[dateStr] = score;
                    if (score > 0) {
                        sum += score;
                        active++;
                        if (score > max) max = score;
                    }
                }
            });
        }

        const maxScore = max > 0 ? max : 1;
        
        // Generate exact months
        const mList = [];
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Get the last 6 months (including current)
        for (let m = 5; m >= 0; m--) {
            const targetDate = new Date(today.getFullYear(), today.getMonth() - m, 1);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth();
            
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            const monthWeeks = [];
            let currentWeek = [];
            
            for (let d = 1; d <= daysInMonth; d++) {
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const score = dataMap[dateString] || 0;
                
                let level = 0;
                if (score > 0) {
                    const normalized = score / maxScore;
                    if (normalized <= 0.25) level = 1;
                    else if (normalized <= 0.5) level = 2;
                    else if (normalized <= 0.75) level = 3;
                    else level = 4;
                }
                
                const dateObj = new Date(year, month, d);
                
                currentWeek.push({
                    date: dateString,
                    level,
                    score,
                    dateObj,
                    isToday: dateString === todayStr,
                    formattedDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                });
                
                if (currentWeek.length === 7) {
                    monthWeeks.push(currentWeek);
                    currentWeek = [];
                }
            }
            // push the last week if it has days
            if (currentWeek.length > 0) {
                monthWeeks.push(currentWeek);
            }
            
            mList.push({
                key: `${year}-${month}`,
                label: targetDate.toLocaleDateString('en-US', { month: 'short' }),
                year: year,
                weeks: monthWeeks
            });
        }

        return {
            monthsList: mList,
            activeCount: active
        };
    }, [heatmapData]);

    const [endIndex, setEndIndex] = useState(null);

    // Default to the most recent window
    useEffect(() => {
        if (endIndex === null && monthsList.length > 0) {
            setEndIndex(monthsList.length);
        }
    }, [monthsList, endIndex]);

    const safeEndIndex = endIndex ?? monthsList.length;
    const startIndex = Math.max(0, safeEndIndex - visibleCount);
    const visibleMonths = monthsList.slice(startIndex, safeEndIndex);
    
    const canGoBack = startIndex > 0;
    const canGoForward = safeEndIndex < monthsList.length;

    const handlePrev = () => {
        if (canGoBack) setEndIndex(Math.max(visibleCount, safeEndIndex - 1));
    };

    const handleNext = () => {
        if (canGoForward) setEndIndex(Math.min(monthsList.length, safeEndIndex + 1));
    };

    return (
        <section className="bg-surface-container/40 backdrop-blur-md border border-outline-variant rounded-2xl p-md lg:p-xl space-y-lg overflow-hidden">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start lg:items-center gap-4">
                <div>
                    <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                        Activity Impact
                        <span className="material-symbols-outlined text-primary text-xl opacity-70">info</span>
                    </h3>
                    <p className="text-sm text-on-surface-variant mt-1">Measuring cognitive load and consistency over time</p>
                </div>
                
                <div className="flex items-center gap-md self-start md:self-auto shrink-0">
                    {/* Subtle Legend */}
                    <div className="flex items-center gap-2 px-2 opacity-70">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Low</span>
                        <div className="flex gap-1.5">
                            <div className="w-[12px] h-[12px] rounded-[3px] bg-[#1a211f]"></div>
                            <div className="w-[12px] h-[12px] rounded-[3px] bg-[#23423f]"></div>
                            <div className="w-[12px] h-[12px] rounded-[3px] bg-[#2d7367]"></div>
                            <div className="w-[12px] h-[12px] rounded-[3px] bg-[#37a694]"></div>
                            <div className="w-[12px] h-[12px] rounded-[3px] bg-[#3da594]"></div>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">High</span>
                    </div>

                    {/* Window Navigation */}
                    <div className="flex items-center gap-1 border border-outline-variant rounded-lg p-1 bg-surface-container/50">
                        <button 
                            onClick={handlePrev}
                            disabled={!canGoBack}
                            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-variant disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
                            title="Previous months"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button 
                            onClick={handleNext}
                            disabled={!canGoForward}
                            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-variant disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
                            title="Next months"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col xl:flex-row gap-xl items-start">
                {/* Segmented Timeline Viewport */}
                <div className="flex-1 w-full min-h-[140px] flex gap-2 lg:gap-3 transition-all duration-300">
                    {visibleMonths.map((month) => {
                        const isCurrentMonth = month.key === monthsList[monthsList.length - 1].key;
                        
                        return (
                            <div key={month.key} className="flex flex-col gap-2 animate-fade-in">
                                <div className="text-xs font-bold text-on-surface-variant tracking-wider flex items-center gap-2 border-b border-outline-variant/30 pb-1">
                                    {month.label} <span className="opacity-50 font-normal">{month.year}</span>
                                    {isCurrentMonth && <span className="w-2 h-2 rounded-full bg-primary/60 ml-1"></span>}
                                </div>
                                <div className="flex gap-2">
                                    {month.weeks.map((week, i) => (
                                        <div key={i} className="grid grid-rows-7 gap-1 lg:gap-1.5">
                                            {week.map((day, j) => (
                                                <div 
                                                    key={j} 
                                                    className={`w-[14px] h-[14px] lg:w-[16px] lg:h-[16px] rounded-[3px] lg:rounded-[4px] transition-all duration-200 cursor-pointer ${
                                                        day.level > 0 ? 'hover:-translate-y-[1px] hover:shadow-sm hover:ring-1 hover:ring-on-surface/40' : ''
                                                    } ${
                                                        day.isToday ? 'ring-1 ring-primary ring-offset-1 ring-offset-surface' : ''
                                                    } ${colors[day.level]}`}
                                                    title={`${day.formattedDate}: ${day.score > 0 ? day.score + ' Impact' : 'No Activity'}`}
                                                ></div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Larger Behavioral Analytics */}
                <div className="w-full xl:w-64 flex flex-row xl:flex-col gap-4 shrink-0 flex-wrap">
                    <div className="bg-surface-container/30 rounded-xl p-4 border-l-4 border-primary/60 flex-1 min-w-[140px] shadow-sm">
                        <div className="text-xs uppercase font-bold text-on-surface-variant mb-2 tracking-wider">Peak Focus</div>
                        <div className="text-lg font-bold text-primary truncate">{summary?.topFocus || 'General'}</div>
                    </div>
                    <div className="bg-surface-container/30 rounded-xl p-4 border-l-4 border-outline flex-1 min-w-[140px] shadow-sm">
                        <div className="text-xs uppercase font-bold text-on-surface-variant mb-2 tracking-wider">Momentum</div>
                        <div className="text-lg font-medium text-on-surface truncate">{summary?.momentum || 'Balanced'}</div>
                    </div>
                    <div className="bg-surface-container/30 rounded-xl p-4 border-l-4 border-outline flex-1 min-w-[140px] shadow-sm">
                        <div className="text-xs uppercase font-bold text-on-surface-variant mb-2 tracking-wider">Active Days</div>
                        <div className="text-lg font-medium text-on-surface truncate">{activeCount} Days</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductivityHeatmap;

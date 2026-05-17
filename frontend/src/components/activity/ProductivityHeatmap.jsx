import React, { useMemo } from 'react';

const ProductivityHeatmap = ({ heatmapData = [], summary = {} }) => {
    // Elegant, muted color palette for the heatmap
    const colors = [
        'bg-[#1a211f]',      // No activity - muted slate
        'bg-[#23423f]',      // Low - soft desaturated teal
        'bg-[#2d7367]',      // Medium - muted cyan-teal
        'bg-[#37a694]',      // High - slightly brighter teal
        'bg-[#3da594]'       // Peak - strongest but still restrained accent
    ];
    
    // Process real data
    const { weeks, activeCount } = useMemo(() => {
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
        
        // Generate last 182 days (26 weeks x 7 days)
        const totalDays = 26 * 7;
        const daysArray = [];
        for (let d = totalDays - 1; d >= 0; d--) {
            const date = new Date(today);
            date.setDate(date.getDate() - d);
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            
            const score = dataMap[dateString] || 0;
            let level = 0;
            if (score > 0) {
                const normalized = score / maxScore;
                if (normalized <= 0.25) level = 1;
                else if (normalized <= 0.5) level = 2;
                else if (normalized <= 0.75) level = 3;
                else level = 4;
            }
            
            daysArray.push({ 
                date: dateString, 
                level, 
                score,
                formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            });
        }

        const weeksArr = [];
        for (let i = 0; i < 26; i++) {
            weeksArr.push(daysArray.slice(i * 7, (i + 1) * 7));
        }

        return {
            weeks: weeksArr,
            activeCount: active
        };
    }, [heatmapData]);

    return (
        <section className="bg-surface-container/40 backdrop-blur-md border border-outline-variant rounded-2xl p-xl space-y-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                        Activity Impact
                        <span className="material-symbols-outlined text-primary text-xl opacity-70">info</span>
                    </h3>
                    <p className="text-sm text-on-surface-variant mt-1">Measuring cognitive load and consistency across 6 months</p>
                </div>
                
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
            </div>
            
            <div className="flex flex-col lg:flex-row gap-xl items-start">
                <div className="flex-1 relative overflow-x-auto pb-4 pt-4 custom-scrollbar w-full">
                    {/* Months approximation (just illustrative headers) */}
                    <div className="flex gap-[75px] mb-3 px-2 text-xs text-on-surface-variant uppercase font-bold tracking-widest opacity-80">
                        <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                    </div>
                    <div className="flex gap-2 min-w-max">
                        {weeks.map((week, i) => (
                            <div key={i} className="grid grid-rows-7 gap-2">
                                {week.map((day, j) => (
                                    <div 
                                        key={j} 
                                        className={`w-[16px] h-[16px] rounded-[4px] transition-all duration-200 cursor-pointer ${day.level > 0 ? 'hover:-translate-y-[1px] hover:shadow-sm hover:ring-1 hover:ring-on-surface/40' : ''} ${colors[day.level]}`}
                                        title={`${day.formattedDate}: ${day.score > 0 ? day.score + ' Impact' : 'No Activity'}`}
                                    ></div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Larger Behavioral Analytics */}
                <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-5 lg:pt-10 shrink-0 flex-wrap">
                    <div className="bg-surface-container/20 rounded-xl p-4 border-l-4 border-primary/60 min-w-[140px] shadow-sm">
                        <div className="text-xs uppercase font-bold text-on-surface-variant mb-2 tracking-wider">Peak Focus</div>
                        <div className="text-lg font-bold text-primary">{summary?.topFocus || 'General'}</div>
                    </div>
                    <div className="bg-surface-container/20 rounded-xl p-4 border-l-4 border-outline min-w-[140px] shadow-sm">
                        <div className="text-xs uppercase font-bold text-on-surface-variant mb-2 tracking-wider">Momentum</div>
                        <div className="text-lg font-medium text-on-surface">{summary?.momentum || 'Balanced'}</div>
                    </div>
                    <div className="bg-surface-container/20 rounded-xl p-4 border-l-4 border-outline min-w-[140px] shadow-sm">
                        <div className="text-xs uppercase font-bold text-on-surface-variant mb-2 tracking-wider">Active Days</div>
                        <div className="text-lg font-medium text-on-surface">{activeCount} Days</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductivityHeatmap;

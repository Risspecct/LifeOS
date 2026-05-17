import React from 'react';

const ProductivityHeatmap = ({ heatmapData = [] }) => {
    // Elegant, muted color palette for the heatmap
    // 0: dark muted slate (no activity)
    // 1: soft desaturated teal (low)
    // 2: muted cyan-green (medium)
    // 3: slightly brighter teal (high)
    // 4: elegant accent highlight (peak)
    const colors = [
        'bg-[#1a211f]',      // No activity - muted slate
        'bg-[#23423f]',      // Low - soft desaturated teal
        'bg-[#2d7367]',      // Medium - muted cyan-green
        'bg-[#37a694]',      // High - slightly brighter teal
        'bg-[#57f1db]'       // Peak - accent highlight (used sparingly)
    ];
    
    // Create weeks (26 columns x 7 days)
    const weeks = [];
    for (let i = 0; i < 26; i++) {
        const days = [];
        for (let j = 0; j < 7; j++) {
            // Pick data or a mock pattern if no data
            let level = 0;
            if (heatmapData && heatmapData.length > 0) {
                const dataIndex = (i * 7 + j) % heatmapData.length;
                const score = heatmapData[dataIndex]?.score || 0;
                level = score > 80 ? 4 : score > 50 ? 3 : score > 20 ? 2 : score > 0 ? 1 : 0;
            } else {
                // Mock patterns from original HTML
                const patterns = [
                    [0,1,2,3,4,3,2], [4,4,3,2,1,0,0], [1,2,3,2,1,2,3], [0,0,0,1,2,1,0],
                    [3,3,4,4,3,3,2], [1,1,0,0,1,2,3], [4,4,4,3,2,1,0], [2,2,3,3,4,4,3]
                ];
                const pattern = patterns[i % patterns.length];
                level = pattern[j];
            }
            // Mute the overall level slightly to prevent too much "peak" neon
            if (level === 4 && Math.random() > 0.3) level = 3;
            days.push(level);
        }
        weeks.push(days);
    }

    return (
        <section className="bg-surface-container/40 backdrop-blur-md border border-outline-variant rounded-2xl p-md space-y-md">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                        Activity Impact
                        <span className="material-symbols-outlined text-primary text-xl opacity-70">info</span>
                    </h3>
                    <p className="text-label-sm text-on-surface-variant">Measuring cognitive load and consistency across 6 months</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-container/30 p-2 px-4 rounded-full border border-outline-variant/50">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Low</span>
                    <div className="flex gap-1.5">
                        <div className="w-[12px] h-[12px] rounded-[3px] bg-[#1a211f]"></div>
                        <div className="w-[12px] h-[12px] rounded-[3px] bg-[#23423f]"></div>
                        <div className="w-[12px] h-[12px] rounded-[3px] bg-[#2d7367]"></div>
                        <div className="w-[12px] h-[12px] rounded-[3px] bg-[#37a694]"></div>
                        <div className="w-[12px] h-[12px] rounded-[3px] bg-[#57f1db]"></div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">High Impact</span>
                </div>
            </div>
            
            <div className="relative overflow-x-auto pb-4 pt-6 custom-scrollbar">
                <div className="flex gap-[45px] mb-2 px-2 text-[10px] text-on-surface-variant uppercase font-bold tracking-widest opacity-80">
                    <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                </div>
                <div className="flex gap-1.5 min-w-max">
                    {weeks.map((week, i) => (
                        <div key={i} className="grid grid-rows-7 gap-1.5">
                            {week.map((level, j) => (
                                <div 
                                    key={j} 
                                    className={`w-[12px] h-[12px] rounded-[3px] transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${colors[level]}`}
                                    style={{ 
                                        opacity: level === 0 ? 0.7 : 1
                                    }}
                                    title={`Activity Level ${level}`}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductivityHeatmap;

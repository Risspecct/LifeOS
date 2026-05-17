import React, { useMemo } from 'react';

const FocusDistribution = ({ distributionData = [] }) => {
    
    const processedData = useMemo(() => {
        if (!distributionData || distributionData.length === 0) return [];
        
        const sorted = [...distributionData].sort((a, b) => b.percentage - a.percentage);
        
        const top4 = sorted.slice(0, 4).map(item => ({
            label: item.label,
            percentage: Number(item.percentage.toFixed(1)),
            isOthers: false
        }));

        if (sorted.length > 4) {
            const othersTotal = sorted.slice(4).reduce((sum, item) => sum + item.percentage, 0);
            top4.push({
                label: 'Others',
                percentage: Number(othersTotal.toFixed(1)),
                isOthers: true
            });
        }
        
        return top4;
    }, [distributionData]);

    if (processedData.length === 0) {
        return (
            <section className="bg-surface-container/40 backdrop-blur-md border border-outline-variant rounded-2xl p-md flex flex-col items-center justify-center min-h-[200px]">
                <h3 className="font-h3 text-h3 text-on-surface self-start absolute top-4 left-4">Effort Allocation</h3>
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-2 mt-4">pie_chart</span>
                <p className="text-on-surface-variant text-sm text-center">No focus distribution data yet.</p>
            </section>
        );
    }

    return (
        <section className="bg-surface-container/40 backdrop-blur-md border border-outline-variant rounded-2xl p-md">
            <h3 className="font-h3 text-h3 text-on-surface mb-md">Effort Allocation</h3>
            <div className="space-y-md">
                {processedData.map((item, idx) => {
                    const isOthers = item.isOthers;
                    return (
                        <div key={idx} className="space-y-1 group">
                            <div className="flex justify-between font-label-sm text-label-sm">
                                <span className={`transition-colors ${isOthers ? 'text-on-surface-variant' : 'text-on-surface group-hover:text-primary'}`}>{item.label}</span>
                                <span className={isOthers ? 'text-on-surface-variant' : 'text-primary font-bold'}>{item.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ 
                                        width: `${item.percentage}%`,
                                        backgroundColor: isOthers ? '#4a5568' : `rgba(87, 241, 219, ${1 - (idx * 0.2)})`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FocusDistribution;

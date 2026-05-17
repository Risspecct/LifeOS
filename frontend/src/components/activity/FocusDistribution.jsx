import React from 'react';

const FocusDistribution = ({ distributionData = [] }) => {
    
    if (!distributionData || distributionData.length === 0) {
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
                {distributionData.map((item, idx) => (
                    <div key={idx} className="space-y-1 group">
                        <div className="flex justify-between font-label-sm text-label-sm">
                            <span className="text-on-surface group-hover:text-primary transition-colors">{item.label}</span>
                            <span className="text-primary font-bold">{item.percentage}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                    width: `${item.percentage}%`,
                                    backgroundColor: `rgba(87, 241, 219, ${1 - (idx * 0.2)})`,
                                    boxShadow: idx === 0 ? '0 0 10px rgba(87,241,219,0.3)' : 'none'
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FocusDistribution;

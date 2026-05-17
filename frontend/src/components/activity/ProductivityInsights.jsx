import React from 'react';

const ProductivityInsights = ({ insightsData = [] }) => {
    if (!insightsData || insightsData.length === 0) return null;

    return (
        <div className="grid md:grid-cols-3 gap-md">
            {insightsData.map((insight, idx) => {
                const borderColors = ['border-l-primary/40', 'border-l-primary', 'border-l-tertiary/40'];
                const bgColors = ['bg-primary/10', 'bg-primary/20', 'bg-surface-bright'];
                const textColors = ['text-primary', 'text-primary', 'text-tertiary'];
                
                return (
                    <div key={idx} className={`bg-surface-container/40 backdrop-blur-md rounded-2xl p-sm px-md flex items-center gap-md border-l-4 ${borderColors[idx % 3]} hover:bg-surface-container/50 transition-colors cursor-default`}>
                        <div className={`w-10 h-10 rounded-full ${bgColors[idx % 3]} flex items-center justify-center ${textColors[idx % 3]}`}>
                            <span className="material-symbols-outlined" style={idx === 1 ? { fontVariationSettings: "'FILL' 1" } : {}}>{insight.icon}</span>
                        </div>
                        <div>
                            <p className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-widest">{insight.type}</p>
                            <p className="font-body-md text-body-md font-bold text-on-surface">{insight.text}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductivityInsights;

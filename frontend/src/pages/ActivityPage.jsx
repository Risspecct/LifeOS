import React from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopBar from '../components/dashboard/DashboardTopBar';
import { useAuth } from '../hooks/useAuth';
import { useActivityInsights } from '../hooks/useActivityInsights';

import ActivityHero from '../components/activity/ActivityHero';
import ProductivityHeatmap from '../components/activity/ProductivityHeatmap';
import WeeklyTrendChart from '../components/activity/WeeklyTrendChart';
import FocusDistribution from '../components/activity/FocusDistribution';
import ProductivityInsights from '../components/activity/ProductivityInsights';
import ActivityTimeline from '../components/activity/ActivityTimeline';

const ActivityPage = () => {
    const { clearAuth } = useAuth();
    const { data, loading, error } = useActivityInsights();

    return (
        <div className="bg-background text-on-surface">
            <DashboardSidebar onLogout={clearAuth} activeView="activity" />
            <DashboardTopBar />
            
            <main className="ml-0 md:ml-64 p-md lg:p-xl min-h-screen">
                <div className="max-w-container-max mx-auto space-y-lg">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="p-md text-error bg-error-container/20 rounded-xl">
                            <p>{error}</p>
                        </div>
                    ) : data ? (
                        <>
                            <ActivityHero summary={data.summary} />
                            <ProductivityHeatmap heatmapData={data.heatmap} />
                            
                            <div className="grid lg:grid-cols-2 gap-lg">
                                <WeeklyTrendChart trendData={data.weeklyTrend} />
                                <FocusDistribution distributionData={data.focusDistribution} />
                            </div>
                            
                            <ProductivityInsights insightsData={data.insights} />
                            <ActivityTimeline timelineData={data.timeline} />
                        </>
                    ) : null}
                </div>
            </main>

            {/* FAB */}
            <button className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-[0_8px_30px_rgba(87,241,219,0.4)] flex items-center justify-center hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all z-50">
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>
        </div>
    );
};

export default ActivityPage;

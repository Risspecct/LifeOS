import React from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopBar from '../components/dashboard/DashboardTopBar';
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import { useAuth } from '../hooks/useAuth';
import { useActivityInsights } from '../hooks/useActivityInsights';
import { useSidebar } from '../hooks/useSidebar';

import ActivityHero from '../components/activity/ActivityHero';
import ProductivityHeatmap from '../components/activity/ProductivityHeatmap';
import WeeklyTrendChart from '../components/activity/WeeklyTrendChart';
import FocusDistribution from '../components/activity/FocusDistribution';
import ProductivityInsights from '../components/activity/ProductivityInsights';
import ActivityTimeline from '../components/activity/ActivityTimeline';
import ActivitySkeleton from '../components/activity/ActivitySkeleton';
import { useDelayedLoading } from '../hooks/useDelayedLoading';

const ActivityPage = () => {
    const isCollapsed = useSidebar();
    const { clearAuth } = useAuth();
    const { data, loading, error } = useActivityInsights();
    const showSkeleton = useDelayedLoading(loading, 200);

    return (
        <div className="bg-background min-h-screen text-on-surface">
            <DashboardSidebar onLogout={clearAuth} activeView="activity" />
            <DashboardTopBar />
            
            <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-md lg:p-xl transition-all duration-300 ease-in-out`}>
                <div className="max-w-5xl mx-auto space-y-xl">
                    {showSkeleton ? (
                        <ActivitySkeleton />
                    ) : loading ? null : error ? (
                        <div className="p-md text-error bg-error-container/20 rounded-xl">
                            <p>{error}</p>
                        </div>
                    ) : data ? (
                        <>
                            <ActivityHero summary={data.summary} />
                            <ProductivityHeatmap heatmapData={data.heatmap} summary={data.summary} />
                            
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



            <MobileBottomNav activeView="activity" />
        </div>
    );
};

export default ActivityPage;

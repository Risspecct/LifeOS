import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardTopBar from "../components/dashboard/DashboardTopBar";
import DashboardWelcomeHero from "../components/dashboard/DashboardWelcomeHero";
import QuickActionsSection from "../components/dashboard/QuickActionsSection";
import DashboardTaskPreview from "../components/dashboard/DashboardTaskPreview";
import ProductivityStatsGrid from "../components/dashboard/ProductivityStatsGrid";
import StudyStreakWidget from "../components/dashboard/StudyStreakWidget";
import AchievementWidget from "../components/dashboard/AchievementWidget";
import UpcomingTasksSidebar from "../components/dashboard/UpcomingTasksSidebar";
import SocialPresenceWidget from "../components/dashboard/SocialPresenceWidget";
import RecentActivityWidget from "../components/dashboard/RecentActivityWidget";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import { useSidebar } from "../hooks/useSidebar";

const DashboardPage = () => {
  const isCollapsed = useSidebar();
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const { dashboard, loading, refreshing, error, refresh } = useDashboard();

  const { prioritizedTasks, upcomingTasks, recentActivities, profile, summary } = dashboard;
  const urgentCount = useMemo(
    () => prioritizedTasks.filter((task) => task.priority === "CRITICAL" || task.priority === "HIGH").length,
    [prioritizedTasks]
  );
  const totalCount = summary.pendingTasks + summary.completedTasks;
  const focusScore = Math.max(
    40,
    Math.min(95, 60 + summary.completedTasks * 8 - summary.pendingTasks - summary.overdueTasks * 2)
  );

  return (
    <div className="bg-background text-on-surface">
      <DashboardSidebar onLogout={clearAuth} activeView="dashboard" />
      <DashboardTopBar />

      <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-md lg:p-xl min-h-screen transition-all duration-300 ease-in-out`}>
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-10 gap-xl">
          <section className="lg:col-span-7 space-y-xl">
            <DashboardWelcomeHero
              profile={profile}
              focusScore={focusScore}
              urgentCount={urgentCount}
              pendingCount={summary.pendingTasks}
            />
            <QuickActionsSection />
            <DashboardTaskPreview
              tasks={prioritizedTasks}
              loading={loading}
              error={error}
              onOpenTasks={() => navigate("/tasks")}
              onOpenTask={(taskId) => navigate(`/tasks/${taskId}`)}
            />
            <ProductivityStatsGrid
              pendingCount={summary.pendingTasks}
              completedCount={summary.completedTasks}
              overdueCount={summary.overdueTasks}
            />

            <div className="flex items-center justify-between">
              {!loading && !error && totalCount === 0 ? (
                <p className="text-label-sm text-on-surface-variant">
                  Start by creating your first task to activate dashboard insights.
                </p>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={refresh}
                disabled={refreshing}
                className="text-label-sm text-primary hover:underline disabled:opacity-60 disabled:no-underline"
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </section>

          <aside className="lg:col-span-3 space-y-xl">
            <div className="space-y-md">
              <StudyStreakWidget />
              <AchievementWidget />
              <SocialPresenceWidget />
            </div>
            <div className="space-y-md">
              <UpcomingTasksSidebar
                tasks={upcomingTasks}
                loading={loading}
                onOpenTask={(taskId) => navigate(`/tasks/${taskId}`)}
              />
              <RecentActivityWidget
                activities={recentActivities}
                loading={loading}
                onOpenTask={(taskId) => navigate(`/tasks/${taskId}`)}
              />
            </div>
          </aside>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-sm py-xs bg-surface border-t border-outline-variant md:hidden">
        <button type="button" onClick={() => navigate("/dashboard")} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl p-xs">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-label-sm text-label-sm">Dashboard</span>
        </button>
        <button type="button" onClick={() => navigate("/tasks")} className="flex flex-col items-center justify-center text-on-surface-variant p-xs">
          <span className="material-symbols-outlined">checklist</span>
          <span className="font-label-sm text-label-sm">Tasks</span>
        </button>
        <button type="button" onClick={() => navigate("/profile")} className="flex flex-col items-center justify-center text-on-surface-variant p-xs">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-label-sm">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardPage;

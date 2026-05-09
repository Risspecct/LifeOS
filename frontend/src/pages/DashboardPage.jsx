import { useEffect, useMemo, useState } from "react";
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
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/errorUtils";
import { getTasks } from "../api/taskApi";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { clearAuth, profile, refreshProfileStatus } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");

  useEffect(() => {
    refreshProfileStatus().catch(() => {});
  }, [refreshProfileStatus]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoadingTasks(true);
      setTasksError("");
      try {
        const data = await getTasks({});
        const normalized = Array.isArray(data) ? data : [];
        const sorted = [...normalized].sort((a, b) => {
          if (!a?.dueDate) return 1;
          if (!b?.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        setTasks(sorted);
      } catch (error) {
        setTasksError(getApiErrorMessage(error, "Unable to load tasks."));
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, []);

  const prioritizedTasks = useMemo(
    () => tasks.filter((task) => task.status !== "COMPLETED").slice(0, 4),
    [tasks]
  );
  const upcomingTasks = useMemo(() => tasks.filter((task) => task.dueDate).slice(0, 3), [tasks]);
  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === "COMPLETED").length,
    [tasks]
  );
  const pendingCount = tasks.length - completedCount;
  const highPriorityCount = prioritizedTasks.filter((task) => task.status === "IN_PROGRESS").length;
  const focusScore = Math.max(40, Math.min(95, 60 + completedCount * 8 - pendingCount));

  return (
    <div className="bg-background text-on-surface">
      <DashboardSidebar onLogout={clearAuth} activeView="dashboard" />
      <DashboardTopBar />

      <main className="ml-0 md:ml-64 p-md lg:p-xl min-h-screen">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-10 gap-xl">
          <section className="lg:col-span-7 space-y-xl">
            <DashboardWelcomeHero
              username={profile?.username}
              profile={profile}
              focusScore={focusScore}
              highPriorityCount={highPriorityCount}
            />
            <QuickActionsSection />
            <DashboardTaskPreview
              tasks={prioritizedTasks}
              loading={loadingTasks}
              error={tasksError}
              onOpenTasks={() => navigate("/tasks")}
            />
            <ProductivityStatsGrid
              pendingCount={pendingCount}
              completedCount={completedCount}
              totalCount={tasks.length}
            />
          </section>

          <aside className="lg:col-span-3 space-y-xl">
            <StudyStreakWidget />
            <AchievementWidget />
            <UpcomingTasksSidebar tasks={upcomingTasks} loading={loadingTasks} />
            <SocialPresenceWidget />
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

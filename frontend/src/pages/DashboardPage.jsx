import { useMemo, useState } from "react";
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
import RecentNotesWidget from "../components/notes/RecentNotesWidget";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import { useSidebar } from "../hooks/useSidebar";
import { useLabels } from "../hooks/useLabels";
import DashboardTaskModal from "../components/dashboard/DashboardTaskModal";
import DashboardLabelModal from "../components/dashboard/DashboardLabelModal";
import { createTask } from "../api/taskApi";
import { buildTaskStatusOptions } from "../utils/taskStatus";
import { getApiErrorMessage } from "../utils/errorUtils";
import { useToast } from "../components/ui/ToastProvider";
import NoteFormModal from "../components/notes/NoteFormModal";
import { createNote } from "../api/notesApi";
import { useNotes } from "../hooks/useNotes";

const DashboardPage = () => {
  console.log("DashboardPage rendered");
  const isCollapsed = useSidebar();
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const { dashboard, loading, refreshing, error, refresh, updateOptimistically } = useDashboard();
  const { labels, createLabel } = useLabels();
  const { notes: recentNotes, loading: notesLoading, error: notesError, refresh: refreshNotes } = useNotes();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskError, setTaskError] = useState("");

  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [labelError, setLabelError] = useState("");

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [noteError, setNoteError] = useState("");

  const { showToast } = useToast();

  const handleCreateTask = async (payload) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      id: tempId,
      ...payload,
      status: payload.status || "TO_DO",
      priority: "NORMAL",
      createdAt: new Date().toISOString()
    };

    updateOptimistically((prev) => ({
      ...prev,
      upcomingTasks: [optimisticTask, ...prev.upcomingTasks].slice(0, 10),
      prioritizedTasks: [optimisticTask, ...prev.prioritizedTasks].slice(0, 10),
      summary: {
        ...prev.summary,
        pendingTasks: prev.summary.pendingTasks + 1
      }
    }));

    setIsTaskModalOpen(false);

    try {
      await createTask(payload);
      showToast("Task created");
      refresh();
    } catch (err) {
      showToast("Unable to create task", "error");
      updateOptimistically((prev) => ({
        ...prev,
        upcomingTasks: prev.upcomingTasks.filter((t) => t.id !== tempId),
        prioritizedTasks: prev.prioritizedTasks.filter((t) => t.id !== tempId),
        summary: {
          ...prev.summary,
          pendingTasks: Math.max(0, prev.summary.pendingTasks - 1)
        }
      }));
    }
  };

  const handleCreateLabel = async (payload) => {
    setIsLabelModalOpen(false);
    try {
      await createLabel(payload);
      showToast("Label created");
    } catch (err) {
      showToast("Unable to create label", "error");
    }
  };

  const handleCreateNote = async (payload) => {
    setIsCreatingNote(true);
    setNoteError("");
    try {
      await createNote(payload);
      setIsNoteModalOpen(false);
      showToast("Note created");
      refreshNotes();
    } catch (err) {
      const message = getApiErrorMessage(err, "Unable to create note.");
      setNoteError(message);
      showToast("Unable to create note", "error");
    } finally {
      setIsCreatingNote(false);
    }
  };

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

      <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-md lg:p-xl pb-[84px] md:pb-xl min-h-screen transition-all duration-300 ease-in-out`}>
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-10 gap-xl">
          <section className="lg:col-span-7 space-y-xl">
            <DashboardWelcomeHero
              profile={profile}
              focusScore={focusScore}
              urgentCount={urgentCount}
              pendingCount={summary.pendingTasks}
            />
            <QuickActionsSection 
              onOpenTaskModal={() => setIsTaskModalOpen(true)}
              onOpenNoteModal={() => setIsNoteModalOpen(true)}
              onOpenLabelModal={() => setIsLabelModalOpen(true)}
            />
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
              <StudyStreakWidget
                streakDays={summary.currentStreak}
                loading={loading}
                error={error}
              />
              <AchievementWidget />
              <SocialPresenceWidget />
            </div>
            <div className="space-y-md">
              <UpcomingTasksSidebar
                tasks={upcomingTasks}
                loading={loading}
                onOpenTask={(taskId) => navigate(`/tasks/${taskId}`)}
              />
              <RecentNotesWidget
                notes={recentNotes}
                loading={notesLoading}
                error={notesError}
                compact
                onCreateNote={() => setIsNoteModalOpen(true)}
                onViewNote={(note) => navigate(note.taskId ? `/tasks/${note.taskId}/notes/${note.id}` : `/notes/${note.id}`)}
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

      <MobileBottomNav activeView="dashboard" />

      <DashboardTaskModal
        isOpen={isTaskModalOpen}
        isCreating={isCreatingTask}
        error={taskError}
        statusOptions={buildTaskStatusOptions()}
        labels={labels}
        onClose={() => setIsTaskModalOpen(false)}
        onCreateTask={handleCreateTask}
      />

      <DashboardLabelModal
        isOpen={isLabelModalOpen}
        isCreating={isCreatingLabel}
        error={labelError}
        onClose={() => setIsLabelModalOpen(false)}
        onCreateLabel={handleCreateLabel}
      />

      <NoteFormModal
        isOpen={isNoteModalOpen}
        mode="create"
        isSaving={isCreatingNote}
        error={noteError}
        onClose={() => {
          setIsNoteModalOpen(false);
          setNoteError("");
        }}
        onSubmit={handleCreateNote}
      />
    </div>
  );
};

export default DashboardPage;

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AcademicInfoCard from "./AcademicInfoCard";
import ProfileStatsCard from "./ProfileStatsCard";

const ProfileViewSection = ({ profile, stats, statsLoading, statsError, onRetryStats }) => {
  const navigate = useNavigate();
  const completionRate = useMemo(() => {
    if (!stats || !stats.tasksCreated || stats.tasksCreated <= 0) return 0;
    return Math.min(100, Math.round((Number(stats.tasksCompleted || 0) / Number(stats.tasksCreated || 0)) * 100));
  }, [stats]);

  const currentStreak = Number(stats?.currentStreak || 0);
  const streakActive = currentStreak > 0;

  return (
    <div className="space-y-md">
      <section className="bg-surface-container border border-outline-variant rounded-xl p-lg">
        <div className="flex flex-col md:flex-row gap-md md:items-center">
          <div className="h-24 w-24 rounded-full border-2 border-primary bg-surface-container-high shrink-0" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-h2 text-h2 text-on-surface">{profile?.name || "Student"}</h2>
              <span
                className={`inline-flex items-center gap-1 text-2xl ${streakActive ? "text-tertiary" : "text-on-surface-variant"}`}
                aria-label={streakActive ? `Current streak ${currentStreak}` : "No current streak"}
              >
                <span>🔥</span>
                <span className="text-sm font-medium">{currentStreak}</span>
              </span>
            </div>
            <p className="text-on-surface-variant">@{profile?.username || "username"}</p>
            <p className="text-on-surface-variant">{profile?.email || "Email unavailable"}</p>
          </div>
        </div>

        <p className="text-on-surface mt-md">{profile?.bio || "No bio added yet."}</p>
      </section>

      <AcademicInfoCard
        college={profile?.college}
        branch={profile?.branchCode}
        year={profile?.year}
      />

      <ProfileStatsCard stats={stats} loading={statsLoading} error={statsError} onRetry={onRetryStats} />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        <article className="bg-surface-container border border-outline-variant rounded-xl p-md">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-h3 text-h3 text-on-surface">Study Network</h3>
              <p className="text-on-surface-variant text-sm mt-1">Stay connected with your study partners.</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-primary text-label-sm">
              {stats?.friendCount ?? 0} friends
            </span>
          </div>

          <p className="font-semibold text-on-surface mb-1">{stats?.friendCount ?? 0} Active Connections</p>
          <p className="text-on-surface-variant text-sm mb-4">Maintain your study network and stay accountable with friends.</p>

          <button
            type="button"
            onClick={() => navigate("/connections")}
            className="rounded-lg px-md py-2 bg-surface-container-high border border-outline-variant text-on-surface hover:bg-surface-container transition-colors"
          >
            View network
          </button>
        </article>

        <article className="bg-surface-container border border-outline-variant rounded-xl p-md">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-h3 text-h3 text-on-surface">Completion Rate</h3>
              <p className="text-on-surface-variant text-sm mt-1">Based on tasks created and finished.</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-secondary text-label-sm">
              {completionRate}%
            </span>
          </div>

          <div className="mb-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-on-surface-variant text-sm mt-2">
              {stats?.tasksCreated ? `You completed ${stats.tasksCompleted ?? 0} of ${stats.tasksCreated} tasks.` : "Create tasks to start tracking your completion rate."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-on-surface-variant">
            <div className="space-y-1">
              <p className="font-medium text-on-surface">Created</p>
              <p className="text-on-surface font-bold">{stats?.tasksCreated ?? 0}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-on-surface">Completed</p>
              <p className="text-on-surface font-bold">{stats?.tasksCompleted ?? 0}</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default ProfileViewSection;

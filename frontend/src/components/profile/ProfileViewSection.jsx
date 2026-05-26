import AcademicInfoCard from "./AcademicInfoCard";
import ProfileStatsCard from "./ProfileStatsCard";

const ProfileViewSection = ({ profile, stats, statsLoading, statsError, onRetryStats }) => {
  return (
    <div className="space-y-md">
      <section className="bg-surface-container border border-outline-variant rounded-xl p-lg">
        <div className="flex flex-col md:flex-row gap-md md:items-center">
          <div className="h-24 w-24 rounded-full border-2 border-primary bg-surface-container-high shrink-0" />
          <div className="space-y-1">
            <h2 className="font-h2 text-h2 text-on-surface">{profile?.name || "Student"}</h2>
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
          <h3 className="font-h3 text-h3 text-on-surface mb-xs">Achievements</h3>
          <p className="text-on-surface-variant">Milestones and badges will appear here soon.</p>
        </article>
        <article className="bg-surface-container border border-outline-variant rounded-xl p-md">
          <h3 className="font-h3 text-h3 text-on-surface mb-xs">Study Network</h3>
          <p className="text-on-surface-variant">Connections, groups, and collaboration insights are coming next.</p>
        </article>
      </section>
    </div>
  );
};

export default ProfileViewSection;

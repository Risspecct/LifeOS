import { useEffect, useMemo, useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import DashboardTopBar from "../../components/dashboard/DashboardTopBar";
import MobileBottomNav from "../../components/navigation/MobileBottomNav";
import LeaderboardTabs from "../../components/leaderboard/LeaderboardTabs";
import CurrentUserCard from "../../components/leaderboard/CurrentUserCard";
import LeaderboardTable from "../../components/leaderboard/LeaderboardTable";
import EmptyLeaderboardState from "../../components/leaderboard/EmptyLeaderboardState";
import LeaderboardSkeleton from "../../components/leaderboard/LeaderboardSkeleton";
import PublicProfileDialog from "../../components/profile/PublicProfileDialog";
import { LEADERBOARD_SCOPES, getLeaderboard } from "../../api/leaderboardApi";
import { getApiErrorMessage } from "../../utils/errorUtils";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../hooks/useSidebar";
import { useDelayedLoading } from "../../hooks/useDelayedLoading";

const LEADERBOARD_TABS = [
  { label: "Global", value: LEADERBOARD_SCOPES.GLOBAL },
  { label: "Friends", value: LEADERBOARD_SCOPES.FRIENDS },
  { label: "College", value: LEADERBOARD_SCOPES.COLLEGE }
];

const LeaderboardPage = () => {
  const isCollapsed = useSidebar();
  const { clearAuth, profile } = useAuth();
  const [scope, setScope] = useState(LEADERBOARD_SCOPES.GLOBAL);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const showSkeleton = useDelayedLoading(loading, 200);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getLeaderboard(scope);
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        setRows([]);
        setError(getApiErrorMessage(err, "Unable to load leaderboard."));
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [scope]);

  const currentUserStats = useMemo(() => {
    const authUserId = profile?.userId ?? profile?.id;
    const authUsername = profile?.username ?? profile?.name;
    const current = rows.find(
      (entry) =>
        (authUserId && String(entry.userId) === String(authUserId)) ||
        (authUsername && String(entry.username).toLowerCase() === String(authUsername).toLowerCase())
    );
    return current || rows[0] || null;
  }, [rows, profile]);

  const openProfileDialog = (userId) => {
    const id = Number(userId);
    if (!Number.isFinite(id) || id <= 0) return;
    setSelectedUserId(id);
    setIsProfileDialogOpen(true);
  };

  return (
    <div className="bg-background min-h-screen text-on-surface">
      <DashboardSidebar onLogout={clearAuth} activeView="leaderboard" />
      <DashboardTopBar />

      <main className={`ml-0 ${isCollapsed ? "md:ml-20" : "md:ml-64"} p-md lg:p-xl pb-[84px] md:pb-xl min-h-screen transition-all duration-300 ease-in-out`}>
        <div className="max-w-container-max mx-auto space-y-md">
          <header className="flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-h3 text-h3 text-on-surface">Leaderboard</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Build momentum through consistent progress and shared accountability.
              </p>
            </div>
            <select className="w-full sm:w-auto bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-body-sm text-on-surface-variant">
              <option>Weekly</option>
              <option>Monthly</option>
              <option>All Time</option>
            </select>
          </header>

          <LeaderboardTabs tabs={LEADERBOARD_TABS} activeScope={scope} onChangeScope={setScope} />
          <CurrentUserCard stats={currentUserStats} loading={loading} />

          {showSkeleton ? <LeaderboardSkeleton /> : null}
          {!loading && error ? <p className="text-error text-label-sm">{error}</p> : null}
          {!loading && !error && rows.length === 0 ? <EmptyLeaderboardState /> : null}
          {!loading && !error && rows.length > 0 ? (
            <LeaderboardTable
              entries={rows}
              currentUserId={profile?.userId ?? profile?.id}
              currentUsername={profile?.username ?? profile?.name}
              onOpenProfile={openProfileDialog}
            />
          ) : null}
        </div>
      </main>

      <MobileBottomNav activeView="leaderboard" />
      <PublicProfileDialog
        isOpen={isProfileDialogOpen}
        userId={selectedUserId}
        onClose={() => setIsProfileDialogOpen(false)}
      />
    </div>
  );
};

export default LeaderboardPage;

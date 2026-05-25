import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardTopBar from "../components/dashboard/DashboardTopBar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import { useAuth } from "../hooks/useAuth";
import { useSidebar } from "../hooks/useSidebar";

const SettingsPage = () => {
  const isCollapsed = useSidebar();
  const { clearAuth } = useAuth();

  return (
    <div className="bg-background min-h-screen text-on-surface">
      <DashboardSidebar onLogout={clearAuth} activeView="settings" />
      <DashboardTopBar />
      <main className={`ml-0 ${isCollapsed ? "md:ml-20" : "md:ml-64"} p-md lg:p-xl pb-[84px] md:pb-xl min-h-screen transition-all duration-300 ease-in-out`}>
        <div className="max-w-container-max mx-auto rounded-xl border border-outline-variant bg-surface-container p-lg">
          <h1 className="font-h3 text-h3">Settings</h1>
          <p className="text-on-surface-variant mt-xs">Settings controls will be available here soon.</p>
        </div>
      </main>
      <MobileBottomNav activeView="settings" />
    </div>
  );
};

export default SettingsPage;

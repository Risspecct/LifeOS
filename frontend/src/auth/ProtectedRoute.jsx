import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const AuthLoadingScreen = () => (
  <div className="min-h-screen bg-background text-on-background flex items-center justify-center p-md">
    <p className="text-body-md text-on-surface-variant">Loading your workspace...</p>
  </div>
);

const ProtectedRoute = ({ requireProfile = true }) => {
  const {
    isAuthenticated,
    hasProfile,
    profileChecked,
    profileLoading,
    refreshProfileStatus,
    clearAuth,
    isInitialized
  } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isInitialized && isAuthenticated && !profileChecked && !profileLoading) {
      refreshProfileStatus().catch((error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          clearAuth();
        }
      });
    }
  }, [isInitialized, isAuthenticated, profileChecked, profileLoading, refreshProfileStatus, clearAuth]);

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!profileChecked || profileLoading) {
    return <AuthLoadingScreen />;
  }

  if (requireProfile && !hasProfile) {
    return <Navigate to="/profile-setup" replace />;
  }

  if (!requireProfile && hasProfile) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

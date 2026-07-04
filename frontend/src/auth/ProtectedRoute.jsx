import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import AuthLoadingScreen from "./AuthLoadingScreen";

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

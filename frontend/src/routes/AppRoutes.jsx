import { Navigate, Route, Routes } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TasksPage from "../pages/TasksPage";
import ProfileSetupPage from "../pages/ProfileSetupPage";
import ProfilePage from "../pages/ProfilePage";
import ActivityPage from "../pages/ActivityPage";
import ProtectedRoute from "../auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute requireProfile={false} />}>
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
      </Route>

      <Route element={<ProtectedRoute requireProfile={true} />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/:taskId" element={<TasksPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
};

export default AppRoutes;

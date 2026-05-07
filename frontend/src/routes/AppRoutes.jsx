import { Navigate, Route, Routes } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProfileSetupPage from "../pages/ProfileSetupPage";
import ProfilePage from "../pages/ProfilePage";
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
        <Route path="/" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
};

export default AppRoutes;

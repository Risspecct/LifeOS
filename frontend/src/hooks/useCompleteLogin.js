import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useCompleteLogin = () => {
  const navigate = useNavigate();
  const { setAuthFromToken, refreshProfileStatus } = useAuth();

  return useCallback(
    async (jwtToken) => {
      setAuthFromToken(jwtToken);

      const profileResult = await refreshProfileStatus();
      if (profileResult?.hasProfile) {
        navigate("/", { replace: true });
      } else {
        navigate("/profile-setup", { replace: true });
      }
    },
    [navigate, refreshProfileStatus, setAuthFromToken]
  );
};

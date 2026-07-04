import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { exchangeOAuthCode } from "../api/authApi";
import AuthLoadingScreen from "../auth/AuthLoadingScreen";
import { useAuth } from "../hooks/useAuth";
import { useCompleteLogin } from "../hooks/useCompleteLogin";
import { getApiErrorMessage } from "../utils/errorUtils";

const OAuthSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const completeLogin = useCompleteLogin();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code")?.trim();

    if (!code) {
      navigate("/login", { replace: true });
      return;
    }

    const finishOAuthLogin = async () => {
      try {
        const response = await exchangeOAuthCode({ code });

        if (!response?.token) {
          throw new Error("Login succeeded but token was not returned.");
        }

        await completeLogin(response.token);
      } catch (error) {
        clearAuth();
        navigate("/login", {
          replace: true,
          state: {
            authError: getApiErrorMessage(error, "Unable to login right now.")
          }
        });
      }
    };

    finishOAuthLogin();
  }, [clearAuth, completeLogin, location.search, navigate]);

  return <AuthLoadingScreen message="Signing you in with Google..." />;
};

export default OAuthSuccessPage;

import { createContext, useCallback, useMemo, useState } from "react";
import { AUTH_TOKEN_KEY } from "../utils/constants";
import { getCurrentProfile } from "../api/profileApi";

export const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  profile: null,
  hasProfile: false,
  profileChecked: false,
  profileLoading: false,
  setAuthFromToken: () => {},
  clearAuth: () => {},
  refreshProfileStatus: async () => {},
  markProfileCompleted: () => {}
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const setAuthFromToken = useCallback((jwtToken) => {
    if (!jwtToken) return;
    localStorage.setItem(AUTH_TOKEN_KEY, jwtToken);
    setToken(jwtToken);
    setProfile(null);
    setHasProfile(false);
    setProfileChecked(false);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setProfile(null);
    setHasProfile(false);
    setProfileChecked(false);
    setProfileLoading(false);
  }, []);

  const refreshProfileStatus = useCallback(async () => {
    if (!localStorage.getItem(AUTH_TOKEN_KEY)) {
      setProfile(null);
      setHasProfile(false);
      setProfileChecked(true);
      return { hasProfile: false, profile: null };
    }

    setProfileLoading(true);

    try {
      const profileData = await getCurrentProfile();
      setProfile(profileData);
      setHasProfile(true);
      setProfileChecked(true);
      return { hasProfile: true, profile: profileData };
    } catch (error) {
      const status = error?.response?.status;

      if (status === 404) {
        setProfile(null);
        setHasProfile(false);
        setProfileChecked(true);
        return { hasProfile: false, profile: null };
      }

      if (status === 401 || status === 403) {
        clearAuth();
      }

      throw error;
    } finally {
      setProfileLoading(false);
    }
  }, [clearAuth]);

  const markProfileCompleted = useCallback((profileData) => {
    setProfile(profileData ?? null);
    setHasProfile(true);
    setProfileChecked(true);
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      profile,
      hasProfile,
      profileChecked,
      profileLoading,
      setAuthFromToken,
      clearAuth,
      refreshProfileStatus,
      markProfileCompleted
    }),
    [
      token,
      profile,
      hasProfile,
      profileChecked,
      profileLoading,
      setAuthFromToken,
      clearAuth,
      refreshProfileStatus,
      markProfileCompleted
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

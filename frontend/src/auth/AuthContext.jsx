import { createContext, useCallback, useMemo, useState } from "react";
import { AUTH_TOKEN_KEY } from "../utils/constants";

export const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  setAuthFromToken: () => {},
  clearAuth: () => {}
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));

  const setAuthFromToken = useCallback((jwtToken) => {
    if (!jwtToken) return;
    localStorage.setItem(AUTH_TOKEN_KEY, jwtToken);
    setToken(jwtToken);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      setAuthFromToken,
      clearAuth
    }),
    [token, setAuthFromToken, clearAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

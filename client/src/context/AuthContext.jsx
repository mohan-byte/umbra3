import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch, apiJson, clearSession, getStoredUser, getToken, setSession, UNAUTHORIZED_EVENT } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  // On first load, if a token is stored, verify it's still valid against the
  // server (rather than trusting a possibly-stale localStorage copy).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const res = await apiFetch("/api/auth/me");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) { clearSession(); setUser(null); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Any 401 from apiFetch (expired/invalid token) drops the session everywhere.
  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiJson("/api/auth/login", { method: "POST", body: { email, password } });
    setSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await apiJson("/api/auth/register", { method: "POST", body: { name, email, password } });
    setSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

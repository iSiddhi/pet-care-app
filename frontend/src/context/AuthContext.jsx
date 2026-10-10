import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService, tokenStore } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // `ready` guards the first paint so protected routes don't flash the
  // login page while we're still restoring the session.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    const restore = async () => {
      if (!tokenStore.get()) {
        if (alive) setReady(true);
        return;
      }
      try {
        const me = await authService.me();
        if (alive) setUser(me);
      } catch {
        // Token expired or invalid -- the interceptor already cleared it
        if (alive) setUser(null);
      } finally {
        if (alive) setReady(true);
      }
    };

    restore();
    return () => { alive = false; };
  }, []);

  const login = useCallback(async (credentials) => {
    const me = await authService.login(credentials);
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (payload) => {
    const me = await authService.register(payload);
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, ready, login, register, logout, isAuthed: Boolean(user) }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

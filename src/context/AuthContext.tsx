import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Auth from '../services/auth'; // ajusta la ruta según la ubicación real del archivo

type AuthContextValue = {
  user: any | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // hidratar usuario al montar
  useEffect(() => {
    (async () => {
      try {
        const u = await Auth.me();
        setUser(u);
      } catch {
        // 401 esperado si no hay sesión
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    const u = await Auth.login(email.trim().toLowerCase(), password);
    setUser(u); // cookie ya quedó guardada
  };

  const logout = async () => {
    await Auth.logout();
    setUser(null);
  };

  const refresh = async () => {
    const u = await Auth.me();
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

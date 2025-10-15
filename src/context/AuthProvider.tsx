import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Auth from '../services/auth';

type AuthState = { user: any | null; loading: boolean; };

const AuthCtx = createContext<AuthState>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    (async () => {
      try {
        const user = await Auth.me();
        setState({ user, loading: false });
      } catch {
        setState({ user: null, loading: false });
      }
    })();
  }, []);

  return <AuthCtx.Provider value={state}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);

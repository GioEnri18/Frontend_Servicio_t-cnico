// ruta: frontend/src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { authService } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
      return;
    }

    try {
      // Intentar obtener el perfil del usuario para verificar el token
      const userProfile = await authService.getProfile();
      setAuthState({
        isAuthenticated: true,
        user: userProfile,
        loading: false,
        error: null
      });
    } catch (error) {
      // Si falla, limpiar el token y mostrar como no autenticado
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_email');
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Token inválido'
      });
    }
  };

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.login(email, password);
      const { token, access_token, user } = response;
      
      const authToken = token || access_token;
      
      if (authToken) {
        localStorage.setItem('jwt_token', authToken);
        localStorage.setItem('user_email', email);
        
        setAuthState({
          isAuthenticated: true,
          user: user || { id: '1', email },
          loading: false,
          error: null
        });
        
        return { success: true };
      } else {
        throw new Error('No se recibió token de autenticación');
      }
    } catch (error: any) {
      console.error('Error de login:', error);
      
      let errorMessage = 'Error de conexión';
      
      if (error.response?.status === 401) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = 'Backend no disponible';
      }
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Logout es solo local, no necesita llamada al backend
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_email');
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus
  };
};
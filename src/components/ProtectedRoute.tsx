// ruta: frontend/src/components/ProtectedRoute.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
      // Si no hay token, redirigir al login
      navigate('/login');
    }
  }, [navigate]);

  // Si hay token, mostrar el contenido
  const token = localStorage.getItem('jwt_token');
  return token ? <>{children}</> : null;
};

export default ProtectedRoute;
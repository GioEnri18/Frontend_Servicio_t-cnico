// ruta: frontend/src/components/ProtectedRoute.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
      // Si no hay token, redirigir al login
      navigate('/login', { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [navigate]);

  const token = localStorage.getItem('jwt_token');
  
  // Si está verificando o no hay token, mostrar loading o redirigir
  if (isChecking || !token) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Verificando autenticación...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
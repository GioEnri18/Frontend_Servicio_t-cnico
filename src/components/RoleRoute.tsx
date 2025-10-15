// components/RoleRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute: React.FC<{ role?: string; roles?: string[]; children: React.ReactElement }> = ({ role, roles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const allow = roles ? roles.includes(user.role) : role ? user.role === role : true;
  if (!allow) return <Navigate to="/" replace />;

  return children;
};

export default RoleRoute;

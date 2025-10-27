
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  role?: 'customer' | 'admin' | 'technician' | 'employee';
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const profile = await authService.getProfile();
        const userData = profile.user || profile;
        setUserProfile(userData);
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setError('Error cargando perfil de usuario');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      padding: '2rem' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <button 
              onClick={() => navigate('/dashboard')} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                color: '#6366f1',
                fontSize: '1rem',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              ← Volver al Dashboard
            </button>
          </div>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '0.5rem' 
          }}>
            🏢 Panel de Administración
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '1rem' }}>
            Bienvenido, {userProfile?.firstName || 'Usuario'}. Gestiona tu empresa desde aquí.
          </p>
          {userProfile?.role && (
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: userProfile.role === 'admin' ? '#10b981' : '#6366f1',
              color: 'white',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {userProfile.role === 'admin' ? '👑 Administrador' : 
               userProfile.role === 'employee' ? '👤 Empleado' : 
               userProfile.role === 'technician' ? '🔧 Técnico' : '👥 Cliente'}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            {error}
          </div>
        )}

        {/* Dashboard Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          
          {/* Gestión de Usuarios - Solo Admin */}
          {userProfile?.role === 'admin' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  👥 Gestión de Usuarios
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Administra empleados y usuarios del sistema
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => navigate('/create-employee')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  ➕ Crear Empleado
                </button>
                
                <button
                  onClick={() => navigate('/employee-list')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📋 Ver Empleados
                </button>

                <button
                  onClick={() => navigate('/clientes')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  👥 Ver Clientes
                </button>
              </div>
            </div>
          )}

          {/* Servicios y Cotizaciones */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                🔧 Servicios Técnicos
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Gestiona servicios y cotizaciones
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/quotations')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                💰 Ver Cotizaciones
              </button>
              
              <button
                onClick={() => navigate('/products')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                📦 Gestionar Productos
              </button>
              
              <button
                onClick={() => alert('Funcionalidad en desarrollo')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                📊 Reportes
              </button>
            </div>
          </div>

          {/* Perfil y Configuración */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                ⚙️ Configuración
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Perfil y configuración personal
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                👤 Mi Perfil
              </button>
              
              <button
                onClick={() => {
                  localStorage.removeItem('jwt_token');
                  navigate('/login');
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>

        </div>

        {/* Información adicional para usuarios no-admin */}
        {userProfile?.role !== 'admin' && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ color: '#92400e', margin: 0 }}>
              ℹ️ Algunas funciones están disponibles solo para administradores
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboardPage;

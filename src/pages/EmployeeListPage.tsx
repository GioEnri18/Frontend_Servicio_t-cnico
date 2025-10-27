import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../services/api';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  createdAt: string;
  status?: string;
}

interface UserProfile {
  role?: 'customer' | 'admin' | 'technician' | 'employee';
}

const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(true);

  // Verificar que el usuario sea admin
  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const profile = await authService.getProfile();
        const userData = profile.user || profile;
        
        if (userData.role !== 'admin') {
          setError('⛔ Acceso denegado. Solo los administradores pueden ver la lista de empleados.');
          setTimeout(() => navigate('/admin-dashboard'), 3000);
          return;
        }
        
        setUserProfile(userData);
      } catch (error) {
        console.error('Error verificando acceso:', error);
        navigate('/login');
      } finally {
        setIsVerifyingAccess(false);
      }
    };

    verifyAdminAccess();
  }, [navigate]);

  // Cargar lista de empleados
  useEffect(() => {
    const loadEmployees = async () => {
      if (!userProfile || userProfile.role !== 'admin') return;
      
      setIsLoading(true);
      try {
        // Llamada real al backend
        const response = await userService.getEmployees();
        console.log('✅ Empleados cargados desde el backend:', response);
        setEmployees(response);
      } catch (error) {
        console.error('❌ Error cargando empleados:', error);
        setError('Error al cargar la lista de empleados del backend');
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, [userProfile]);

  if (isVerifyingAccess) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
          <p>Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  if (userProfile?.role !== 'admin') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛔</div>
          <h2>Acceso Denegado</h2>
          <p>Solo los administradores pueden ver la lista de empleados.</p>
          {error && <p style={{ color: '#e53e3e', marginTop: '1rem' }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                👥 Lista de Empleados
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
                Gestiona y visualiza todos los empleados de TEDICS
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => navigate('/dashboard')} 
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                🏠 Volver al Dashboard
              </button>
              <button 
                onClick={() => navigate('/admin-dashboard')} 
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                ⚙️ Panel Admin
              </button>
              <button 
                onClick={() => navigate('/create-employee')} 
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                ➕ Crear Empleado
              </button>
            </div>
          </div>
        </div>

        {/* Mensajes de error */}
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

        {/* Loading */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p>Cargando empleados...</p>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', color: '#10b981' }}>👥</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {employees.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Empleados</div>
              </div>
            </div>

            {/* Tabla de empleados */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
                  Empleados Registrados
                </h3>
              </div>

              {employees.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                  <h3>No hay empleados registrados</h3>
                  <p>Comienza creando tu primer empleado</p>
                  <button
                    onClick={() => navigate('/create-employee')}
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    ➕ Crear Primer Empleado
                  </button>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Nombre</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Email</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Teléfono</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Rol</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Fecha Ingreso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, index) => (
                        <tr key={employee.id} style={{ 
                          borderBottom: '1px solid #e5e7eb',
                          backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb'
                        }}>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ fontWeight: '500', color: '#1f2937' }}>
                              {employee.firstName} {employee.lastName}
                            </div>
                            {employee.address && (
                              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                📍 {employee.address}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem', color: '#374151' }}>
                            {employee.email}
                          </td>
                          <td style={{ padding: '0.75rem', color: '#374151' }}>
                            {employee.phone || '-'}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              backgroundColor: employee.role === 'employee' ? '#dbeafe' : 
                                             employee.role === 'technician' ? '#e0e7ff' : '#f3e8ff',
                              color: employee.role === 'employee' ? '#1e40af' : 
                                     employee.role === 'technician' ? '#3730a3' : '#6b21a8'
                            }}>
                              {employee.role === 'employee' ? '👤 Empleado' : 
                               employee.role === 'technician' ? '🔧 Técnico' : employee.role}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', color: '#374151' }}>
                            {new Date(employee.createdAt).toLocaleDateString('es-GT')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeListPage;
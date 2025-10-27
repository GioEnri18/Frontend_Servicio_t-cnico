import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

interface UserProfile {
  role?: 'customer' | 'admin' | 'technician' | 'employee';
}

const CreateEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedRole, setSelectedRole] = useState('employee'); // Nuevo estado para el rol
  
  // Estados de validación y UI
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdEmployee, setCreatedEmployee] = useState<any>(null);
  
  // Control de acceso
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
          setError('⛔ Acceso denegado. Solo los administradores pueden crear empleados.');
          setTimeout(() => navigate('/dashboard'), 3000);
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

  // Validación de teléfono guatemalteco (8 dígitos)
  const validateGuatemalanPhone = (phoneNumber: string): string => {
    if (!phoneNumber) return 'Teléfono es requerido';
    
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    if (!/^\d{8}$/.test(cleanPhone)) {
      return 'El teléfono debe tener exactamente 8 dígitos numéricos';
    }
    
    return ''; // Válido
  };

  // Manejar cambio de teléfono
  const handlePhoneChange = (value: string) => {
    let processedValue = value.replace(/[^\d]/g, '');
    
    if (processedValue.length > 8) {
      processedValue = processedValue.slice(0, 8);
    }
    
    setPhone(processedValue);
    const error = validateGuatemalanPhone(processedValue);
    setPhoneError(error);
  };

  // Generar contraseña segura
  const generateSecurePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  // Manejar envío del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validaciones
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !phone.trim()) {
      setError('Todos los campos marcados con * son obligatorios');
      setIsLoading(false);
      return;
    }

    if (firstName.length < 2 || lastName.length < 2) {
      setError('El nombre y apellido deben tener al menos 2 caracteres');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    const phoneValidationError = validateGuatemalanPhone(phone);
    if (phoneValidationError) {
      setError(phoneValidationError);
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Formato de email inválido');
      setIsLoading(false);
      return;
    }

    try {
      // Preparar datos del empleado (rol seleccionado por admin)
      const employeeData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password,
        phone: phone.trim(),
        role: selectedRole, // ✅ Rol seleccionado en el formulario
        ...(address.trim() && { address: address.trim() })
      };

      console.log('🚀 Creando empleado:', { ...employeeData, password: '[OCULTA]' });
      
      const newEmployee = await authService.register(employeeData);
      
      setCreatedEmployee({ ...employeeData, id: newEmployee.id });
      setShowCredentials(true);
      const roleLabel = selectedRole === 'technician' ? 'Técnico' : 'Empleado';
      setSuccess(`✅ ${roleLabel} ${firstName} ${lastName} creado exitosamente`);
      
      // Limpiar formulario
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setAddress('');
      setSelectedRole('employee');
      
    } catch (error: any) {
      console.error('❌ Error creando empleado:', error.response?.data);
      
      let errorMessage = 'Error al crear el empleado';
      
      if (error.response?.status === 400) {
        const backendMessage = error.response?.data?.message;
        if (Array.isArray(backendMessage)) {
          errorMessage = 'Errores:\n• ' + backendMessage.join('\n• ');
        } else {
          errorMessage = backendMessage || 'Datos inválidos';
        }
      } else if (error.response?.status === 409) {
        errorMessage = '❌ Este email ya está registrado. Usa otro email corporativo.';
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        errorMessage = '⛔ No tienes permisos para crear empleados';
      } else {
        errorMessage = error.message || 'Error del servidor';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Copiar credenciales
  const copyCredentials = () => {
    const credentials = `Email: ${createdEmployee.email}\nContraseña: ${createdEmployee.password}`;
    navigator.clipboard.writeText(credentials).then(() => {
      alert('✅ Credenciales copiadas al portapapeles');
    });
  };

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
          <p>Solo los administradores pueden acceder a esta página.</p>
          {error && <p style={{ color: '#e53e3e', marginTop: '1rem' }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/admin-dashboard')} 
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            👥 Crear Nuevo Usuario
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
            Agrega empleados o técnicos al equipo de TEDICS
          </p>
        </div>

        {/* Mostrar credenciales si se creó exitosamente */}
        {showCredentials && createdEmployee && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #10b981',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#065f46', marginBottom: '1rem' }}>
              ✅ {createdEmployee?.role === 'technician' ? 'Técnico' : 'Empleado'} creado exitosamente
            </h3>
            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <p><strong>📧 Email:</strong> {createdEmployee.email}</p>
              <p><strong>🔑 Contraseña temporal:</strong> {createdEmployee.password}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={copyCredentials} style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                📋 Copiar Credenciales
              </button>
              <button onClick={() => setShowCredentials(false)} style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Crear Otro Usuario
              </button>
            </div>
          </div>
        )}

        {/* Formulario principal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          
          {/* Nota informativa */}
          <div style={{
            fontSize: '0.875rem',
            color: '#666',
            marginBottom: '1.5rem',
            padding: '0.75rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            📝 <strong>Nota:</strong> Los campos marcados con asterisco (*) son obligatorios
          </div>

          {/* Mensajes de error/éxito */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              whiteSpace: 'pre-line'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: '#d1fae5',
              color: '#059669',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Nombre y Apellido */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="Juan"
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Apellido *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Email Corporativo *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="juan.perez@tedics.com"
                required
              />
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Usa el email corporativo del empleado
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Contraseña Temporal *
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={generateSecurePassword}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🎲 Generar
                </button>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                ⚠️ Esta es una contraseña temporal. El empleado deberá cambiarla al iniciar sesión
              </div>
            </div>

            {/* Rol del Usuario */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Tipo de Usuario *
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
                required
              >
                <option value="employee">👤 Empleado - Acceso general al sistema</option>
                <option value="technician">🔧 Técnico - Especialista en servicios técnicos</option>
              </select>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {selectedRole === 'employee' 
                  ? 'Empleado: Puede ver clientes y cotizaciones, acceso estándar' 
                  : 'Técnico: Especialista en servicios, puede gestionar trabajos técnicos'}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Teléfono de Contacto * 🇬🇹 Guatemala
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: phoneError ? '1px solid #e53e3e' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="12345678"
                maxLength={8}
                required
              />
              {phoneError ? (
                <div style={{ fontSize: '0.75rem', color: '#e53e3e', marginTop: '0.25rem' }}>
                  {phoneError}
                </div>
              ) : (
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Solo 8 dígitos numéricos (ej: 12345678)
                </div>
              )}
            </div>

            {/* Dirección (Opcional) */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Dirección (Opcional)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Dirección completa del empleado"
              />
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: isLoading ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '1rem'
              }}
            >
              {isLoading 
                ? `⏳ Creando ${selectedRole === 'technician' ? 'Técnico' : 'Empleado'}...` 
                : `✅ Crear ${selectedRole === 'technician' ? 'Técnico' : 'Empleado'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeePage;
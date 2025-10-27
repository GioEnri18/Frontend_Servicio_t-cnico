import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [phoneError, setPhoneError] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Validación de teléfono guatemalteco (solo 8 dígitos)
  const validateGuatemalanPhone = (phoneNumber: string): string => {
    if (!phoneNumber) return 'Teléfono es requerido';
    
    // Remover espacios, guiones y paréntesis
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Solo acepta exactamente 8 dígitos numéricos
    if (!/^\d{8}$/.test(cleanPhone)) {
      return 'El teléfono debe tener exactamente 8 dígitos numéricos';
    }
    
    return ''; // Válido
  };

  // Manejar cambio de teléfono guatemalteco (solo 8 dígitos)
  const handlePhoneChange = (value: string) => {
    // Remover todo excepto números
    let processedValue = value.replace(/[^\d]/g, '');
    
    // Limitar a máximo 8 dígitos
    if (processedValue.length > 8) {
      processedValue = processedValue.slice(0, 8);
    }
    
    setPhone(processedValue);
    const error = validateGuatemalanPhone(processedValue);
    setPhoneError(error);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validaciones básicas
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !company.trim() || !phone.trim()) {
      setError('Todos los campos marcados con * son obligatorios');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    // Validar teléfono guatemalteco
    const phoneValidationError = validateGuatemalanPhone(phone);
    if (phoneValidationError) {
      setError(phoneValidationError);
      setIsLoading(false);
      return;
    }

    try {
      // El backend espera exactamente 8 dígitos sin código de país
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password,
        company: company.trim(),
        phone: phone.trim(), // Solo 8 dígitos, sin código de país
        ...(address.trim() && { address: address.trim() })
      };

      console.log('🚀 Datos que se envían al backend:', userData);
      await authService.register(userData);
      
      setSuccess(`¡Bienvenido ${firstName}! Tu cuenta ha sido creada exitosamente. Redirigiendo al login...`);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      console.log('❌ Error completo:', error.response?.data);
      console.log('❌ Status:', error.response?.status);
      
      let errorMessage = 'Error en el registro';
      
      if (error.response?.status === 400) {
        const backendMessage = error.response?.data?.message;
        console.log('❌ Mensaje del backend:', backendMessage);
        
        if (Array.isArray(backendMessage)) {
          // Traducir mensajes comunes del backend
          const translatedMessages = backendMessage.map(msg => {
            if (msg.includes('phone must be a valid phone number')) {
              return 'Formato de teléfono inválido para Guatemala: +50212345678';
            }
            if (msg.includes('email must be an email')) {
              return 'Formato de email inválido';
            }
            if (msg.includes('password')) {
              return 'La contraseña debe tener al menos 6 caracteres';
            }
            return msg;
          });
          errorMessage = 'Errores:\n• ' + translatedMessages.join('\n• ');
        } else {
          errorMessage = backendMessage || 'Datos inválidos';
        }
      } else if (error.response?.status === 409) {
        errorMessage = 'Este email ya está registrado';
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose en puerto 3000';
      }
      
      setError(errorMessage);
    }
    
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Panel Izquierdo */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' 
      }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>TEDICS</div>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Regístrate como Cliente</h1>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            Gestiona tus solicitudes de servicio técnico de manera eficiente.
            Únete a nuestra plataforma y accede a servicios especializados.
          </p>
          <Link 
            to="/login" 
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              border: '2px solid white',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = 'white';
            }}
          >
            ← Volver al Login
          </Link>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div style={{ 
        flex: 1, 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        background: 'white',
        overflowY: 'auto'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>Crear Cuenta Empresarial</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            Completa los siguientes campos para registrarte como cliente
          </p>

          {error && (
            <div style={{
              background: 'rgba(231, 76, 60, 0.1)',
              border: '1px solid rgba(231, 76, 60, 0.3)',
              color: '#e74c3c',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(46, 204, 113, 0.1)',
              border: '1px solid rgba(46, 204, 113, 0.3)',
              color: '#27ae60',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {success}
            </div>
          )}

          {/* Nota sobre campos obligatorios */}
          <div style={{ 
            fontSize: '0.875rem', 
            color: '#666', 
            marginBottom: '1rem', 
            padding: '0.75rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            📝 <strong>Nota:</strong> Los campos marcados con asterisco (*) son obligatorios
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Nombre y Apellido */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                  Apellido *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="tu@empresa.com"
                required
              />
            </div>

            {/* Contraseñas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                  Contraseña *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="Repite la contraseña"
                  required
                />
              </div>
            </div>

            {/* Empresa */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Ej: Empresa XYZ S.L."
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                Teléfono de Contacto * 🇬🇹 Guatemala
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: phoneError ? '1px solid #e53e3e' : '1px solid #ddd',
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
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                  Obligatorio: Solo 8 dígitos numéricos (ej: 12345678)
                </div>
              )}
            </div>

            {/* Dirección (Opcional) */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                Dirección (Opcional)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Dirección completa de la empresa"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '1rem'
              }}
            >
              {isLoading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
            ¿Ya tienes una cuenta? <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>Inicia sesión aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
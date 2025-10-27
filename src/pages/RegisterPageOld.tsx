import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import styles from './LoginPage.module.css';

// --- Iconos SVG ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="2" y1="2" x2="22" y2="22"></line>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
    <path d="M6 12h4h4"></path>
    <path d="M6 20h4h4"></path>
    <path d="M10 6h4"></path>
    <path d="M10 10h4"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const RegisterPage: React.FC = () => {
  // Estados para campos OBLIGATORIOS
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  
  // Estados para campos OPCIONALES
  const [address, setAddress] = useState('');
  
  // Estados de UI
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de validación
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [isFormValid, setIsFormValid] = useState(false);
  
  const navigate = useNavigate();

  // Validación de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de teléfono
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  // Calcular fortaleza de contraseña
  const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 6) return 'weak';
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };

  // Validar campo individual
  const validateField = (fieldName: string, value: string, comparePassword?: string): string => {
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return `${fieldName === 'firstName' ? 'Nombre' : 'Apellido'} es obligatorio`;
        if (value.length < 2) return `${fieldName === 'firstName' ? 'Nombre' : 'Apellido'} debe tener al menos 2 caracteres`;
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Solo se permiten letras y espacios';
        break;
      case 'email':
        if (!value.trim()) return 'Email es obligatorio';
        if (!validateEmail(value)) return 'Formato de email inválido';
        break;
      case 'password':
        if (!value) return 'Contraseña es obligatoria';
        if (value.length < 6) return 'Contraseña debe tener al menos 6 caracteres';
        break;
      case 'confirmPassword':
        if (!value) return 'Confirmación de contraseña es obligatoria';
        const passwordToCompare = comparePassword || password;
        if (value !== passwordToCompare) return 'Las contraseñas no coinciden';
        break;
      case 'company':
        if (!value.trim()) return 'Nombre de la empresa es obligatorio';
        if (value.length < 2) return 'Nombre de empresa debe tener al menos 2 caracteres';
        break;
      case 'phone':
        if (!value.trim()) return 'Teléfono es obligatorio';
        if (!validatePhone(value)) return 'Formato de teléfono inválido (ej: +34612345678)';
        break;
      case 'address':
        if (value.trim() && value.length < 10) return 'Dirección debe tener al menos 10 caracteres';
        break;
    }
    return '';
  };

  // Validar formulario completo
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    const fields = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      company,
      phone,
      address
    };
    
    Object.entries(fields).forEach(([fieldName, value]) => {
      const error = fieldName === 'confirmPassword' 
        ? validateField(fieldName, value, password)
        : validateField(fieldName, value);
      if (error) errors[fieldName] = error;
    });
    
    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  // Manejar cambios en campos con validación en tiempo real
  const handleFieldChange = (fieldName: string, value: string) => {
    // Actualizar el estado del campo
    switch (fieldName) {
      case 'firstName': setFirstName(value); break;
      case 'lastName': setLastName(value); break;
      case 'email': setEmail(value); break;
      case 'password': 
        setPassword(value);
        setPasswordStrength(calculatePasswordStrength(value));
        break;
      case 'confirmPassword': setConfirmPassword(value); break;
      case 'company': setCompany(value); break;
      case 'phone': setPhone(value); break;
      case 'address': setAddress(value); break;
    }
    
    // Validar campo individual
    const error = fieldName === 'confirmPassword'
      ? validateField(fieldName, value, password)
      : validateField(fieldName, value);
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    // Revalidar formulario después de un pequeño delay
    setTimeout(validateForm, 100);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validar formulario completo
    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario');
      setIsLoading(false);
      return;
    }

    try {
      // Preparar datos para el backend (SIN el campo role)
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password,
        company: company.trim(),
        phone: phone.trim(),
        ...(address.trim() && { address: address.trim() }) // Solo incluir si no está vacío
      };

      await authService.register(userData);
      
      setSuccess(`¡Bienvenido ${firstName}! Tu cuenta ha sido creada exitosamente. Redirigiendo al login...`);
      
      // Redirigir al login después de 3 segundos para que se lea el mensaje
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      let errorMessage = 'Error en el registro';
      
      if (error.response?.status === 400) {
        const backendMessage = error.response?.data?.message;
        if (Array.isArray(backendMessage)) {
          errorMessage = backendMessage.join(', ');
        } else {
          errorMessage = backendMessage || 'Datos inválidos';
        }
      } else if (error.response?.status === 409) {
        errorMessage = 'Este email ya está registrado';
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose en puerto 3000';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Error interno del servidor';
      }
      
      setError(errorMessage);
    }
    
    setIsLoading(false);
  };

  return (
    <div className={styles.loginPage} style={{ minHeight: '100vh', display: 'flex' }}>
      <div className={styles.leftPanel} style={{ flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className={styles.logo} style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>TEDICS</div>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Regístrate como Cliente</h1>
          <p className={styles.welcomeSubtitle} style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            Gestiona tus solicitudes de servicio técnico de manera eficiente.
            Únete a nuestra plataforma y accede a servicios especializados.
          </p>
        </div>
      </div>

      <div className={styles.rightPanel} style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white' }}>
        <div className={styles.loginForm}>
          <h2 className={styles.loginTitle}>Crear Cuenta Empresarial</h2>
          <p className={styles.loginSubtitle}>Completa los siguientes campos para registrarte como cliente</p>

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

          <form onSubmit={handleSubmit}>
            {/* Fila 1: Nombre y Apellido */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Nombre *</label>
                <div className={styles.inputContainer}>
                  <UserIcon />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    className={`${styles.input} ${validationErrors.firstName ? 'error' : ''}`}
                    placeholder="Tu nombre"
                    required
                    aria-describedby={validationErrors.firstName ? 'firstName-error' : undefined}
                  />
                </div>
                {validationErrors.firstName && (
                  <div id="firstName-error" role="alert" style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {validationErrors.firstName}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Apellido *</label>
                <div className={styles.inputContainer}>
                  <UserIcon />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    className={`${styles.input} ${validationErrors.lastName ? 'error' : ''}`}
                    placeholder="Tu apellido"
                    required
                    aria-describedby={validationErrors.lastName ? 'lastName-error' : undefined}
                  />
                </div>
                {validationErrors.lastName && (
                  <div id="lastName-error" role="alert" style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {validationErrors.lastName}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Correo Electrónico *</label>
              <div className={styles.inputContainer}>
                <MailIcon />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className={`${styles.input} ${validationErrors.email ? 'error' : ''}`}
                  placeholder="tu@empresa.com"
                  required
                  aria-describedby={validationErrors.email ? 'email-error' : undefined}
                />
              </div>
              {validationErrors.email && (
                <div id="email-error" role="alert" style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {validationErrors.email}
                </div>
              )}
            </div>

            {/* Fila 2: Contraseña y Confirmar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Contraseña *</label>
                <div className={styles.inputContainer}>
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className={styles.eyeButton}
                  >
                    {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    className={`${styles.input} ${validationErrors.password ? 'error' : ''}`}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    aria-describedby="password-help password-error"
                  />
                </div>
                
                {/* Indicador de fortaleza de contraseña */}
                {password && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <div style={{ 
                        flex: 1, 
                        height: '4px', 
                        backgroundColor: passwordStrength === 'weak' ? '#e74c3c' : passwordStrength === 'medium' ? '#f39c12' : '#27ae60',
                        borderRadius: '2px'
                      }}></div>
                      <div style={{ 
                        flex: 1, 
                        height: '4px', 
                        backgroundColor: passwordStrength === 'medium' || passwordStrength === 'strong' ? (passwordStrength === 'medium' ? '#f39c12' : '#27ae60') : '#ecf0f1',
                        borderRadius: '2px'
                      }}></div>
                      <div style={{ 
                        flex: 1, 
                        height: '4px', 
                        backgroundColor: passwordStrength === 'strong' ? '#27ae60' : '#ecf0f1',
                        borderRadius: '2px'
                      }}></div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: passwordStrength === 'weak' ? '#e74c3c' : passwordStrength === 'medium' ? '#f39c12' : '#27ae60' }}>
                      Fortaleza: {passwordStrength === 'weak' ? 'Débil' : passwordStrength === 'medium' ? 'Media' : 'Fuerte'}
                    </div>
                  </div>
                )}
                
                <div id="password-help" style={{ fontSize: '0.75rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
                  Mínimo 6 caracteres. Usa mayúsculas, números y símbolos para mayor seguridad.
                </div>
                
                {validationErrors.password && (
                  <div id="password-error" role="alert" style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {validationErrors.password}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Confirmar Contraseña *</label>
                <div className={styles.inputContainer}>
                  <button
                    type="button"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    className={styles.eyeButton}
                  >
                    {confirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                  <input
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                    className={`${styles.input} ${validationErrors.confirmPassword ? 'error' : ''}`}
                    placeholder="Repite la contraseña"
                    required
                    aria-describedby={validationErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                  />
                  
                  {/* Indicador visual de coincidencia */}
                  {confirmPassword && (
                    <div style={{ 
                      position: 'absolute', 
                      right: '2.5rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: password === confirmPassword ? '#27ae60' : '#e74c3c'
                    }}>
                      {password === confirmPassword ? '✓' : '✗'}
                    </div>
                  )}
                </div>
                
                {validationErrors.confirmPassword && (
                  <div id="confirmPassword-error" role="alert" style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {validationErrors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            {/* Empresa */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Nombre de la Empresa *</label>
              <div className={styles.inputContainer}>
                <BuildingIcon />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  className={`${styles.input} ${validationErrors.company ? 'error' : ''}`}
                  placeholder="Ej: Empresa XYZ S.L."
                  required
                  aria-describedby="company-help company-error"
                />
              </div>
              <div id="company-help" style={{ fontSize: '0.75rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
                Nombre oficial de tu empresa
              </div>
              {validationErrors.company && (
                <div id="company-error" role="alert" style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {validationErrors.company}
                </div>
              )}
            </div>

            {/* Teléfono */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Teléfono de Contacto *</label>
              <div className={styles.inputContainer}>
                <PhoneIcon />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className={`${styles.input} ${validationErrors.phone ? 'error' : ''}`}
                  placeholder="+34612345678"
                  required
                  aria-describedby="phone-help phone-error"
                />
              </div>
              <div id="phone-help" style={{ fontSize: '0.75rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
                Incluye código de país (ej: +34 para España)
              </div>
              {validationErrors.phone && (
                <div id="phone-error" role="alert" style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {validationErrors.phone}
                </div>
              )}
            </div>

            {/* Dirección (Opcional) */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Dirección (Opcional)</label>
              <div className={styles.inputContainer}>
                <MapPinIcon />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className={`${styles.input} ${validationErrors.address ? 'error' : ''}`}
                  placeholder="Dirección completa de la empresa"
                  aria-describedby={validationErrors.address ? 'address-error' : undefined}
                />
              </div>
              {validationErrors.address && (
                <div id="address-error" role="alert" style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {validationErrors.address}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading || !isFormValid}
              style={{
                opacity: isLoading || !isFormValid ? 0.6 : 1,
                cursor: isLoading || !isFormValid ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className={styles.registerLink}>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
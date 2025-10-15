// ruta: frontend/src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import apiClient from '../services/api';
import styles from './LoginPage.module.css'; // Reutilizamos los estilos del Login

// --- Iconos SVG (reutilizados para consistencia) ---
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

const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MapPinIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [company, setCompany] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await apiClient.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        company,
        role: 'customer'
      });
      
      setSuccess('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      // Opcional: redirigir al login después de unos segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.screenBorder}></div>

      <div className={styles.logoContainer}>
        <span className={styles.logoText}>TEDICS</span>
      </div>

      {/* Panel izquierdo decorativo */}
      <div className={styles.leftPanel}>
        <div className={styles.decorativeElements}>
          <div className={styles.decorativeCircle}></div>
          <div className={styles.decorativeCircle}></div>
          <div className={styles.decorativeCircle}></div>
        </div>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>Únete a nosotros</h1>
          <p className={styles.welcomeSubtitle}>
            Crea tu cuenta y accede a nuestros servicios técnicos especializados. ¡Es rápido y fácil!
          </p>
        </div>
      </div>

      <div className={styles.loginContainer}>
        <h1 className={styles.title}>Crear nueva cuenta</h1>
        <p className={styles.subtitle}>
          ¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><UserIcon /></span>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className={styles.formControl}
              placeholder="Nombres"
            />
          </div>

          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><UserIcon /></span>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className={styles.formControl}
              placeholder="Apellidos"
            />
          </div>

          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><MailIcon /></span>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.formControl}
              placeholder="Email"
            />
          </div>

          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><UserIcon /></span> {/* Reusing UserIcon for company for now */}
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={styles.formControl}
              placeholder="Empresa (Opcional)"
            />
          </div>

          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><PhoneIcon /></span>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className={styles.formControl}
              placeholder="Teléfono"
            />
          </div>

          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><MapPinIcon /></span>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className={styles.formControl}
              placeholder="Dirección"
            />
          </div>

          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><EyeIcon /></span>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.formControl}
              placeholder="Contraseña"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {error && <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>{error}</p>}
          {success && <p style={{ color: '#28a745', marginBottom: '1rem' }}>{success}</p>}

          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>
      </div>

      <a href="/about" className={styles.aboutLink}>
        Quiénes somos
      </a>
    </div>
  );
};

export default RegisterPage;
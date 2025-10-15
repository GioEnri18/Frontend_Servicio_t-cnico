// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './LoginPage.module.css';

// Iconos
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
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
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password: password, // no trim para no romper contraseñas con espacios
      };
      await login(payload);
      navigate('/'); // o '/admin' según tu ruta protegida principal
    } catch (err: any) {
      // Extrae mensaje del backend si existe
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (Array.isArray(err?.response?.data?.messages) ? err.response.data.messages.join(', ') : null);

      setError(backendMsg || 'Credenciales incorrectas o error del servidor.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToAbout = () => {
    navigate('/about');
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
          <h1 className={styles.welcomeTitle}>Bienvenido</h1>
          <p className={styles.welcomeSubtitle}>
            Accede a tu panel de servicio técnico y gestiona todas tus solicitudes de manera eficiente.
          </p>
        </div>
      </div>

      <div className={styles.loginContainer}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        <p className={styles.subtitle}>
          ¿Aún no tienes una cuenta?{' '}
          <Link to="/register" className={styles.registerLink}>
            Crear nueva cuenta
          </Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><UserIcon /></span>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.formControl}
              placeholder="Usuario o Email"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><EyeIcon /></span>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.formControl}
              placeholder="Contraseña"
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setPasswordVisible((v) => !v)}
              aria-label={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>

      <button onClick={handleNavigateToAbout} className={styles.aboutLink}>
        Quiénes somos
      </button>
    </div>
  );
};

export default LoginPage;

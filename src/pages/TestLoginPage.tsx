// Página de prueba para verificar navegación sin backend
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

const TestLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simular carga
    setTimeout(() => {
      // Simular token guardado
      localStorage.setItem('jwt_token', 'test-token-123');
      // Navegar al dashboard
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.screenBorder}></div>
      <div className={styles.logoContainer}>
        <span className={styles.logoText}>TEDICS</span>
      </div>
      
      <div className={styles.leftPanel}>
        <div className={styles.decorativeElements}>
          <div className={styles.decorativeCircle}></div>
          <div className={styles.decorativeCircle}></div>
          <div className={styles.decorativeCircle}></div>
        </div>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>Bienvenido</h1>
          <p className={styles.welcomeSubtitle}>
            Página de prueba - Navega sin backend
          </p>
        </div>
      </div>

      <div className={styles.loginContainer}>
        <h1 className={styles.title}>Test Login</h1>
        <p className={styles.subtitle}>
          Prueba de navegación (sin backend)
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><UserIcon /></span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.formControl}
              placeholder="test@ejemplo.com"
            />
          </div>
          
          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><EyeIcon /></span>
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.formControl}
              placeholder="123456"
            />
            <button type="button" className={styles.passwordToggle} onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          
          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? 'Navegando...' : 'Ir al Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestLoginPage;
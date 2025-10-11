import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import styles from './LoginPage.module.css';

// --- Iconos ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@tedics.com');
  const [password, setPassword] = useState('tedics123');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    console.log('🔄 Iniciando login híbrido (backend + fallback)...', { email, password });

    try {
      // Intentar autenticación con el backend primero
      console.log('🔄 Intentando login con backend...');
      const response = await authService.login(email, password);
      console.log('✅ Respuesta del backend:', response);
      
      const { token, access_token, user } = response;
      const authToken = token || access_token;
      
      if (authToken) {
        console.log('✅ Login con backend exitoso');
        localStorage.setItem('jwt_token', authToken);
        localStorage.setItem('user_email', user?.email || email);
        if (user) {
          localStorage.setItem('user_data', JSON.stringify(user));
        }
        navigate('/dashboard');
        return;
      }
    } catch (error: any) {
      console.log('⚠️ Backend no disponible, usando fallback local...');
      
      // Fallback: Verificar credenciales predefinidas
      if (email === 'admin@tedics.com' && password === 'tedics123') {
        console.log('✅ Credenciales válidas, usando autenticación local');
        
        // Simular una pequeña espera para mostrar el loading
        setTimeout(() => {
          localStorage.setItem('jwt_token', 'demo-token-tedics-2025');
          localStorage.setItem('user_email', email);
          localStorage.setItem('user_data', JSON.stringify({
            id: 1,
            email: email,
            name: 'Administrador TEDICS',
            role: 'admin'
          }));
          
          setIsLoading(false);
          navigate('/dashboard');
        }, 1000);
        
        return;
      } else {
        // Credenciales incorrectas en modo fallback
        setError('Credenciales incorrectas. Backend no disponible. Usa: admin@tedics.com / tedics123');
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);
  };

  const handleNavigateToAbout = () => {
    navigate('/about');
  };

  // Función de test para bypassed login
  const handleTestLogin = () => {
    console.log('🚀 Test login directo');
    localStorage.setItem('jwt_token', 'demo-token-tedics-2025');
    localStorage.setItem('user_email', 'admin@tedics.com');
    navigate('/dashboard');
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
          ¿Aún no tienes una cuenta? <a href="/register">Crear nueva cuenta</a>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <span className={styles.inputIcon}><UserIcon /></span>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className={styles.formControl} 
              placeholder="Usuario o Email" 
            />
          </div>
          
          <div className={styles.formGroup}>
            <span className={styles.inputIcon}>
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className={styles.eyeButton}
              >
                {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </span>
            <input 
              type={passwordVisible ? "text" : "password"} 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className={styles.formControl} 
              placeholder="Contraseña" 
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" disabled={isLoading} className={styles.loginButton}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className={styles.additionalLinks}>
          <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
          <br />
          <button onClick={handleNavigateToAbout} className={styles.linkButton}>
            Sobre Nosotros
          </button>
        </div>

        {/* Debug Info */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.8)'
        }}>
          <strong>🔧 Debug Info:</strong><br/>
          Email: {email}<br/>
          Password: {password ? '•'.repeat(password.length) : '(vacío)'}<br/>
          Loading: {isLoading ? 'Sí' : 'No'}<br/>
          Error: {error || 'Ninguno'}<br/>
          <button 
            onClick={() => {
              console.log('🔍 Estado actual:', { email, password, isLoading, error });
              console.log('🔍 localStorage:', {
                jwt_token: localStorage.getItem('jwt_token'),
                user_email: localStorage.getItem('user_email')
              });
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.3rem 0.6rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontSize: '0.7rem',
              cursor: 'pointer',
              marginRight: '0.5rem'
            }}
          >
            Log Debug Info
          </button>
          <button 
            onClick={handleTestLogin}
            style={{
              padding: '0.3rem 0.6rem',
              background: 'rgba(46, 204, 113, 0.8)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontSize: '0.7rem',
              cursor: 'pointer'
            }}
          >
            🚀 Test Login (Bypass)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
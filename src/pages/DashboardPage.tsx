import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar Link y useNavigate
import { authService } from '../services/api';
import styles from './DashboardPage.module.css';

// --- Iconos SVG (sin cambios) ---
const MenuIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const FacebookIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const TwitterIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>;
const TikTokIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12a4 4 0 1 0 4 4V8.5a4.5 4.5 0 1 1 4.5 4.5V12a10 10 0 1 0-10-10V8.5a4.5 4.5 0 1 1 4.5 4.5V12"></path></svg>;

// --- Tipos y datos simulados ---
interface Service {
  id: string;
  name: string;
  slug: string;
}

interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  role?: 'customer' | 'admin' | 'technician' | 'employee';
}

const mockServices: Service[] = [
  { id: '1', name: 'Instalación Eléctrica Residencial', slug: 'instalacion-electrica-residencial' },
  { id: '2', name: 'Mantenimiento Preventivo de Redes', slug: 'mantenimiento-preventivo-de-redes' },
  { id: '3', name: 'Configuración de Cámaras de Seguridad', slug: 'configuracion-camaras-de-seguridad' },
  { id: '4', name: 'Soporte Técnico Remoto', slug: 'soporte-tecnico-remoto' },
];

const DashboardPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate(); // Inicializar useNavigate

  // Cargar perfil del usuario para verificar si es admin
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (token) {
          const profile = await authService.getProfile();
          const userData = profile.user || profile;
          setUserProfile(userData);
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
      }
    };

    loadUserProfile();
  }, []);

  // Simulación de la llamada a la API GET /services
  useEffect(() => {
    setServices(mockServices);
  }, []);

  return (
    <div className={styles.dashboardPage}>
      {/* --- Barra de Navegación --- */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuButton} aria-label="Abrir menú">
            <MenuIcon />
          </button>
        </div>
        <nav className={styles.headerNav}>
          <Link to="/dashboard">Inicio</Link>
          
          {/* --- Menú Desplegable de Servicios --- */}
          <div className={styles.navItemContainer}>
            <span className={styles.navItem}>Servicios</span>
            <div className={styles.dropdownMenu}>
              {services.map((service) => (
                <Link key={service.id} to={`/services/${service.slug}`} className={styles.dropdownLink}>
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/cotizaciones">Cotizaciones</Link>
          <Link to="/clientes">Clientes</Link>
        </nav>
        <div className={styles.headerRight}>
          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}><SearchIcon /></span>
            <input type="search" placeholder="Buscar..." className={styles.searchInput} />
          </div>
          <button onClick={() => navigate('/profile')} className={styles.profileButton}>Perfil</button>
        </div>
      </header>

      <main>
        {/* --- Sección de Administración (Solo Admin) --- */}
        {userProfile?.role === 'admin' && (
          <section style={{
            backgroundColor: '#f0f9ff',
            padding: '1.5rem',
            margin: '1rem 0',
            borderRadius: '12px',
            border: '1px solid #0ea5e9'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ 
                color: '#0369a1', 
                marginBottom: '1rem',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                👑 Panel de Administración
              </h3>
              <p style={{ 
                color: '#0c4a6e', 
                marginBottom: '1.5rem',
                fontSize: '1rem'
              }}>
                Bienvenido Administrador. Gestiona tu empresa desde aquí.
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => navigate('/create-employee')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  ➕ Crear Empleado
                </button>
                
                <button
                  onClick={() => navigate('/admin-dashboard')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  🏢 Dashboard Admin
                </button>
                
                <button
                  onClick={() => navigate('/employee-list')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📋 Ver Empleados
                </button>

                <button
                  onClick={() => navigate('/clientes')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  � Ver Clientes
                </button>
              </div>
            </div>
          </section>
        )}

        {/* --- Sección para Empleados (Solo Employee) --- */}
        {userProfile?.role === 'employee' && (
          <section style={{
            backgroundColor: '#eff6ff',
            padding: '1.5rem',
            margin: '1rem 0',
            borderRadius: '12px',
            border: '1px solid #3b82f6'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ 
                color: '#1d4ed8', 
                marginBottom: '1rem',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                👤 Panel de Empleado
              </h3>
              <p style={{ 
                color: '#1e40af', 
                marginBottom: '1.5rem',
                fontSize: '1rem'
              }}>
                Accede a la información de clientes y gestiona los servicios.
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => navigate('/clientes')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  👥 Ver Clientes
                </button>
                
                <button
                  onClick={() => navigate('/cotizaciones')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  💰 Cotizaciones
                </button>
              </div>
            </div>
          </section>
        )}

        {/* --- Sección Superior (Hero) --- */}
        <section className={styles.heroSection}>
          <div className={styles.heroLeft}>
            {/* Botón de cotización solo para clientes */}
            {userProfile?.role === 'customer' && (
              <button 
                className={styles.quoteButton}
                onClick={() => navigate('/cotizaciones')}
              >
                Cotiza tu servicio
              </button>
            )}
            {/* Mensaje para no-clientes */}
            {userProfile?.role && userProfile.role !== 'customer' && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#6b7280',
                marginBottom: '1rem'
              }}>
                <p>Vista de {userProfile.role === 'admin' ? 'Administrador' : 'Empleado'}</p>
              </div>
            )}
            <div className={styles.aboutBox}>
              <h3>Sobre Nosotros</h3>
              <p>En TEDICS, transformamos tus desafíos tecnológicos en soluciones eficientes y robustas...</p>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.logoSloganContainer}>
              <div className={styles.logo}><span>TEDICS</span></div>
              <p className={styles.slogan}>Soluciones Tecnológicas a tu Medida</p>
            </div>
          </div>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook"><FacebookIcon /></a>
            <a href="#" aria-label="Twitter"><TwitterIcon /></a>
            <a href="#" aria-label="TikTok"><TikTokIcon /></a>
          </div>
        </section>

        {/* --- Sección "Trabajos realizados" --- */}
        <section className={styles.worksSection}>
          <h2 className={styles.worksTitle}>Trabajos realizados</h2>
          <div className={styles.cardsContainer}>
            <div className={styles.workCard}>
              <h3 className="companyName">Instalación de Cámaras</h3>
              <img src="/Tedics/IMG-20251025-WA0002.jpg" alt="Instalación de Cámaras 1" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
              <img src="/Tedics/IMG-20251025-WA0003.jpg" alt="Instalación de Cámaras 2" style={{ width: '100%', borderRadius: '8px' }} />
            </div>
            <div className={styles.workCard}>
              <h3 className="companyName">Instalación de Lavadoras</h3>
              <img src="/Tedics/IMG-20251025-WA0010.jpg" alt="Instalación de Lavadoras 1" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
              <img src="/Tedics/IMG-20251025-WA0011.jpg" alt="Instalación de Lavadoras 2" style={{ width: '100%', borderRadius: '8px' }} />
            </div>
            <div className={styles.workCard}>
              <h3 className="companyName">Servicios</h3>
              <img src="/Tedics/IMG-20251025-WA0020.jpg" alt="Servicios 1" style={{ width: '100%', borderRadius: '8px' }} />
            </div>
            <div className={styles.workCard}>
              <h3 className="companyName">Instalación Industrial</h3>
              <img src="/Tedics/IMG-20251025-WA0030.jpg" alt="Instalación Industrial 1" style={{ width: '100%', borderRadius: '8px' }} />
            </div>
          </div>
          <button className={styles.loadMoreButton}>Descubre más clientes satisfechos</button>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
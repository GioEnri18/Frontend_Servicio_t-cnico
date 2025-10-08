import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar Link y useNavigate
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

const mockServices: Service[] = [
  { id: '1', name: 'Instalación Eléctrica Residencial', slug: 'instalacion-electrica-residencial' },
  { id: '2', name: 'Mantenimiento Preventivo de Redes', slug: 'mantenimiento-preventivo-de-redes' },
  { id: '3', name: 'Configuración de Cámaras de Seguridad', slug: 'configuracion-camaras-de-seguridad' },
  { id: '4', name: 'Soporte Técnico Remoto', slug: 'soporte-tecnico-remoto' },
];

const DashboardPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate(); // Inicializar useNavigate

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
          <Link to="/customers">Clientes</Link>
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
        {/* --- Sección Superior (Hero) --- */}
        <section className={styles.heroSection}>
          <div className={styles.heroLeft}>
            <button className={styles.quoteButton}>Cotiza tu servicio</button>
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
            {/* ... (Tarjetas de trabajos sin cambios) ... */}
          </div>
          <button className={styles.loadMoreButton}>Descubre más clientes satisfechos</button>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
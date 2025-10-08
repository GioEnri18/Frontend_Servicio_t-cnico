// ruta: frontend/src/pages/ServiceDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './ServiceDetailPage.module.css';

// --- Iconos SVG ---
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
);

// --- Interfaces y Datos Simulados ---

interface Service {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceBase: number;
  imageUrl: string;
}

// Base de datos simulada de servicios
const allServices: Service[] = [
  { 
    id: '1', 
    slug: 'instalacion-electrica-residencial', 
    name: 'Instalación Eléctrica Residencial', 
    category: 'Electricidad',
    description: 'Servicio completo de instalación eléctrica para nuevas construcciones o remodelaciones. Incluye diseño del plano, cableado estructurado, instalación de paneles, interruptores y tomacorrientes, cumpliendo con todas las normativas de seguridad vigentes.',
    priceBase: 2500.00,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop'
  },
  { 
    id: '2', 
    slug: 'mantenimiento-preventivo-de-redes', 
    name: 'Mantenimiento Preventivo de Redes', 
    category: 'Redes y Conectividad',
    description: 'Asegura la continuidad operativa de tu empresa con nuestro plan de mantenimiento preventivo. Realizamos diagnósticos de red, optimización de switches y routers, y aseguramos la estabilidad de la conexión para evitar fallos inesperados.',
    priceBase: 850.50,
    imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    id: '3', 
    slug: 'configuracion-camaras-de-seguridad', 
    name: 'Configuración de Cámaras de Seguridad', 
    category: 'Seguridad',
    description: 'Instalación y configuración profesional de sistemas de videovigilancia (CCTV). Ofrecemos soluciones con acceso remoto, almacenamiento en la nube y cámaras de alta definición para la protección de tu hogar o negocio.',
    priceBase: 1800.00,
    imageUrl: 'https://images.unsplash.com/photo-1617814086920-9a4d7b7c42d0?q=80&w=1935&auto=format&fit=crop'
  },
  // Añade más servicios si es necesario
];

// --- Componente Principal ---

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulación de la llamada a la API GET /services/:id
    const fetchService = () => {
      const foundService = allServices.find(s => s.slug === slug);
      
      setTimeout(() => { // Simular latencia de red
        if (foundService) {
          setService(foundService);
        } else {
          setError('Servicio no encontrado.');
        }
        setLoading(false);
      }, 500);
    };

    fetchService();
  }, [slug]);

  const handleQuoteRedirect = () => {
    if (service) {
      // Redirige al formulario de cotización y pasa la información del servicio
      navigate('/quotations/new', { 
        state: { 
          serviceId: service.id,
          serviceName: service.name,
          serviceSlug: service.slug
        } 
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.serviceDetailPage}>
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Cargando detalles del servicio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.serviceDetailPage}>
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>Error</h1>
          <p className={styles.errorText}>{error}</p>
          <Link to="/dashboard" className={styles.errorButton}>
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!service) return null; // No debería ocurrir si el manejo de error es correcto

  return (
    <div className={styles.serviceDetailPage}>
      <div className={styles.container}>
        {/* Botón de regreso */}
        <Link to="/dashboard" className={styles.backButton}>
          <ArrowLeftIcon />
          Volver al Dashboard
        </Link>

        {/* Tarjeta principal del servicio */}
        <div className={styles.serviceCard}>
          {/* Sección de imagen */}
          <div className={styles.imageSection}>
            <img 
              src={service.imageUrl} 
              alt={service.name}
              className={styles.serviceImage}
            />
          </div>

          {/* Sección de contenido */}
          <div className={styles.contentSection}>
            <span className={styles.category}>{service.category}</span>
            
            <h1 className={styles.title}>
              {service.name}
            </h1>
            
            <p className={styles.description}>
              {service.description}
            </p>
            
            {/* Sección de precio y cotización */}
            <div className={styles.priceSection}>
              <div className={styles.priceInfo}>
                <p className={styles.priceLabel}>Precio base de referencia</p>
                <p className={styles.price}>
                  S/. {service.priceBase.toFixed(2)}
                </p>
              </div>
              
              <button 
                onClick={handleQuoteRedirect}
                className={styles.quoteButton}
              >
                Cotizar este Servicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './ServiceDetailPage.module.css';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

// --- Iconos SVG ---
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
);

// --- Interfaces ---
interface Service {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceBase: number;
  imageUrl: string;
}

// --- Componente Principal ---
const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Service>(`/services/${slug}`);
        setService(response.data);
      } catch (err) {
        setError('Servicio no encontrado.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchService();
    }
  }, [slug]);

  const handleQuoteRedirect = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (service) {
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
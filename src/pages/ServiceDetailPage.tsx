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
          serviceName: service.name 
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
    // Asume que la página se renderiza dentro de un layout que ya tiene el Header principal
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Columna de la Imagen */}
          <div>
            <img 
              src={service.imageUrl} 
              alt={service.name}
              className="w-full h-full object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Columna de Detalles */}
          <div className="flex flex-col justify-center">
            <p className="text-indigo-600 font-semibold mb-2">{service.category}</p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              {service.name}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {service.description}
            </p>
            
            <div className="mt-auto pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Precio base de referencia</p>
                  <p className="text-4xl font-bold text-gray-800">
                    S/. {service.priceBase.toFixed(2)}
                  </p>
                </div>
                <button 
                  onClick={handleQuoteRedirect}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  Cotizar este Servicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
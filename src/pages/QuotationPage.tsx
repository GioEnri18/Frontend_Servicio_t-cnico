// ruta: frontend/src/pages/QuotationPage.tsx
// Formulario de cotizaciones actualizado según especificaciones del backend

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { quotationsService, authService, servicesService } from '../services/api';
import styles from './QuotationPage.module.css';

// --- Tipos según backend ---
interface QuotationForm {
  serviceId: string;
  description: string;
  location: string;
  requiredDate: string;
  photos: string[];
}

interface QuotationResponse {
  quotationNumber: string;
  tipo_servicio: string;
  description: string;
  location: string;
  requiredDate: string;
  status: {
    id: string;
    name: string;
    color: string;
  };
  id: string;
  createdAt: string;
}

// Tipo para los servicios del backend
interface Service {
  id: string;
  serviceNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  estimatedCost?: number;
  finalCost?: number;
  createdAt: string;
}

const QuotationPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<QuotationForm>({
    serviceId: '',
    description: '',
    location: '',
    requiredDate: '',
    photos: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdQuotation, setCreatedQuotation] = useState<QuotationResponse | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Estado para servicios cargados desde el backend
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  // Cargar servicios disponibles desde el backend
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoadingServices(true);
        const services = await servicesService.getAll();
        console.log('✅ Servicios cargados desde el backend:', services);
        console.log('📊 Número de servicios recibidos:', services?.length);
        
        // Filtrar para mostrar solo TIPOS únicos de servicios (por título)
        // Esto agrupa múltiples instancias del mismo tipo de servicio
        const uniqueServiceTypes = Array.isArray(services) 
          ? services.reduce((acc: Service[], service) => {
              // Verificar si ya existe un servicio con el mismo título
              const exists = acc.find(s => s.title === service.title);
              if (!exists) {
                acc.push(service);
              }
              return acc;
            }, [])
          : [];
        
        console.log('🔍 Tipos de servicios únicos:', uniqueServiceTypes);
        console.log('📊 Número de tipos de servicios:', uniqueServiceTypes.length);
        
        setAvailableServices(uniqueServiceTypes);
      } catch (error) {
        console.error('❌ Error cargando servicios:', error);
        // En caso de error, mostrar mensaje pero permitir continuar
        setAvailableServices([]);
      } finally {
        setIsLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  // Cargar perfil del usuario para verificar autenticación
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const profile = await authService.getProfile();
        const userData = profile.user || profile;
        setUserProfile(userData);
        
        // Solo clientes, admin y empleados pueden crear cotizaciones
        if (!['customer', 'admin', 'employee'].includes(userData.role)) {
          alert('No tienes permisos para crear cotizaciones');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
        navigate('/login');
      }
    };

    loadUserProfile();
  }, [navigate]);

  // Establecer fecha mínima (hoy)
  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    if (files.length > 5) {
      setErrors(prev => ({ ...prev, photos: 'Máximo 5 fotos permitidas' }));
      return;
    }
    
    // Convertir archivos a base64
    const photoPromises = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(photoPromises).then(photos => {
      setFormData(prev => ({ ...prev, photos }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.photos;
        return newErrors;
      });
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.serviceId) {
      newErrors.serviceId = 'Debes seleccionar un tipo de servicio';
    }
    
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }
    
    if (!formData.location) {
      newErrors.location = 'La ubicación es requerida';
    }
    
    if (!formData.requiredDate) {
      newErrors.requiredDate = 'Debes seleccionar una fecha';
    } else {
      const selectedDate = new Date(formData.requiredDate);
      const now = new Date();
      if (selectedDate < now) {
        newErrors.requiredDate = 'La fecha no puede ser en el pasado';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Convertir fecha a ISO 8601
      const requiredDateISO = new Date(formData.requiredDate).toISOString();
      
      // Preparar datos según backend
      const quotationData = {
        serviceId: formData.serviceId,
        description: formData.description,
        location: formData.location,
        requiredDate: requiredDateISO,
        photos: formData.photos.length > 0 ? formData.photos : undefined
      };

      console.log('📤 Enviando cotización al backend:', quotationData);
      
      // Enviar al backend
      const result = await quotationsService.create(quotationData);
      console.log('✅ Cotización creada exitosamente:', result);
      
      setCreatedQuotation(result);
      setSubmitted(true);
    } catch (error: any) {
      console.error('❌ Error al enviar cotización:', error);
      
      // Manejo de errores específicos
      if (error.response?.status === 401) {
        alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('No tienes permisos para crear cotizaciones.');
        navigate('/dashboard');
      } else if (error.response?.status === 400) {
        const errorData = error.response?.data;
        if (errorData?.message) {
          if (Array.isArray(errorData.message)) {
            alert(`Errores de validación:\n${errorData.message.join('\n')}`);
          } else {
            alert(`Error de validación: ${errorData.message}`);
          }
        } else {
          alert('Datos del formulario inválidos. Por favor revisa todos los campos.');
        }
      } else {
        alert('Error al crear la cotización. Por favor intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userProfile) {
    return (
      <div className={styles.quotationPage}>
        <div className={styles.container}>
          <h1 style={{ color: 'white', textAlign: 'center' }}>Cargando...</h1>
        </div>
      </div>
    );
  }

  if (submitted && createdQuotation) {
    return (
      <div className={styles.quotationPage}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h1 className={styles.successTitle}>¡Cotización Creada Exitosamente!</h1>
            
            <div className={styles.quotationDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Número de Cotización:</span>
                <span className={styles.detailValue}><strong>{createdQuotation.quotationNumber}</strong></span>
              </div>
              
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Estado:</span>
                <span 
                  className={styles.statusBadge}
                  style={{ backgroundColor: createdQuotation.status.color }}
                >
                  {createdQuotation.status.name}
                </span>
              </div>
              
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Servicio:</span>
                <span className={styles.detailValue}>{createdQuotation.tipo_servicio}</span>
              </div>
              
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Ubicación:</span>
                <span className={styles.detailValue}>{createdQuotation.location}</span>
              </div>
            </div>

            {/* Ejemplo de instalación de cámaras */}
            <div className={styles.cotizacionEjemplo}>
              <h3>Instalación de Cámaras</h3>
              <img src="/Tedics/IMG-20251025-WA0140.jpg" alt="Instalación de Cámaras 1" />
              <img src="/Tedics/IMG-20251025-WA0141.jpg" alt="Instalación de Cámaras 2" />
              <img src="/Tedics/IMG-20251025-WA0142.jpg" alt="Instalación de Cámaras 3" />
            </div>
            
            <p className={styles.successMessage}>
              Te notificaremos cuando un empleado revise tu solicitud.
            </p>
            
            <div className={styles.successActions}>
              <Link to="/cotizaciones" className={styles.primaryButton}>
                Ver Mis Cotizaciones
              </Link>
              <Link to="/dashboard" className={styles.secondaryButton}>
                Volver al Dashboard
              </Link>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setCreatedQuotation(null);
                  setFormData({
                    serviceId: '',
                    description: '',
                    location: '',
                    requiredDate: '',
                    photos: []
                  });
                }}
                className={styles.secondaryButton}
              >
                Nueva Cotización
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quotationPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Link to="/dashboard" className={styles.backButton}>
            ← Volver al Dashboard
          </Link>
          <h1 className={styles.pageTitle}>Solicitar Cotización</h1>
          <p className={styles.pageSubtitle}>Complete el formulario para solicitar un servicio técnico</p>
        </div>

        {/* Formulario */}
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Sección 1: Tipo de Servicio */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>📋 Tipo de Servicio</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="serviceId" className={styles.label}>
                  Selecciona el tipo de servicio que necesitas *
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  required
                  disabled={isLoadingServices}
                  className={`${styles.select} ${errors.serviceId ? styles.inputError : ''}`}
                >
                  <option value="">
                    {isLoadingServices ? '⏳ Cargando tipos de servicios...' : '-- Seleccione un tipo de servicio --'}
                  </option>
                  {availableServices.map((service, index) => (
                    <option 
                      key={`${service.id}-${index}`} 
                      value={service.id}
                      title={service.description || 'Sin descripción'}
                    >
                      {service.title}
                    </option>
                  ))}
                </select>
                {errors.serviceId && (
                  <span className={styles.errorMessage}>{errors.serviceId}</span>
                )}
                {!isLoadingServices && availableServices.length === 0 && (
                  <span className={styles.errorMessage}>
                    ⚠️ No hay tipos de servicios disponibles. Por favor contacta al administrador.
                  </span>
                )}
                {!isLoadingServices && availableServices.length > 0 && (
                  <div className={styles.infoMessage} style={{ marginTop: '8px', fontSize: '0.9rem', color: '#888' }}>
                    ℹ️ {availableServices.length} tipo{availableServices.length !== 1 ? 's' : ''} de servicio{availableServices.length !== 1 ? 's' : ''} disponible{availableServices.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>

            {/* Sección 2: Descripción del Problema */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>📝 Descripción del Problema</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Describe detalladamente el problema o servicio que necesitas *
                  <span className={styles.labelHint}>(mínimo 10 caracteres)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  minLength={10}
                  rows={5}
                  className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                  placeholder="Ej: Mi laptop HP Pavilion no enciende, cuando presiono el botón de power no responde. Creo que puede ser un problema con la batería o el cargador..."
                />
                <div className={styles.charCount}>
                  {formData.description.length} caracteres
                </div>
                {errors.description && (
                  <span className={styles.errorMessage}>{errors.description}</span>
                )}
              </div>
            </div>

            {/* Sección 3: Ubicación y Fecha */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>📍 Ubicación y Fecha</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="location" className={styles.label}>
                  Ubicación donde se requiere el servicio *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
                  placeholder="Ej: Ciudad de Guatemala, Zona 10, Edificio Empresarial Torre II"
                />
                {errors.location && (
                  <span className={styles.errorMessage}>{errors.location}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="requiredDate" className={styles.label}>
                  Fecha y hora deseada para el servicio *
                </label>
                <input
                  type="datetime-local"
                  id="requiredDate"
                  name="requiredDate"
                  value={formData.requiredDate}
                  onChange={handleInputChange}
                  required
                  min={getMinDateTime()}
                  className={`${styles.input} ${errors.requiredDate ? styles.inputError : ''}`}
                />
                {errors.requiredDate && (
                  <span className={styles.errorMessage}>{errors.requiredDate}</span>
                )}
              </div>
            </div>

            {/* Sección 4: Fotos (Opcional) */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>📷 Fotos del Problema (Opcional)</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="photos" className={styles.label}>
                  Sube hasta 5 fotos para ayudarnos a entender mejor el problema
                </label>
                <input
                  type="file"
                  id="photos"
                  accept="image/*"
                  multiple
                  max={5}
                  onChange={handlePhotoUpload}
                  className={styles.fileInput}
                />
                {formData.photos.length > 0 && (
                  <div className={styles.photoPreview}>
                    <p className={styles.photoCount}>
                      {formData.photos.length} {formData.photos.length === 1 ? 'foto subida' : 'fotos subidas'}
                    </p>
                  </div>
                )}
                {errors.photos && (
                  <span className={styles.errorMessage}>{errors.photos}</span>
                )}
              </div>
            </div>

            {/* Botón de Envío */}
            <div className={styles.formActions}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Enviando...
                  </>
                ) : (
                  '🚀 Enviar Solicitud de Cotización'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuotationPage;

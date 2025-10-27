// ruta: frontend/src/pages/QuotationPage.tsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { quotationsService } from '../services/api';
import styles from './QuotationPage.module.css';

// --- Tipos ---
interface ServiceInfo {
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
}

interface QuotationForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectDescription: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedBudget: string;
}

const QuotationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener información del servicio desde el state (opcional ahora)
  const serviceInfo = location.state as ServiceInfo | null;
  
  const [formData, setFormData] = useState<QuotationForm>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    projectDescription: '',
    urgency: 'medium',
    estimatedBudget: ''
  });
  
  const [serviceName, setServiceName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Cargar el nombre del servicio si viene desde el state
  useEffect(() => {
    if (serviceInfo) {
      setServiceName(serviceInfo.serviceName);
    }
  }, [serviceInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Preparar datos de la cotización para el backend
      const quotationData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        serviceName: serviceName || 'Servicio General', // Usar el nombre del servicio del formulario
        serviceCategory: 'General', // Categoría por defecto
        projectDescription: formData.projectDescription,
        urgency: formData.urgency,
        estimatedBudget: parseFloat(formData.estimatedBudget) || 0,
        status: 'PENDIENTE', // Estado inicial
        notes: serviceName ? `Cotización solicitada para: ${serviceName}` : 'Cotización general'
      };

      console.log('Enviando cotización al backend:', quotationData);
      
      // Enviar al backend
      const result = await quotationsService.create(quotationData);
      console.log('Cotización creada exitosamente:', result);
      
      setSubmitted(true);
    } catch (error: any) {
      console.error('Error al enviar cotización:', error);
      
      // Mostrar error específico si está disponible
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      alert(`Error al enviar la cotización: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.quotationPage}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h1 className={styles.successTitle}>¡Cotización Enviada!</h1>
            <p className={styles.successMessage}>
              Hemos recibido tu solicitud de cotización{serviceName && ` para ${serviceName}`}.
              Nuestro equipo se pondrá en contacto contigo dentro de las próximas 24 horas.
            </p>
            <div className={styles.successActions}>
              <Link to="/dashboard" className={styles.primaryButton}>
                Volver al Dashboard
              </Link>
              <Link to="/cotizaciones" className={styles.primaryButton}>
                Ver Cotizaciones
              </Link>
              <button 
                onClick={() => setSubmitted(false)}
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
          {serviceName && (
            <p className={styles.serviceInfo}>
              Para: <strong>{serviceName}</strong>
            </p>
          )}
        </div>

        {/* Formulario */}
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Información de Contacto</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="customerName" className={styles.label}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="customerEmail" className={styles.label}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="customerPhone" className={styles.label}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                  placeholder="+502 1234-5678"
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Detalles del Proyecto</h2>
              
              {/* Campo para nombre del servicio si no viene desde el state */}
              {!serviceName && (
                <div className={styles.formGroup}>
                  <label htmlFor="serviceName" className={styles.label}>
                    Nombre del Servicio *
                  </label>
                  <input
                    type="text"
                    id="serviceName"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                    className={styles.input}
                    placeholder="Ej: Instalación Eléctrica, Cámaras de Seguridad, etc."
                  />
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label htmlFor="projectDescription" className={styles.label}>
                  Descripción del Proyecto *
                </label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={styles.textarea}
                  placeholder="Describe detalladamente lo que necesitas..."
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="urgency" className={styles.label}>
                    Urgencia
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="low">Baja (1-2 semanas)</option>
                    <option value="medium">Media (3-5 días)</option>
                    <option value="high">Alta (1-2 días)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="estimatedBudget" className={styles.label}>
                    Presupuesto Estimado
                  </label>
                  <input
                    type="text"
                    id="estimatedBudget"
                    name="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ej: Q. 5,000 - Q. 10,000"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Cotización'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuotationPage;
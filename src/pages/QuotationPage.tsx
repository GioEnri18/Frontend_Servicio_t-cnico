// ruta: frontend/src/pages/QuotationPage.tsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { quotationsService } from '../services/quotations';
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
  location: string;
  requiredDate: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedBudget: string;
}

const QuotationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener información del servicio desde el state
  const serviceInfo = location.state as ServiceInfo | null;
  
  const [formData, setFormData] = useState<QuotationForm>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    projectDescription: '',
    location: '',
    requiredDate: new Date().toISOString().split('T')[0],
    urgency: 'medium',
    estimatedBudget: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        customerEmail: user.email || ''
      }));
    }
  }, []);

  // Si no hay información del servicio, redirigir al dashboard
  useEffect(() => {
    if (!serviceInfo) {
      navigate('/dashboard');
    }
  }, [serviceInfo, navigate]);

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
        serviceId: serviceInfo.serviceId,
        description: formData.projectDescription,
        location: formData.location,
        requiredDate: new Date(formData.requiredDate).toISOString(),
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

  if (!serviceInfo) {
    return null; // Se redirigirá automáticamente
  }

  if (submitted) {
    return (
      <div className={styles.quotationPage}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h1 className={styles.successTitle}>¡Cotización Enviada!</h1>
            <p className={styles.successMessage}>
              Hemos recibido tu solicitud de cotización para <strong>{serviceInfo.serviceName}</strong>.
              Nuestro equipo se pondrá en contacto contigo dentro de las próximas 24 horas.
            </p>
            <div className={styles.successActions}>
              <Link to="/dashboard" className={styles.primaryButton}>
                Volver al Dashboard
              </Link>
              <Link to="/cotizaciones" className={styles.primaryButton}>
                Ver Mis Cotizaciones
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
          <Link to={`/services/${serviceInfo.serviceSlug}`} className={styles.backButton}>
            ← Volver al Servicio
          </Link>
          <h1 className={styles.pageTitle}>Solicitar Cotización</h1>
          <p className={styles.serviceInfo}>
            Para: <strong>{serviceInfo.serviceName}</strong>
          </p>
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
                    readOnly
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
                    readOnly
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
                  <label htmlFor="location" className={styles.label}>
                    Ubicación (Ciudad/Municipio) *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="Ej: Ciudad de Guatemala"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="requiredDate" className={styles.label}>
                    Fecha Requerida *
                  </label>
                  <input
                    type="date"
                    id="requiredDate"
                    name="requiredDate"
                    value={formData.requiredDate}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                </div>
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
// ruta: frontend/src/pages/admin/CreateQuotePage.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './CreateQuotePage.module.css';

// --- Tipos ---
interface QuotationForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  serviceName: string;
  serviceCategory: string;
  projectDescription: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedBudget: string;
  notes: string;
}

const CreateQuotePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<QuotationForm>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    serviceName: '',
    serviceCategory: '',
    projectDescription: '',
    urgency: 'medium',
    estimatedBudget: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<QuotationForm>>({});

  // Validación de formulario
  const validateForm = (): boolean => {
    const newErrors: Partial<QuotationForm> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre del cliente es obligatorio';
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'El email no es válido';
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'El teléfono es obligatorio';
    }
    
    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'El nombre del servicio es obligatorio';
    }
    
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'La descripción del proyecto es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al empezar a escribir
    if (errors[name as keyof QuotationForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simular creación de cotización
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Crear nueva cotización con ID único
      const newQuote = {
        id: `quote_${Date.now()}`,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        serviceName: formData.serviceName,
        status: 'pending' as const,
        items: [],
        totalAmount: 0.00,
        createdAt: new Date().toISOString(),
        notes: formData.notes || formData.projectDescription
      };
      
      // En una app real, aquí harías la llamada a la API
      
      // Redirigir al panel de cotizaciones con la nueva cotización
      navigate('/cotizaciones', { 
        state: { 
          newQuote: newQuote,
          message: 'Cotización creada exitosamente'
        },
        replace: true
      });
      
    } catch (error) {
      console.error('Error al crear cotización:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceCategories = [
    'Instalación Eléctrica',
    'Mantenimiento',
    'Reparación',
    'Seguridad',
    'Domótica',
    'Energía Solar',
    'Consultoría'
  ];

  const urgencyLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta'
  };

  return (
    <div className={styles.createQuotePage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/cotizaciones" className={styles.backButton}>
            ← Volver a Cotizaciones
          </Link>
          <h1 className={styles.pageTitle}>Nueva Cotización</h1>
          <p className={styles.pageSubtitle}>Crea una nueva cotización para un cliente</p>
        </div>
      </div>

      {/* Formulario */}
      <div className={styles.container}>
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            
            {/* Información del Cliente */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>👤</span>
                Información del Cliente
              </h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.customerName ? styles.inputError : ''}`}
                    placeholder="Ej: Juan Pérez"
                  />
                  {errors.customerName && (
                    <span className={styles.errorText}>{errors.customerName}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.customerEmail ? styles.inputError : ''}`}
                    placeholder="Ej: juan@example.com"
                  />
                  {errors.customerEmail && (
                    <span className={styles.errorText}>{errors.customerEmail}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.customerPhone ? styles.inputError : ''}`}
                    placeholder="Ej: +502 1234-5678"
                  />
                  {errors.customerPhone && (
                    <span className={styles.errorText}>{errors.customerPhone}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ej: Zona 10, Ciudad de Guatemala"
                  />
                </div>
              </div>
            </div>

            {/* Información del Servicio */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>⚡</span>
                Información del Servicio
              </h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Nombre del Servicio *
                  </label>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.serviceName ? styles.inputError : ''}`}
                    placeholder="Ej: Instalación Eléctrica Residencial"
                  />
                  {errors.serviceName && (
                    <span className={styles.errorText}>{errors.serviceName}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Categoría del Servicio
                  </label>
                  <select
                    name="serviceCategory"
                    value={formData.serviceCategory}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="">Seleccionar categoría</option>
                    {serviceCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Urgencia
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    {Object.entries(urgencyLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Presupuesto Estimado
                  </label>
                  <input
                    type="text"
                    name="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ej: Q. 5,000.00"
                  />
                </div>
              </div>
            </div>

            {/* Descripción del Proyecto */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📋</span>
                Detalles del Proyecto
              </h2>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Descripción del Proyecto *
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${errors.projectDescription ? styles.inputError : ''}`}
                  placeholder="Describe detalladamente el proyecto, requerimientos específicos, ubicación, etc."
                  rows={4}
                />
                {errors.projectDescription && (
                  <span className={styles.errorText}>{errors.projectDescription}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Notas Adicionales
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="Información adicional, preferencias del cliente, fechas específicas, etc."
                  rows={3}
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className={styles.formActions}>
              <Link to="/cotizaciones" className={styles.cancelButton}>
                Cancelar
              </Link>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Creando Cotización...
                  </>
                ) : (
                  'Crear Cotización'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuotePage;
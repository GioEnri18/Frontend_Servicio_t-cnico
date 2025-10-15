import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styles from './QuotationPage.module.css';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

interface ServiceInfo {
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
}

const QuotationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const serviceInfo = location.state as ServiceInfo | null;
  
  const [description, setDescription] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [photos, setPhotos] = useState<string[]>([]); // Assuming photo URLs for now
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!serviceInfo) {
      navigate('/');
    }
  }, [serviceInfo, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await apiClient.post('/quotations', {
        serviceId: serviceInfo?.serviceId,
        description: description,
        location: serviceLocation,
        requiredDate: requiredDate,
        photos: photos,
      });
      setSubmitted(true);
      navigate('/my-quotations'); // Redirect to client's quotation list
    } catch (err) {
      setError('Ocurrió un error al enviar la cotización. Por favor, intente de nuevo.');
      console.error('Error submitting quotation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!serviceInfo || !user) {
    // Redirecting or showing loading is handled by ProtectedRoute and the useEffect hook
    return null;
  }

  if (submitted) {
    return (
      <div className={styles.quotationPage}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h1 className={styles.successTitle}>¡Solicitud Enviada!</h1>
            <p className={styles.successMessage}>
              Hemos recibido tu solicitud de cotización para <strong>{serviceInfo.serviceName}</strong>.
              Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo.
            </p>
            <div className={styles.successActions}>
              <Link to="/" className={styles.primaryButton}>Volver al Inicio</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quotationPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to={`/services/${serviceInfo.serviceSlug}`} className={styles.backButton}>
            ← Volver al Servicio
          </Link>
          <h1 className={styles.pageTitle}>Solicitar Cotización</h1>
          <p className={styles.serviceInfo}>
            Servicio: <strong>{serviceInfo.serviceName}</strong>
          </p>
        </div>

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Tu Información</h2>
              <p className={styles.userInfo}>Solicitando como: <strong>{user.email}</strong></p>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Detalles de la Solicitud</h2>
              <div className={styles.formGroup}>
                <label htmlFor="location" className={styles.label}>
                  Ubicación del Servicio *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={serviceLocation}
                  onChange={(e) => setServiceLocation(e.target.value)}
                  required
                  className={styles.input}
                  placeholder="Ej: Calle Falsa 123, Ciudad"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="requiredDate" className={styles.label}>
                  Fecha Requerida (aproximada) *
                </label>
                <input
                  type="date"
                  id="requiredDate"
                  name="requiredDate"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="photos" className={styles.label}>
                  Fotos de Referencia (URLs separadas por coma)
                </label>
                <textarea
                  id="photos"
                  name="photos"
                  value={photos.join(', ')}
                  onChange={(e) => setPhotos(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  rows={3}
                  className={styles.textarea}
                  placeholder="Ej: http://example.com/foto1.jpg, http://example.com/foto2.png"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Por favor, detalla los requerimientos para tu proyecto.*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  className={styles.textarea}
                  placeholder="Ej: Necesito instalar 3 cámaras de seguridad en el exterior de mi casa, con grabación en la nube..."
                />
              </div>
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.formActions}>
              <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                {isSubmitting ? 'Enviando Solicitud...' : 'Enviar Solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuotationPage;

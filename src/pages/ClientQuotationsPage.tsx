import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { QuotationStatus, type Quotation } from '../types/quotations';
import styles from './ClientQuotationsPage.module.css'; // Create this CSS module

const ClientQuotationsPage: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyQuotations = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await apiClient.get<Quotation[]>('/quotations/my-quotations', {
          withCredentials: true,
        });
        setQuotations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching client quotations:', err);
        setError('Error al cargar tus cotizaciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyQuotations();
  }, []);

  const getStatusClassName = (status: Quotation['status']) => {
    switch (status) {
      case QuotationStatus.DRAFT:
        return styles.draft;
      case QuotationStatus.SENT:
        return styles.sent;
      case QuotationStatus.APPROVED:
        return styles.approved;
      case QuotationStatus.REJECTED:
        return styles.rejected;
      case QuotationStatus.IN_PROGRESS:
        return styles.inProgress;
      case QuotationStatus.COMPLETED:
        return styles.completed;
      default:
        return styles.defaultStatus;
    }
  };

  const getStatusLabel = (status: Quotation['status']) => {
    switch (status) {
      case QuotationStatus.DRAFT:
        return 'Borrador';
      case QuotationStatus.SENT:
        return 'Enviada';
      case QuotationStatus.APPROVED:
        return 'Aprobada';
      case QuotationStatus.REJECTED:
        return 'Rechazada';
      case QuotationStatus.IN_PROGRESS:
        return 'En Curso';
      case QuotationStatus.COMPLETED:
        return 'Completada';
      default:
        return String(status);
    }
  };

  const formatDate = (value?: string | Date) => {
    if (!value) return '—';
    const d = typeof value === 'string' ? new Date(value) : value;
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mis Cotizaciones</h1>
        <p className={styles.subtitle}>Aquí puedes ver el estado y el historial de tus solicitudes de cotización.</p>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th># Cotización</th>
              <th>Fecha de Solicitud</th>
              <th>Estado</th>
              <th>Total Estimado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className={styles.loadingText}>Cargando tus cotizaciones...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className={styles.errorText}>{error}</td>
              </tr>
            ) : quotations.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyText}>No has realizado ninguna solicitud de cotización todavía.</td>
              </tr>
            ) : (
              quotations.map((quote) => (
                <tr key={quote.id}>
                  <td>{quote.quotationNumber}</td>
                  <td>{formatDate(quote.createdAt)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClassName(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </td>
                  <td>S/. {Number(quote.total).toFixed(2)}</td>
                  <td>
                    <Link to={`/my-quotations/${quote.id}`} className={styles.viewButton}>
                      Ver Detalles
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientQuotationsPage;

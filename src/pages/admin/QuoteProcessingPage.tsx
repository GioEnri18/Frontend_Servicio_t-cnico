import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { QuotationStatus, type Quotation, type QuotationItem } from '../../types/quotations';
import { type AuditLog } from '../../types/audit-log';
import styles from './QuoteProcessingPage.module.css';

const QuoteProcessingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentStatus, setCurrentStatus] = useState<QuotationStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState<number>(1);
  const [newItemUnitPrice, setNewItemUnitPrice] = useState<number>(0);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        setLoading(true);
        const { data: quotationData } = await apiClient.get<Quotation>(`/quotations/${id}`);
        setQuotation(quotationData);
        setCurrentStatus(quotationData.status);
        setNotes(quotationData.notes || '');
        setItems(quotationData.items || []);

        const { data: logsData } = await apiClient.get<AuditLog[]>(`/audit-logs?entityId=${id}&entityName=Quotation`);
        setAuditLogs(logsData);

      } catch (err) {
        console.error('Error fetching quotation data:', err);
        setError('Error al cargar la cotización o su historial.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuotationData();
    }
  }, [id]);

  const handleAddItem = () => {
    if (newItemDescription && newItemQuantity > 0 && newItemUnitPrice >= 0) {
      const newItem: QuotationItem = {
        id: `temp-${Date.now()}`,
        description: newItemDescription,
        quantity: newItemQuantity,
        unitPrice: newItemUnitPrice,
        subtotal: newItemQuantity * newItemUnitPrice,
      };
      setItems([...items, newItem]);
      setNewItemDescription('');
      setNewItemQuantity(1);
      setNewItemUnitPrice(0);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    // For simplicity, assuming 0 tax for now, or a fixed rate if applicable
    const tax = 0; 
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleUpdateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { subtotal, tax, total } = calculateTotals();

      await apiClient.patch(`/quotations/${id}`, {
        status: currentStatus,
        notes: notes,
        items: items.map(({ id, ...rest }) => rest), // Remove temp id for backend
        subtotal,
        tax,
        total,
      });
      navigate('/admin/quotes'); // Redirect back to management page
    } catch (err: any) {
      console.error('Error updating quotation:', err);
      setError(err.response?.data?.message || 'Error al actualizar la cotización.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando cotización...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!quotation) {
    return <div className={styles.notFound}>Cotización no encontrada.</div>;
  }

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className={styles.pageContainer}>
      <Link to="/admin/quotes" className={styles.backButton}>← Volver a Gestión de Cotizaciones</Link>
      <h1 className={styles.title}>Procesar Cotización #{quotation.quotationNumber}</h1>

      <form onSubmit={handleUpdateQuotation} className={styles.form}>
        <div className={styles.section}>
          <h2>Detalles del Cliente</h2>
          <p><strong>Cliente:</strong> {quotation.customer?.firstName} {quotation.customer?.lastName}</p>
          <p><strong>Email:</strong> {quotation.customer?.email}</p>
          {quotation.customer?.company && <p><strong>Empresa:</strong> {quotation.customer.company}</p>}
          {/* Add phone if available in customer object */}
        </div>

        <div className={styles.section}>
          <h2>Información de la Solicitud</h2>
          <p><strong>Servicio ID:</strong> {quotation.notes?.match(/ID: ([a-f0-9-]+)/)?.[1] || 'N/A'}</p>
          <p><strong>Descripción del Cliente:</strong> {quotation.notes?.split('Descripción del cliente:\n')[1] || 'N/A'}</p>
          {quotation.location && <p><strong>Ubicación:</strong> {quotation.location}</p>}
          {quotation.requiredDate && <p><strong>Fecha Requerida:</strong> {new Date(quotation.requiredDate).toLocaleDateString()}</p>}
          {quotation.photos && quotation.photos.length > 0 && (
            <div>
              <strong>Fotos:</strong>
              <div className={styles.photoGrid}>
                {quotation.photos.map((photo: string, index: number) => (
                  <a key={index} href={photo} target="_blank" rel="noopener noreferrer">
                    <img src={photo} alt={`Foto ${index + 1}`} className={styles.thumbnail} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>Estado de la Cotización</h2>
          <select
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value as QuotationStatus)}
            className={styles.select}
            disabled={isSubmitting}
          >
            {Object.values(QuotationStatus).map((status: QuotationStatus) => (
              <option key={status} value={status}>
                {status.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.section}>
          <h2>Notas Internas</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={styles.textarea}
            rows={4}
            placeholder="Notas internas sobre la cotización..."
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.section}>
          <h2>Ítems de la Cotización</h2>
          <div className={styles.itemsList}>
            {items.length === 0 ? (
              <p>No hay ítems en esta cotización.</p>
            ) : (
              items.map((item, index) => (
                <div key={item.id || index} className={styles.itemRow}>
                  <span>{item.description} (x{item.quantity})</span>
                  <span>S/. {item.unitPrice.toFixed(2)}</span>
                  <span>S/. {item.subtotal.toFixed(2)}</span>
                  <button type="button" onClick={() => handleRemoveItem(item.id)} className={styles.removeItemButton}>X</button>
                </div>
              ))
            )}
          </div>
          <div className={styles.addItemForm}>
            <input
              type="text"
              placeholder="Descripción del ítem"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
              min="1"
              className={styles.inputSmall}
            />
            <input
              type="number"
              placeholder="Precio Unitario"
              value={newItemUnitPrice}
              onChange={(e) => setNewItemUnitPrice(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className={styles.inputSmall}
            />
            <button type="button" onClick={handleAddItem} className={styles.addButton}>Añadir Ítem</button>
          </div>
        </div>

        <div className={styles.totalsSection}>
          <p>Subtotal: S/. {subtotal.toFixed(2)}</p>
          <p>Impuestos: S/. {tax.toFixed(2)}</p>
          <h3>Total: S/. {total.toFixed(2)}</h3>
        </div>

        <div className={styles.section}>
          <h2>Historial de Actividad</h2>
          {auditLogs.length === 0 ? (
            <p>No hay historial de actividad para esta cotización.</p>
          ) : (
            <ul className={styles.auditLogList}>
              {auditLogs.map((log) => (
                <li key={log.id} className={styles.auditLogItem}>
                  <span className={styles.logTimestamp}>{new Date(log.createdAt).toLocaleString()}</span>
                  <span className={styles.logUser}>{log.user?.firstName} {log.user?.lastName}</span>
                  <span className={styles.logAction}>{log.action.replace(/_/g, ' ').toLowerCase()}</span>
                  {log.oldValues?.status && log.newValues?.status && (
                    <span className={styles.logDetail}>: {log.oldValues.status} → {log.newValues.status}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Actualizando...' : 'Actualizar Cotización'}
        </button>
      </form>
    </div>
  );
};

export default QuoteProcessingPage;
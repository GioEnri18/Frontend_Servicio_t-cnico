import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quotationsService } from '../services/api';
import styles from './QuoteManagementPage.module.css';

interface Quote {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceName: string;
  serviceCategory?: string;
  projectDescription?: string;
  status: string;
  urgency?: string;
  estimatedBudget?: number;
  totalAmount?: number;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

const QuoteManagementPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Cargando cotizaciones del backend...');
      
      const data = await quotationsService.getAll();
      console.log('Cotizaciones obtenidas:', data);
      
      // Transformar datos del backend al formato esperado
      const transformedQuotes: Quote[] = data.map((q: any) => ({
        id: q.id || Date.now().toString(),
        customerName: q.customerName || 'Cliente Sin Nombre',
        customerEmail: q.customerEmail || '',
        customerPhone: q.customerPhone || '',
        serviceName: q.serviceName || 'Servicio',
        serviceCategory: q.serviceCategory || 'General',
        projectDescription: q.projectDescription || '',
        status: q.status || 'PENDIENTE',
        urgency: q.urgency || 'medium',
        estimatedBudget: q.estimatedBudget || 0,
        totalAmount: q.totalAmount || q.estimatedBudget || 0,
        createdAt: q.createdAt || new Date().toISOString(),
        updatedAt: q.updatedAt,
        notes: q.notes || ''
      }));
      
      setQuotes(transformedQuotes);
      
    } catch (error: any) {
      console.error('Error al cargar cotizaciones:', error);
      setError('Error al cargar las cotizaciones del servidor');
      
      // Usar datos mock como fallback
      setQuotes([
        {
          id: '1',
          customerName: 'Juan Pérez',
          customerEmail: 'juan@email.com',
          serviceName: 'Instalación Eléctrica Residencial',
          status: 'PENDIENTE',
          totalAmount: 0,
          createdAt: '2025-01-10',
          notes: 'Instalación completa para casa de 120m²'
        },
        {
          id: '2',
          customerName: 'María González',
          customerEmail: 'maria@email.com',
          serviceName: 'Configuración de Cámaras de Seguridad',
          status: 'EN PROCESO',
          totalAmount: 740,
          createdAt: '2025-01-09',
          notes: 'Sistema de 4 cámaras para oficina'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return '#f59e0b';
      case 'EN PROCESO':
        return '#3b82f6';
      case 'COMPLETADO':
        return '#10b981';
      case 'RECHAZADO':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return 'PENDIENTE';
      case 'EN PROCESO':
        return 'EN PROCESO';
      case 'COMPLETADO':
        return 'COMPLETADO';
      case 'RECHAZADO':
        return 'RECHAZADO';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className={styles.quotationPage}>
        <div className={styles.container}>
          <h1 style={{ color: 'white', textAlign: 'center' }}>Cargando cotizaciones...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quotationPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Link to="/" className={styles.backButton}>
            ← Volver al Panel Principal
          </Link>
          <h1 className={styles.pageTitle}>Gestión de Cotizaciones</h1>
          <p className={styles.pageSubtitle}>Administra productos, precios y cantidades</p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
            <button onClick={loadQuotes} className={styles.retryButton}>
              Reintentar
            </button>
          </div>
        )}

        <div className={styles.layout}>
          {/* Panel izquierdo - Lista de cotizaciones */}
          <div className={styles.quotesPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Cotizaciones Pendientes</h2>
              <Link to="/quotations/new" className={styles.newQuoteButton}>
                + Nueva Cotización
              </Link>
            </div>
            <div className={styles.quotesList}>
              {quotes.map(quote => (
                <div 
                  key={quote.id}
                  className={`${styles.quoteCard} ${selectedQuote?.id === quote.id ? styles.selected : ''}`}
                  onClick={() => handleSelectQuote(quote)}
                >
                  <div className={styles.quoteHeader}>
                    <h3 className={styles.quoteName}>{quote.customerName}</h3>
                    <span 
                      className={styles.status}
                      style={{ 
                        backgroundColor: getStatusColor(quote.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {getStatusText(quote.status)}
                    </span>
                  </div>
                  <p className={styles.quoteService}>{quote.serviceName}</p>
                  <p className={styles.quoteTotal}>Total: Q. {(quote.totalAmount || 0).toFixed(2)}</p>
                </div>
              ))}
              
              {quotes.length === 0 && (
                <div className={styles.emptyState}>
                  <h3>No hay cotizaciones disponibles</h3>
                  <p>Las cotizaciones creadas aparecerán aquí automáticamente</p>
                </div>
              )}
            </div>
          </div>

          {/* Panel derecho - Detalles de cotización */}
          <div className={styles.detailsPanel}>
            {selectedQuote ? (
              <div className={styles.customerInfo}>
                <h2 className={styles.panelTitle}>Información del Cliente</h2>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Cliente:</span>
                    <span className={styles.value}>{selectedQuote.customerName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>{selectedQuote.customerEmail}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Servicio:</span>
                    <span className={styles.value}>{selectedQuote.serviceName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Estado:</span>
                    <span className={styles.value}>{getStatusText(selectedQuote.status)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Fecha:</span>
                    <span className={styles.value}>{new Date(selectedQuote.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Total:</span>
                    <span className={styles.value}>Q. {(selectedQuote.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  {selectedQuote.notes && (
                    <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
                      <span className={styles.label}>Notas:</span>
                      <span className={styles.value}>{selectedQuote.notes}</span>
                    </div>
                  )}
                  {selectedQuote.projectDescription && (
                    <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
                      <span className={styles.label}>Descripción del Proyecto:</span>
                      <span className={styles.value}>{selectedQuote.projectDescription}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.noSelection}>
                <h2>Selecciona una cotización</h2>
                <p>Elige una cotización de la lista para ver y editar sus detalles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteManagementPage;
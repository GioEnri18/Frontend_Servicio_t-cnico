import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quotationsService, updateQuotationStatus } from '../services/quotations';
import styles from './QuoteManagementPage.module.css';

interface Status {
  id: string;
  name: string;
}

interface Quote {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceName: string;
  serviceCategory?: string;
  projectDescription?: string;
  status: Status;
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [availableStatuses, setAvailableStatuses] = useState<Status[]>([]); // New state for statuses

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
  }, []);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const statuses = await quotationsService.getStatuses();
        setAvailableStatuses(statuses);
      } catch (err) {
        console.error('Error fetching statuses:', err);
        setError('Error al cargar los estados disponibles.');
      }
    };
    fetchStatuses();
  }, []); // Fetch statuses only once on mount

  useEffect(() => {
    if (userRole) { // Solo cargar si ya tenemos el rol
      loadQuotes();
    }
  }, [userRole]); // Depender del rol del usuario

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      let transformedQuotes: Quote[] = []; // Initialize as empty array
      if (userRole === 'admin' || userRole === 'employee') {
        console.log('Cargando todas las cotizaciones (admin)...');
        data = await quotationsService.getAll();
      } else {
        console.log('Cargando mis cotizaciones (cliente)...');
        data = await quotationsService.getMyQuotations();
      }
      
      // Only transform if data is available and is an array
      if (data && Array.isArray(data)) {
        transformedQuotes = data.map((q: any) => ({
          id: q.id || Date.now().toString(),
          customerName: q.customer?.firstName + ' ' + q.customer?.lastName || 'Cliente Sin Nombre',
          customerEmail: q.customer?.email || '',
          customerPhone: q.customer?.phone || '',
          serviceName: q.notes?.split('\n')[0].replace('Solicitud de cotización para el servicio ID: ', '').replace('.', '') || 'Servicio',
          serviceCategory: 'General',
          projectDescription: q.notes?.split('\n\nDescripción del cliente:\n')[1] || '',
          status: q.status || { id: 'default-pending-id', name: 'Pendiente' }, // Default status as object
          urgency: 'medium',
          estimatedBudget: Number(q.subtotal) || 0,
          totalAmount: Number(q.total) || 0,
          createdAt: q.createdAt || new Date().toISOString(),
          updatedAt: q.updatedAt,
          notes: q.notes || ''
        }));
      }
      
      setQuotes(transformedQuotes);

      // If a quote is currently selected, find its updated version and set it
      if (selectedQuote) {
        const updatedSelectedQuote = transformedQuotes.find(q => q.id === selectedQuote.id);
        if (updatedSelectedQuote) {
          setSelectedQuote(updatedSelectedQuote);
        }
      }
      
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
          status: { id: 'mock-pending-id', name: 'Pendiente' },
          totalAmount: 0,
          createdAt: '2025-01-10',
          notes: 'Instalación completa para casa de 120m²'
        },
        {
          id: '2',
          customerName: 'María González',
          customerEmail: 'maria@email.com',
          serviceName: 'Configuración de Cámaras de Seguridad',
          status: { id: 'mock-in-progress-id', name: 'En Proceso' },
          totalAmount: 740,
          createdAt: '2025-01-09',
          notes: 'Sistema de 4 cámaras para oficina'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }; // Closing brace for loadQuotes

  const handleSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const handleStatusChange = async (newStatusId: string) => {
    if (!selectedQuote) return;

    try {
      await updateQuotationStatus(selectedQuote.id, newStatusId);
      // Refresh the quotes list to show the updated status
      loadQuotes();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Error al actualizar el estado.');
    }
  };

  const getStatusColor = (statusName: string) => {
    switch (statusName) {
      case 'Pendiente':
        return '#f59e0b'; // Amber
      case 'Iniciado':
        return '#3b82f6'; // Blue
      case 'En Proceso':
        return '#8b5cf6'; // Violet
      case 'Finalizado':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

  const getStatusText = (statusName: string) => {
    switch (statusName) {
      case 'Pendiente':
        return 'Pendiente';
      case 'Iniciado':
        return 'Iniciado';
      case 'En Proceso':
        return 'En Proceso';
      case 'Finalizado':
        return 'Finalizado';
      default:
        return statusName;
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
          <h1 className={styles.pageTitle}>
            {userRole === 'admin' || userRole === 'employee' ? 'Gestión de Cotizaciones' : 'Mis Cotizaciones'}
          </h1>
          <p className={styles.pageSubtitle}>
            {userRole === 'admin' || userRole === 'employee' 
              ? 'Administra productos, precios y cantidades' 
              : 'Aquí puedes ver el historial y estado de tus cotizaciones'}
          </p>
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
                        backgroundColor: getStatusColor(quote.status.name),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {getStatusText(quote.status.name)}
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
                    <span className={styles.value}>{getStatusText(selectedQuote.status.name)}</span>
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

                {(userRole === 'admin' || userRole === 'employee') && (
                  <div className={styles.statusChanger}>
                    <label htmlFor="status-select">Cambiar Estado:</label>
                    <select 
                      id="status-select"
                      value={selectedQuote.status.id}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className={styles.statusSelect}
                    >
                      {availableStatuses.map(status => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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

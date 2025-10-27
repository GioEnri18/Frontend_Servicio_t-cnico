import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quotationsService, authService, productsService } from '../services/api';
import styles from './QuoteManagementPage.module.css';

interface Quote {
  id: string;
  quotationNumber?: string;
  tipo_servicio?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceName?: string;
  serviceCategory?: string;
  description?: string;
  projectDescription?: string;
  location?: string;
  requiredDate?: string;
  status: string | { id: string; name: string; color: string };
  urgency?: string;
  estimatedBudget?: number;
  totalAmount?: number;
  subtotal?: number;
  tax?: number;
  total?: number;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stock?: number;
  category?: string;
}

interface QuoteProduct {
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

const QuoteManagementPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  
  // Estados para gestión de productos
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<QuoteProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  
  // Estados para edición de cotización
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const [editedNotes, setEditedNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserAndQuotes();
    loadProducts();
  }, []);

  const loadUserAndQuotes = async () => {
    try {
      // Obtener información del usuario
      const profile = await authService.getProfile();
      const userData = profile.user || profile;
      setUserRole(userData.role);
      
      // Cargar cotizaciones según el rol
      await loadQuotes(userData.role);
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setError('Error al cargar información del usuario');
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const products = await productsService.getAll();
      console.log('✅ Productos cargados:', products);
      // Asegurar que price sea número
      const normalizedProducts = products.map((p: any) => ({
        ...p,
        price: Number(p.price)
      }));
      setAvailableProducts(normalizedProducts);
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const addProductToQuote = () => {
    if (!selectedProductId || productQuantity <= 0) {
      alert('⚠️ Selecciona un producto y una cantidad válida');
      return;
    }

    const product = availableProducts.find(p => p.id === selectedProductId);
    if (!product) {
      alert('❌ Producto no encontrado');
      return;
    }

    // Verificar si el producto ya está agregado
    const existingProduct = selectedProducts.find(p => p.product.id === product.id);
    if (existingProduct) {
      // Actualizar cantidad del producto existente
      setSelectedProducts(selectedProducts.map(p => 
        p.product.id === product.id 
          ? { ...p, quantity: p.quantity + productQuantity, subtotal: (p.quantity + productQuantity) * p.unitPrice }
          : p
      ));
    } else {
      // Agregar nuevo producto (asegurar que price sea número)
      const unitPrice = Number(product.price);
      const newQuoteProduct: QuoteProduct = {
        product: { ...product, price: unitPrice },
        quantity: productQuantity,
        unitPrice: unitPrice,
        subtotal: unitPrice * productQuantity
      };
      setSelectedProducts([...selectedProducts, newQuoteProduct]);
    }

    // Resetear selector
    setSelectedProductId('');
    setProductQuantity(1);
    setShowProductSelector(false);
  };

  const removeProductFromQuote = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.product.id !== productId));
  };

  const updateProductQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProductFromQuote(productId);
      return;
    }
    
    setSelectedProducts(selectedProducts.map(p => 
      p.product.id === productId 
        ? { ...p, quantity: newQuantity, subtotal: newQuantity * p.unitPrice }
        : p
    ));
  };

  const calculateTotal = (): number => {
    return selectedProducts.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleSaveChanges = async () => {
    if (!selectedQuote) {
      alert('⚠️ No hay cotización seleccionada');
      return;
    }

    try {
      setIsSaving(true);
      
      // Calcular el total SUMANDO el precio base + productos
      const productsTotal = calculateTotal();
      const finalPrice = editedPrice + productsTotal;
      
      // Preparar datos para actualizar según el DTO del backend
      const updateData: any = {
        subtotal: editedPrice,
        tax: productsTotal * 0.12, // 12% IVA sobre productos
        total: finalPrice,
      };

      // Agregar notas si hay
      if (editedNotes.trim()) {
        updateData.notes = editedNotes.trim();
      }

      // NOTA: Los productos (items) se pueden enviar opcionalmente
      if (selectedProducts.length > 0) {
        updateData.items = selectedProducts.map(sp => ({
          description: sp.product.name,
          quantity: sp.quantity,
          unitPrice: sp.unitPrice
        }));
      }
      
      console.log('💾 Guardando cambios de cotización:', updateData);

      // Llamar al backend para actualizar
      await quotationsService.update(selectedQuote.id, updateData);

      // Actualizar la cotización en el estado local
      const updatedQuotes = quotes.map(q => 
        q.id === selectedQuote.id 
          ? { ...q, subtotal: editedPrice, tax: productsTotal * 0.12, total: finalPrice, notes: editedNotes }
          : q
      );
      setQuotes(updatedQuotes);

      // Actualizar la cotización seleccionada
      setSelectedQuote({
        ...selectedQuote,
        subtotal: editedPrice,
        tax: productsTotal * 0.12,
        total: finalPrice,
        notes: editedNotes
      });

      // Mostrar mensaje de éxito con desglose
      const priceBreakdown = `
💰 Precio Base: Q ${editedPrice.toFixed(2)}
📦 Productos (${selectedProducts.length}): Q ${productsTotal.toFixed(2)}
━━━━━━━━━━━━━━━━
� Subtotal: Q ${editedPrice.toFixed(2)}
💵 IVA (12%): Q ${(productsTotal * 0.12).toFixed(2)}
━━━━━━━━━━━━━━━━
💵 TOTAL FINAL: Q ${finalPrice.toFixed(2)}`;
      
      alert(`✅ Cotización actualizada exitosamente${priceBreakdown}`);

      // Limpiar productos agregados (ya se usaron para calcular el precio)
      setSelectedProducts([]);
      setShowProductSelector(false);
      setSelectedProductId('');
      setProductQuantity(1);

    } catch (error: any) {
      console.error('❌ Error actualizando cotización:', error);
      console.error('❌ Error response:', error.response?.data);
      
      let errorMessage = 'Error al actualizar la cotización';
      
      if (error.response?.status === 400) {
        const backendMessage = error.response?.data?.message || '';
        errorMessage = `Datos inválidos: ${backendMessage}\n\nPor favor verifica los campos.`;
      } else if (error.response?.status === 401) {
        errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para actualizar esta cotización.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Cotización no encontrada.';
      }
      
      alert(`❌ ${errorMessage}\n\n${error.response?.data?.message || error.message || 'Error desconocido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const loadQuotes = async (role: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Cargando cotizaciones para rol:', role);
      
      let data;
      // Los clientes solo ven sus propias cotizaciones
      if (role === 'customer') {
        console.log('📥 Llamando a /api/quotations/my-quotations');
        data = await quotationsService.getMyQuotations();
      } else {
        // Admin y empleados ven todas las cotizaciones
        console.log('📥 Llamando a /api/quotations');
        data = await quotationsService.getAll();
      }
      
      console.log('✅ Cotizaciones obtenidas:', data);
      
      // Transformar datos del backend al formato esperado
      const transformedQuotes: Quote[] = data.map((q: any) => {
        // Función helper para convertir a número
        const toNumber = (value: any): number => {
          if (typeof value === 'number') return value;
          if (typeof value === 'string') return parseFloat(value) || 0;
          return 0;
        };
        
        return {
          id: q.id || Date.now().toString(),
          quotationNumber: q.quotationNumber || `COT-${q.id?.slice(0, 8)}`,
          tipo_servicio: q.tipo_servicio || q.serviceName,
          customerName: q.customerName || (q.customer ? `${q.customer.firstName || ''} ${q.customer.lastName || ''}`.trim() : 'Cliente'),
          customerEmail: q.customerEmail || q.customer?.email || '',
          customerPhone: q.customerPhone || q.customer?.phone || '',
          serviceName: q.serviceName || q.tipo_servicio || 'Servicio',
          serviceCategory: q.serviceCategory || 'General',
          description: q.description || q.projectDescription || '',
          projectDescription: q.projectDescription || q.description || '',
          location: q.location || '',
          requiredDate: q.requiredDate || '',
          status: q.status || 'PENDIENTE',
          urgency: q.urgency || 'medium',
          estimatedBudget: toNumber(q.estimatedBudget),
          totalAmount: toNumber(q.totalAmount || q.total),
          subtotal: toNumber(q.subtotal),
          tax: toNumber(q.tax),
          total: toNumber(q.total || q.totalAmount),
          createdAt: q.createdAt || new Date().toISOString(),
          updatedAt: q.updatedAt,
          notes: q.notes || ''
        };
      });
      
      setQuotes(transformedQuotes);
      
    } catch (error: any) {
      console.error('❌ Error al cargar cotizaciones:', error);
      
      if (error.response?.status === 403) {
        setError('No tienes permisos para ver las cotizaciones');
      } else if (error.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      } else {
        setError('Error al cargar las cotizaciones del servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    // Inicializar valores editables
    setEditedPrice(quote.totalAmount || 0);
    setEditedNotes('');
    // Limpiar productos seleccionados al cambiar de cotización
    setSelectedProducts([]);
    setShowProductSelector(false);
    setSelectedProductId('');
    setProductQuantity(1);
  };

  // Helper para formatear moneda de forma segura
  const formatCurrency = (value: any): string => {
    const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    return numValue.toFixed(2);
  };

  const getStatusColor = (status: string | { id: string; name: string; color: string }) => {
    if (typeof status === 'object') {
      return status.color;
    }
    
    // Colores actualizados según solicitud
    switch (status.toUpperCase()) {
      case 'PENDIENTE':
      case 'PENDING':
        return '#FFA500'; // Naranja
      case 'EN PROCESO':
      case 'IN_PROGRESS':
      case 'EN_PROCESO':
        return '#3b82f6'; // Azul
      case 'COMPLETADO':
      case 'COMPLETADA':
      case 'COMPLETED':
        return '#10b981'; // Verde
      case 'RECHAZADO':
      case 'RECHAZADA':
      case 'REJECTED':
        return '#ef4444'; // Rojo
      case 'APROBADA':
      case 'APPROVED':
        return '#28A745'; // Verde oscuro
      case 'CANCELADA':
      case 'CANCELLED':
        return '#6C757D'; // Gris
      default:
        return '#6b7280'; // Gris por defecto
    }
  };

  const getStatusText = (status: string | { id: string; name: string; color: string }) => {
    if (typeof status === 'object') {
      return status.name;
    }
    
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
            <button onClick={() => loadUserAndQuotes()} className={styles.retryButton}>
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
                  <p className={styles.quoteTotal}>Total: Q. {formatCurrency(quote.totalAmount)}</p>
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
              <>
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
                      <span className={styles.label}>Fecha:</span>
                      <span className={styles.value}>{new Date(selectedQuote.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Total:</span>
                      <span className={styles.value}>Q. {formatCurrency(selectedQuote.totalAmount)}</span>
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

                {/* Controles de Admin/Empleado */}
                {(userRole === 'admin' || userRole === 'employee') && (
                  <div className={styles.adminControls} style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                  }}>
                    <h3 style={{ marginBottom: '1rem', color: '#495057' }}>
                      🔧 Panel de Gestión ({userRole === 'admin' ? 'Administrador' : 'Empleado'})
                    </h3>
                    
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {/* Precio Base de Cotización */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                          💰 Precio Base de Cotización (Q):
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(parseFloat(e.target.value) || 0)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ced4da',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            backgroundColor: 'white',
                            color: '#212529'
                          }}
                        />
                        <div style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '0.5rem' }}>
                          💡 Precio base del servicio (mano de obra, diagnóstico, etc.)
                        </div>
                      </div>

                      {/* Precio de Productos (solo lectura) */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                          📦 Precio de Productos (Q):
                        </label>
                        <input
                          type="text"
                          value={`Q ${calculateTotal().toFixed(2)}`}
                          disabled
                          readOnly
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ced4da',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            backgroundColor: '#f8f9fa',
                            color: '#495057',
                            fontWeight: '600'
                          }}
                        />
                        <div style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '0.5rem' }}>
                          {selectedProducts.length > 0 
                            ? `✅ ${selectedProducts.length} producto(s) agregado(s)`
                            : '📭 No hay productos agregados'
                          }
                        </div>
                      </div>

                      {/* Total Final (suma de ambos) */}
                      <div style={{
                        backgroundColor: '#f0f9ff',
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        padding: '1rem'
                      }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e40af' }}>
                          💵 TOTAL FINAL (Q):
                        </label>
                        <input
                          type="text"
                          value={`Q ${(editedPrice + calculateTotal()).toFixed(2)}`}
                          disabled
                          readOnly
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #3b82f6',
                            borderRadius: '6px',
                            fontSize: '1.25rem',
                            backgroundColor: 'white',
                            color: '#1e40af',
                            fontWeight: 'bold',
                            textAlign: 'center'
                          }}
                        />
                        <div style={{ fontSize: '0.85rem', color: '#1e40af', marginTop: '0.5rem', textAlign: 'center' }}>
                          ℹ️ Precio Base (Q {editedPrice.toFixed(2)}) + Productos (Q {calculateTotal().toFixed(2)})
                        </div>
                      </div>

                      {/* Notas Internas (solo admin/empleado) */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                          Notas Internas:
                        </label>
                        <textarea
                          rows={3}
                          value={editedNotes}
                          onChange={(e) => setEditedNotes(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ced4da',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            resize: 'vertical',
                            color: '#212529',
                            backgroundColor: 'white'
                          }}
                          placeholder="Agregar notas internas visibles solo para admin/empleados..."
                        />
                      </div>

                      {/* Sección de Productos */}
                      <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        border: '2px solid #dee2e6'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div>
                            <h4 style={{ margin: 0, color: '#495057' }}>📦 Productos de la Cotización</h4>
                            <small style={{ color: '#6c757d', fontSize: '0.85rem' }}>
                              ℹ️ Los productos se usan para calcular el precio total
                            </small>
                          </div>
                          <button
                            onClick={() => {
                              console.log('🔄 Toggling product selector:', !showProductSelector);
                              setShowProductSelector(!showProductSelector);
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.9rem'
                            }}
                          >
                            {showProductSelector ? '❌ Cerrar' : '➕ Agregar Producto'}
                          </button>
                        </div>

                        {/* Selector de productos */}
                        {showProductSelector && (
                          <div style={{
                            padding: '1rem',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            marginBottom: '1rem'
                          }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                              <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                                  Producto:
                                </label>
                                <select
                                  value={selectedProductId}
                                  onChange={(e) => setSelectedProductId(e.target.value)}
                                  disabled={loadingProducts}
                                  style={{
                                    width: '100%',
                                    padding: '0.6rem',
                                    border: '1px solid #ced4da',
                                    borderRadius: '4px',
                                    fontSize: '0.95rem',
                                    color: '#212529',
                                    backgroundColor: 'white'
                                  }}
                                >
                                  <option value="">
                                    {loadingProducts ? '⏳ Cargando productos...' : '-- Seleccionar producto --'}
                                  </option>
                                  {availableProducts.map(product => (
                                    <option key={product.id} value={product.id}>
                                      {product.name} - Q {Number(product.price).toFixed(2)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                                  Cantidad:
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={productQuantity}
                                  onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                                  style={{
                                    width: '100%',
                                    padding: '0.6rem',
                                    border: '1px solid #ced4da',
                                    borderRadius: '4px',
                                    fontSize: '0.95rem',
                                    color: '#212529',
                                    backgroundColor: 'white'
                                  }}
                                />
                              </div>

                              <button
                                onClick={addProductToQuote}
                                style={{
                                  padding: '0.6rem 1.2rem',
                                  backgroundColor: '#28a745',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  fontSize: '0.9rem'
                                }}
                              >
                                ✅ Agregar
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Lista de productos agregados */}
                        {selectedProducts.length > 0 ? (
                          <div style={{ marginTop: '1rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#e9ecef' }}>
                                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Producto</th>
                                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', width: '100px' }}>Cantidad</th>
                                  <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6', width: '120px' }}>Precio Unit.</th>
                                  <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6', width: '120px' }}>Subtotal</th>
                                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', width: '80px' }}>Acción</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedProducts.map((item) => (
                                  <tr key={item.product.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: '0.75rem' }}>
                                      <div>
                                        <strong>{item.product.name}</strong>
                                        {item.product.sku && (
                                          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>SKU: {item.product.sku}</div>
                                        )}
                                      </div>
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                      <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateProductQuantity(item.product.id, parseInt(e.target.value) || 1)}
                                        style={{
                                          width: '60px',
                                          padding: '0.3rem',
                                          border: '1px solid #ced4da',
                                          borderRadius: '4px',
                                          textAlign: 'center'
                                        }}
                                      />
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                      Q {Number(item.unitPrice).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>
                                      Q {Number(item.subtotal).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                      <button
                                        onClick={() => removeProductFromQuote(item.product.id)}
                                        style={{
                                          padding: '0.3rem 0.6rem',
                                          backgroundColor: '#dc3545',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          fontSize: '0.85rem'
                                        }}
                                        title="Eliminar producto"
                                      >
                                        🗑️
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                                  <td colSpan={3} style={{ padding: '0.75rem', textAlign: 'right', borderTop: '2px solid #dee2e6' }}>
                                    TOTAL:
                                  </td>
                                  <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '1.1rem', color: '#28a745', borderTop: '2px solid #dee2e6' }}>
                                    Q {calculateTotal().toFixed(2)}
                                  </td>
                                  <td style={{ borderTop: '2px solid #dee2e6' }}></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        ) : (
                          <div style={{
                            padding: '2rem',
                            textAlign: 'center',
                            color: '#6c757d',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px'
                          }}>
                            <p style={{ margin: 0 }}>📦 No hay productos agregados</p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                              Haz clic en "Agregar Producto" para comenzar
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Botones de Acción */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                          disabled={isSaving}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            backgroundColor: isSaving ? '#6c757d' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            opacity: isSaving ? 0.7 : 1
                          }}
                          onClick={handleSaveChanges}
                        >
                          {isSaving ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                        </button>
                        <button
                          style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setSelectedQuote(null);
                            setSelectedProducts([]);
                            setShowProductSelector(false);
                            setSelectedProductId('');
                            setProductQuantity(1);
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
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
// ruta: frontend/src/pages/admin/QuoteManagementPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './QuoteManagementPage.module.css';

// --- Tipos ---
interface Product {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  category: string;
  inStock: number;
}

interface QuoteItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Quote {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  items: QuoteItem[];
  totalAmount: number;
  createdAt: string;
  notes: string;
}

// --- Datos simulados ---
const mockProducts: Product[] = [
  { id: '1', name: 'Cable Eléctrico 12 AWG', description: 'Cable de cobre para instalaciones eléctricas', unitPrice: 25.50, category: 'Electricidad', inStock: 150 },
  { id: '2', name: 'Tomacorriente Doble', description: 'Tomacorriente con conexión a tierra', unitPrice: 15.75, category: 'Electricidad', inStock: 80 },
  { id: '3', name: 'Interruptor Simple', description: 'Interruptor de una via', unitPrice: 12.00, category: 'Electricidad', inStock: 120 },
  { id: '4', name: 'Cámara IP 1080p', description: 'Cámara de seguridad IP con visión nocturna', unitPrice: 185.00, category: 'Seguridad', inStock: 25 },
  { id: '5', name: 'Router Empresarial', description: 'Router para redes empresariales', unitPrice: 350.00, category: 'Redes', inStock: 15 },
  { id: '6', name: 'Switch 24 puertos', description: 'Switch administrable 24 puertos', unitPrice: 450.00, category: 'Redes', inStock: 8 },
];

const mockQuotes: Quote[] = [
  {
    id: '1',
    customerName: 'Juan Pérez',
    customerEmail: 'juan@email.com',
    serviceName: 'Instalación Eléctrica Residencial',
    status: 'pending',
    items: [],
    totalAmount: 0,
    createdAt: '2025-10-08',
    notes: 'Instalación completa para casa de 120m²'
  },
  {
    id: '2',
    customerName: 'María González',
    customerEmail: 'maria@email.com',
    serviceName: 'Configuración de Cámaras de Seguridad',
    status: 'in-progress',
    items: [
      { id: '1', productId: '4', productName: 'Cámara IP 1080p', quantity: 4, unitPrice: 185.00, subtotal: 740.00 }
    ],
    totalAmount: 740.00,
    createdAt: '2025-10-07',
    notes: 'Sistema de 4 cámaras para oficina'
  }
];

// --- Iconos SVG ---
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
  </svg>
);

const QuoteManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [notification, setNotification] = useState<string>('');

  // Manejar nuevas cotizaciones desde la página de creación
  useEffect(() => {
    if (location.state?.newQuote) {
      const newQuote = location.state.newQuote;
      
      // Verificar que la cotización no esté ya en la lista
      setQuotes(prev => {
        const exists = prev.find(q => q.id === newQuote.id);
        if (exists) {
          return prev;
        }
        return [newQuote, ...prev];
      });
      
      setSelectedQuote(newQuote);
      setNotification(location.state.message || 'Cotización creada exitosamente');
      
      // Limpiar el state para evitar que se agregue de nuevo
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 100);
      
      // Ocultar notificación después de 3 segundos
      setTimeout(() => setNotification(''), 3000);
    }
  }, [location.state]);

  // Función para seleccionar una cotización
  const handleSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsAddingProduct(false);
  };

  // Función para agregar producto a la cotización
  const handleAddProduct = () => {
    if (!selectedQuote || !selectedProduct) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem: QuoteItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      quantity: quantity,
      unitPrice: product.unitPrice,
      subtotal: quantity * product.unitPrice
    };

    const updatedQuote = {
      ...selectedQuote,
      items: [...selectedQuote.items, newItem],
      totalAmount: selectedQuote.totalAmount + newItem.subtotal
    };

    setSelectedQuote(updatedQuote);
    setQuotes(quotes.map(q => q.id === selectedQuote.id ? updatedQuote : q));
    
    // Reset form
    setSelectedProduct('');
    setQuantity(1);
    setIsAddingProduct(false);
  };

  // Función para eliminar producto de la cotización
  const handleRemoveProduct = (itemId: string) => {
    if (!selectedQuote) return;

    const itemToRemove = selectedQuote.items.find(item => item.id === itemId);
    if (!itemToRemove) return;

    const updatedQuote = {
      ...selectedQuote,
      items: selectedQuote.items.filter(item => item.id !== itemId),
      totalAmount: selectedQuote.totalAmount - itemToRemove.subtotal
    };

    setSelectedQuote(updatedQuote);
    setQuotes(quotes.map(q => q.id === selectedQuote.id ? updatedQuote : q));
  };

  // Función para actualizar estado de la cotización
  const handleUpdateStatus = (status: Quote['status']) => {
    if (!selectedQuote) return;

    const updatedQuote = { ...selectedQuote, status };
    setSelectedQuote(updatedQuote);
    setQuotes(quotes.map(q => q.id === selectedQuote.id ? updatedQuote : q));
  };

  return (
    <div className={styles.quoteManagementPage}>
      {/* Notificación */}
      {notification && (
        <div className={styles.notification}>
          {notification}
        </div>
      )}
      
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.backButton}>
            ← Volver al Panel Principal
          </Link>
          <h1 className={styles.pageTitle}>Gestión de Cotizaciones</h1>
          <p className={styles.pageSubtitle}>Administra productos, precios y cantidades</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Panel izquierdo - Lista de cotizaciones */}
          <div className={styles.quotesPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Cotizaciones Pendientes</h2>
              <Link to="/cotizaciones/new" className={styles.newQuoteButton}>
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
                    <span className={`${styles.status} ${styles[quote.status]}`}>
                      {quote.status === 'pending' ? 'Pendiente' :
                       quote.status === 'in-progress' ? 'En Proceso' :
                       quote.status === 'completed' ? 'Completada' : 'Rechazada'}
                    </span>
                  </div>
                  <p className={styles.quoteService}>{quote.serviceName}</p>
                  <p className={styles.quoteTotal}>Total: Q. {quote.totalAmount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Panel derecho - Detalles de cotización */}
          <div className={styles.detailsPanel}>
            {selectedQuote ? (
              <>
                {/* Información del cliente */}
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
                      <span className={styles.value}>{selectedQuote.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Lista de productos */}
                <div className={styles.productsSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.panelTitle}>Productos y Materiales</h2>
                    <button 
                      className={styles.addButton}
                      onClick={() => setIsAddingProduct(true)}
                    >
                      <PlusIcon /> Agregar Producto
                    </button>
                  </div>

                  {/* Formulario para agregar producto */}
                  {isAddingProduct && (
                    <div className={styles.addProductForm}>
                      <div className={styles.formRow}>
                        <select 
                          value={selectedProduct}
                          onChange={(e) => setSelectedProduct(e.target.value)}
                          className={styles.productSelect}
                        >
                          <option value="">Seleccionar producto...</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} - Q. {product.unitPrice}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className={styles.quantityInput}
                          placeholder="Cantidad"
                        />
                        <button 
                          onClick={handleAddProduct}
                          className={styles.confirmButton}
                          disabled={!selectedProduct}
                        >
                          Agregar
                        </button>
                        <button 
                          onClick={() => setIsAddingProduct(false)}
                          className={styles.cancelButton}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tabla de productos */}
                  <div className={styles.productsTable}>
                    <div className={styles.tableHeader}>
                      <span>Producto</span>
                      <span>Cantidad</span>
                      <span>Precio Unit.</span>
                      <span>Subtotal</span>
                      <span>Acciones</span>
                    </div>
                    {selectedQuote.items.map(item => (
                      <div key={item.id} className={styles.tableRow}>
                        <span className={styles.productName}>{item.productName}</span>
                        <span>{item.quantity}</span>
                        <span>Q. {item.unitPrice.toFixed(2)}</span>
                        <span>Q. {item.subtotal.toFixed(2)}</span>
                        <div className={styles.actions}>
                          <button 
                            onClick={() => handleRemoveProduct(item.id)}
                            className={styles.deleteButton}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className={styles.totalSection}>
                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>Total General:</span>
                      <span className={styles.totalAmount}>Q. {selectedQuote.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Acciones de estado */}
                <div className={styles.statusActions}>
                  <h3 className={styles.panelTitle}>Estado de la Cotización</h3>
                  <div className={styles.statusButtons}>
                    <button 
                      className={`${styles.statusButton} ${styles.pending}`}
                      onClick={() => handleUpdateStatus('pending')}
                    >
                      Pendiente
                    </button>
                    <button 
                      className={`${styles.statusButton} ${styles.inProgress}`}
                      onClick={() => handleUpdateStatus('in-progress')}
                    >
                      En Proceso
                    </button>
                    <button 
                      className={`${styles.statusButton} ${styles.completed}`}
                      onClick={() => handleUpdateStatus('completed')}
                    >
                      Completada
                    </button>
                    <button 
                      className={`${styles.statusButton} ${styles.rejected}`}
                      onClick={() => handleUpdateStatus('rejected')}
                    >
                      Rechazada
                    </button>
                  </div>
                </div>
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
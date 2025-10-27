import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsService, categoriesService, authService } from '../services/api';
import styles from './ProductsManagementPage.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock?: number;
  sku?: string;
  weight?: number;
  specifications?: string;
  isActive?: boolean;
  createdAt?: string;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  sku: string;
  weight: number;
  specifications: string;
}

const ProductsManagementPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  // Formulario de producto
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    stock: 0,
    sku: '',
    weight: 0,
    specifications: ''
  });

  useEffect(() => {
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      const profile = await authService.getProfile();
      const userData = profile.user || profile;
      setUserRole(userData.role);

      if (userData.role !== 'admin' && userData.role !== 'employee') {
        setError('⛔ Acceso denegado. Solo administradores y empleados pueden gestionar productos.');
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      await Promise.all([loadProducts(), loadCategories()]);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setError('Error al cargar la información');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll();
      console.log('✅ Productos cargados:', data);
      // Normalizar precios a números
      const normalizedProducts = data.map((p: any) => ({
        ...p,
        price: Number(p.price)
      }));
      setProducts(normalizedProducts);
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      setError('Error al cargar productos');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      console.log('✅ Categorías cargadas:', data);
      setCategories(data);
    } catch (error) {
      console.error('❌ Error cargando categorías:', error);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      stock: 0,
      sku: '',
      weight: 0,
      specifications: ''
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      stock: product.stock || 0,
      sku: product.sku || '',
      weight: product.weight || 0,
      specifications: product.specifications || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      stock: 0,
      sku: '',
      weight: 0,
      specifications: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.categoryId) {
      alert('⚠️ Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.price <= 0) {
      alert('⚠️ El precio debe ser mayor a 0');
      return;
    }

    setIsSaving(true);
    try {
      const productData: any = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price), // Asegurar que sea número
        categoryId: formData.categoryId
      };

      // Agregar campos opcionales solo si tienen valor
      if (formData.stock > 0) productData.stock = formData.stock;
      if (formData.sku) productData.sku = formData.sku;
      if (formData.weight > 0) productData.weight = formData.weight;
      if (formData.specifications) productData.specifications = formData.specifications;

      if (editingProduct) {
        await productsService.update(editingProduct.id, productData);
        alert('✅ Producto actualizado correctamente');
      } else {
        await productsService.create(productData);
        alert('✅ Producto creado correctamente');
      }

      await loadProducts();
      closeModal();
    } catch (error: any) {
      console.error('❌ Error guardando producto:', error);
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${productName}"?`)) {
      return;
    }

    try {
      await productsService.delete(productId);
      alert('✅ Producto eliminado correctamente');
      await loadProducts();
    } catch (error: any) {
      console.error('❌ Error eliminando producto:', error);
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const toggleActiveStatus = async (product: Product) => {
    try {
      await productsService.update(product.id, { isActive: !product.isActive });
      alert(`✅ Producto ${!product.isActive ? 'activado' : 'desactivado'} correctamente`);
      await loadProducts();
    } catch (error: any) {
      console.error('❌ Error actualizando estado:', error);
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || product.categoryId === filterCategory;
    
    const matchesActive = filterActive === 'all' || 
                         (filterActive === 'active' && product.isActive) ||
                         (filterActive === 'inactive' && !product.isActive);
    
    return matchesSearch && matchesCategory && matchesActive;
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error && userRole !== 'admin' && userRole !== 'employee') {
    return (
      <div className={styles.accessDenied}>
        <h2>⛔ Acceso Denegado</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.productsPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>📦 Gestión de Productos</h1>
          <p className={styles.pageSubtitle}>
            Administra el catálogo de productos y servicios
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
            🏠 Dashboard
          </button>
          {userRole === 'admin' && (
            <button onClick={() => navigate('/admin-dashboard')} className={styles.backButton}>
              ⚙️ Panel Admin
            </button>
          )}
        </div>
      </div>

      <div className={styles.container}>
        {/* Controles superiores */}
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="🔍 Buscar por nombre, descripción o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
              className={styles.filterSelect}
            >
              <option value="all">Todos los estados</option>
              <option value="active">✅ Activos</option>
              <option value="inactive">❌ Inactivos</option>
            </select>

            <button onClick={openCreateModal} className={styles.createButton}>
              ➕ Crear Producto
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statValue}>{products.length}</div>
            <div className={styles.statLabel}>Total Productos</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statValue}>{products.filter(p => p.isActive).length}</div>
            <div className={styles.statLabel}>Activos</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏷️</div>
            <div className={styles.statValue}>{categories.length}</div>
            <div className={styles.statLabel}>Categorías</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statValue}>
              Q {products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0).toFixed(2)}
            </div>
            <div className={styles.statLabel}>Valor Inventario</div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className={styles.tableContainer}>
          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className={!product.isActive ? styles.inactive : ''}>
                  <td className={styles.sku}>{product.sku || '-'}</td>
                  <td>
                    <div className={styles.productInfo}>
                      <strong>{product.name}</strong>
                      <small>{product.description}</small>
                    </div>
                  </td>
                  <td>
                    <span className={styles.categoryBadge}>
                      {product.category?.name || categories.find(c => c.id === product.categoryId)?.name || 'Sin categoría'}
                    </span>
                  </td>
                  <td className={styles.price}>Q {Number(product.price).toFixed(2)}</td>
                  <td className={styles.stock}>
                    <span className={styles.stockBadge}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActiveStatus(product)}
                      className={`${styles.statusBadge} ${product.isActive ? styles.active : styles.inactiveStatus}`}
                    >
                      {product.isActive ? '✅ Activo' : '❌ Inactivo'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => openEditModal(product)}
                        className={styles.editButton}
                        title="Editar producto"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className={styles.deleteButton}
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    <div>
                      <h3>📦 No hay productos</h3>
                      <p>No se encontraron productos con los filtros aplicados</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de crear/editar producto */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingProduct ? '✏️ Editar Producto' : '➕ Crear Nuevo Producto'}</h2>
              <button onClick={closeModal} className={styles.closeButton}>✖</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nombre del Producto *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Laptop Dell XPS 15"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>SKU (Código)</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    placeholder="Ej: DELL-XPS-15-001"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Descripción *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe el producto..."
                  rows={3}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Categoría *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    required
                  >
                    <option value="">-- Seleccionar categoría --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Precio (Q) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Stock (Inventario)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Peso (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Especificaciones Técnicas (JSON)</label>
                <textarea
                  value={formData.specifications}
                  onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                  placeholder='{"processor": "Intel i7", "ram": "16GB", "storage": "512GB SSD"}'
                  rows={3}
                />
                <small style={{ color: '#6c757d' }}>
                  ℹ️ Formato JSON: {"{"}"key": "value"{"}"}
                </small>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={closeModal} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving} className={styles.saveButton}>
                  {isSaving ? '⏳ Guardando...' : editingProduct ? '💾 Actualizar' : '✅ Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagementPage;

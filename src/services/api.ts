import axios from 'axios';

// 1. Cargar la URL base desde las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 2. Crear una única instancia de Axios bien configurada
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`, // El backend usa un prefijo /api global
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// 3. Interceptor para añadir el token JWT a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 4. Interceptor para manejar errores globales y deslogueo automático
apiClient.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, la devuelve sin más
  (error) => {
    console.error('❌ API Response Error:', error.response || error.message);

    // Si el error es 401 (No autorizado), solo limpiar datos de sesión SIN redirect automático
    if (error.response && error.response.status === 401) {
      console.warn('Token inválido o expirado, limpiando sesión');
      
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_email');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // NO hacer redirect automático, dejar que los componentes manejen el error
    }
    
    return Promise.reject(error);
  }
);

// Función helper para extraer los datos de la respuesta
const handleResponse = (response: any) => response.data;

// === SERVICIOS DE API CORREGIDOS Y SIMPLIFICADOS ===

// Autenticación (Coincide con /api/auth/*)
export const authService = {
  login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }).then(handleResponse),
  register: (userData: any) => apiClient.post('/auth/register', userData).then(handleResponse),
  getProfile: () => apiClient.get('/auth/me').then(handleResponse), // Corregido a /auth/me
};

// Usuarios (Coincide con /api/users/*)
export const userService = {
  getAll: () => apiClient.get('/users').then(handleResponse),
  getCustomers: () => apiClient.get('/users/customers').then(handleResponse),
  getEmployees: () => apiClient.get('/users/employees').then(handleResponse),
  getById: (id: string) => apiClient.get(`/users/${id}`).then(handleResponse),
  update: (id: string, userData: any) => apiClient.patch(`/users/${id}`, userData).then(handleResponse), // Usar PATCH como en el backend
  delete: (id: string) => apiClient.delete(`/users/${id}`).then(handleResponse),
  updateProfile: (profileData: any) => apiClient.patch('/users/profile', profileData).then(handleResponse),
};

// Productos (Coincide con /api/products/*)
export const productsService = {
  getAll: () => apiClient.get('/products').then(handleResponse),
  getById: (id: string) => apiClient.get(`/products/${id}`).then(handleResponse),
  create: (productData: any) => apiClient.post('/products', productData).then(handleResponse),
  update: (id: string, productData: any) => apiClient.patch(`/products/${id}`, productData).then(handleResponse), // Usar PATCH
  delete: (id: string) => apiClient.delete(`/products/${id}`).then(handleResponse),
};

// Categorías (Coincide con /api/categories/*)
export const categoriesService = {
  getAll: () => apiClient.get('/categories').then(handleResponse),
  getById: (id: string) => apiClient.get(`/categories/${id}`).then(handleResponse),
  create: (categoryData: any) => apiClient.post('/categories', categoryData).then(handleResponse),
  update: (id: string, categoryData: any) => apiClient.patch(`/categories/${id}`, categoryData).then(handleResponse),
  delete: (id: string) => apiClient.delete(`/categories/${id}`).then(handleResponse),
};

// Cotizaciones (Estructura actualizada según backend)
export const quotationsService = {
  getAll: () => apiClient.get('/quotations').then(handleResponse),
  getMyQuotations: () => apiClient.get('/quotations/my-quotations').then(handleResponse),
  getById: (id: string) => apiClient.get(`/quotations/${id}`).then(handleResponse),
  create: (quotationData: {
    serviceId: string;
    description: string;
    location: string;
    requiredDate: string;
    photos?: string[];
  }) => apiClient.post('/quotations', quotationData).then(handleResponse),
  update: (id: string, quotationData: any) => apiClient.patch(`/quotations/${id}`, quotationData).then(handleResponse),
  delete: (id: string) => apiClient.delete(`/quotations/${id}`).then(handleResponse),
};

// Servicios (Coincide con /api/services/*)
export const servicesService = {
  getAll: () => apiClient.get('/services').then(handleResponse),
  getMyServices: () => apiClient.get('/services/my-services').then(handleResponse),
  getAssignedToMe: () => apiClient.get('/services/assigned-to-me').then(handleResponse),
  getById: (id: string) => apiClient.get(`/services/${id}`).then(handleResponse),
  create: (serviceData: any) => apiClient.post('/services', serviceData).then(handleResponse),
  update: (id: string, serviceData: any) => apiClient.patch(`/services/${id}`, serviceData).then(handleResponse), // Usar PATCH
  delete: (id: string) => apiClient.delete(`/services/${id}`).then(handleResponse),
};

// Reportes (Coincide con /api/reports/*)
export const reportsService = {
  getDashboardStats: () => apiClient.get('/reports/dashboard').then(handleResponse),
  getMonthlyReport: (year: number, month: number) => apiClient.get(`/reports/monthly`, { params: { year, month } }).then(handleResponse),
  getCustomerHistory: (id: string) => apiClient.get(`/reports/customer-history/${id}`).then(handleResponse),
};

// Estados (Coincide con /api/statuses/*)
export const statusesService = {
  getAll: () => apiClient.get('/statuses').then(handleResponse),
};

// Función de utilidad para verificar la conectividad del backend
export const checkConnectivity = async () => {
  try {
    // El backend no tiene un endpoint /health, pero podemos usar uno que no requiera auth, como /api/products
    const response = await apiClient.get('/products', { timeout: 3000 });
    // Si la respuesta es 2xx, el backend está accesible
    return { success: response.status >= 200 && response.status < 300, status: response.status };
  } catch (error: any) {
    console.error('⚠️ Backend connectivity check failed:', error.message);
    return { success: false, error: error.message };
  }
};

export default apiClient;
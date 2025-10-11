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
    console.log(`🚀 Sending request to: ${config.url}`);
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

    // Si el error es 401 (No autorizado), borra los datos de sesión y redirige al login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_email'); // O cualquier otro dato de usuario
      
      // Evita bucles de redirección si ya estamos en el login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Función helper para extraer los datos de la respuesta
const handleResponse = (response) => response.data;

// === SERVICIOS DE API CORREGIDOS Y SIMPLIFICADOS ===

// Autenticación (Coincide con /api/auth/*)
export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }).then(handleResponse),
  register: (userData) => apiClient.post('/auth/register', userData).then(handleResponse),
  getProfile: () => apiClient.get('/auth/me').then(handleResponse), // Corregido a /auth/me
};

// Usuarios (Coincide con /api/users/*)
export const userService = {
  getAll: () => apiClient.get('/users').then(handleResponse),
  getCustomers: () => apiClient.get('/users/customers').then(handleResponse),
  getEmployees: () => apiClient.get('/users/employees').then(handleResponse),
  getById: (id) => apiClient.get(`/users/${id}`).then(handleResponse),
  update: (id, userData) => apiClient.patch(`/users/${id}`, userData).then(handleResponse), // Usar PATCH como en el backend
  delete: (id) => apiClient.delete(`/users/${id}`).then(handleResponse),
  updateProfile: (profileData) => apiClient.patch('/users/profile', profileData).then(handleResponse),
};

// Productos (Coincide con /api/products/*)
export const productsService = {
  getAll: () => apiClient.get('/products').then(handleResponse),
  getById: (id) => apiClient.get(`/products/${id}`).then(handleResponse),
  create: (productData) => apiClient.post('/products', productData).then(handleResponse),
  update: (id, productData) => apiClient.patch(`/products/${id}`, productData).then(handleResponse), // Usar PATCH
  delete: (id) => apiClient.delete(`/products/${id}`).then(handleResponse),
};

// Cotizaciones (Corregido de /quotes a /quotations)
export const quotationsService = {
  getAll: () => apiClient.get('/quotations').then(handleResponse),
  getMyQuotations: () => apiClient.get('/quotations/my-quotations').then(handleResponse),
  getById: (id) => apiClient.get(`/quotations/${id}`).then(handleResponse),
  create: (quotationData) => apiClient.post('/quotations', quotationData).then(handleResponse),
  update: (id, quotationData) => apiClient.patch(`/quotations/${id}`, quotationData).then(handleResponse), // Usar PATCH
  delete: (id) => apiClient.delete(`/quotations/${id}`).then(handleResponse),
};

// Servicios (Coincide con /api/services/*)
export const servicesService = {
  getAll: () => apiClient.get('/services').then(handleResponse),
  getMyServices: () => apiClient.get('/services/my-services').then(handleResponse),
  getAssignedToMe: () => apiClient.get('/services/assigned-to-me').then(handleResponse),
  getById: (id) => apiClient.get(`/services/${id}`).then(handleResponse),
  create: (serviceData) => apiClient.post('/services', serviceData).then(handleResponse),
  update: (id, serviceData) => apiClient.patch(`/services/${id}`, serviceData).then(handleResponse), // Usar PATCH
  delete: (id) => apiClient.delete(`/services/${id}`).then(handleResponse),
};

// Reportes (Coincide con /api/reports/*)
export const reportsService = {
  getDashboardStats: () => apiClient.get('/reports/dashboard').then(handleResponse),
  getMonthlyReport: (year, month) => apiClient.get(`/reports/monthly`, { params: { year, month } }).then(handleResponse),
  getCustomerHistory: (id) => apiClient.get(`/reports/customer-history/${id}`).then(handleResponse),
};

// Función de utilidad para verificar la conectividad del backend
export const checkConnectivity = async () => {
  try {
    // El backend no tiene un endpoint /health, pero podemos usar uno que no requiera auth, como /api/products
    const response = await apiClient.get('/products', { timeout: 3000 });
    // Si la respuesta es 2xx, el backend está accesible
    return { success: response.status >= 200 && response.status < 300, status: response.status };
  } catch (error) {
    console.error('⚠️ Backend connectivity check failed:', error.message);
    return { success: false, error: error.message };
  }
};

export default apiClient;

import axios from 'axios';

// La URL base del backend de NestJS
const BASE_URL = 'http://localhost:3000'; // Ajustado: Se eliminó /api

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a las solicitudes autenticadas
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    // Aseguramos que config.headers exista
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Opcional: Interceptor de respuestas para manejar errores de token (ej. 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('jwt_token');
      // Redirigir al login, evitando bucles infinitos si el login falla
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


export default apiClient;

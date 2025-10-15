import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // 👈 imprescindible para cookies
});

// en src/services/api.ts
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // ignora /auth/me si estás en login
      // opcional: redirige si estás en páginas protegidas
    }
    return Promise.reject(error);
  }
);


export default apiClient;


import apiClient from './api';

export async function me() {
  const { data } = await apiClient.get('/auth/me'); // devuelve 401 si no hay cookie
  return data.user;
}

export async function login(email: string, password: string) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  // El backend setea la cookie 'token' por Set-Cookie; axios no la expone en data
  return data.user;
}

export async function register(payload: {
  firstName: string; lastName: string; email: string; password: string;
  phone?: string; company?: string; address?: string;
}) {
  const { data } = await apiClient.post('/auth/register', payload);
  return data.user;
}

export async function logout() {
  await apiClient.post('/auth/logout');
}

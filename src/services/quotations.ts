import apiClient from './api';

export const quotationsService = {
  getAll: () => apiClient.get('/quotations').then(res => res.data),
  getMyQuotations: () => apiClient.get('/quotations/my-quotations').then(res => res.data),
  getById: (id: string) => apiClient.get(`/quotations/${id}`).then(res => res.data),
  create: (quotationData: any) => apiClient.post('/quotations', quotationData).then(res => res.data),
  update: (id: string, quotationData: any) => apiClient.patch(`/quotations/${id}`, quotationData).then(res => res.data),
  remove: (id: string) => apiClient.delete(`/quotations/${id}`).then(res => res.data),
  getStatuses: () => apiClient.get('/statuses').then(res => res.data),
};

export async function updateQuotationStatus(id: string, statusId: string) {
  const res = await apiClient.patch(`/quotations/${id}`, { statusId }, { headers: { 'Content-Type': 'application/json' }});
  return res.data;
}
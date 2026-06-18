import api from './api';

export const pumpService = {
  getAll: (params) => api.get('/pumps', { params }),
  getById: (id) => api.get(`/pumps/${id}`),
  create: (data) => api.post('/pumps', data),
  update: (id, data) => api.put(`/pumps/${id}`, data),
  delete: (id) => api.delete(`/pumps/${id}`),
  getMyPumps: () => api.get('/pumps/my'),
};

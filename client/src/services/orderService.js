import api from './api';

export const orderService = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/status/${id}`, { status }),
  getDealerOrders: () => api.get('/orders/dealer'),
};

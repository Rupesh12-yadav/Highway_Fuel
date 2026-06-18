export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const FUEL_TYPES = ['petrol', 'diesel', 'cng', 'ev'];
export const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
export const ROLES = { CUSTOMER: 'customer', DEALER: 'dealer', ADMIN: 'admin' };

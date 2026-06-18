export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

export const getStatusBadge = (status) => {
  const map = { pending: 'badge-pending', confirmed: 'badge-confirmed', completed: 'badge-completed', cancelled: 'badge-cancelled', processing: 'badge-confirmed' };
  return map[status] || 'badge-pending';
};

export const truncate = (str, n = 50) => str?.length > n ? str.slice(0, n) + '...' : str;

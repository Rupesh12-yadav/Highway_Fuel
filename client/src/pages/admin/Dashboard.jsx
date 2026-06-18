import { useEffect, useState } from 'react';
import ReportCard from '../../components/admin/ReportCard';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { formatCurrency } from '../../utils/helper';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data.data)); }, []);

  if (!stats) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <ReportCard title="Total Users" value={stats.users} icon="👥" />
        <ReportCard title="Total Pumps" value={stats.pumps} icon="⛽" />
        <ReportCard title="Total Orders" value={stats.orders} icon="📦" />
        <ReportCard title="Revenue" value={formatCurrency(stats.revenue)} icon="💰" />
      </div>
      <div className="card text-center py-8 text-gray-400">
        <p>Revenue charts & system health - Coming Soon</p>
      </div>
    </div>
  );
};

export default AdminDashboard;

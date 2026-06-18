import { useEffect, useState } from 'react';
import AnalyticsCard from '../../components/dealer/AnalyticsCard';
import api from '../../services/api';
import { formatCurrency } from '../../utils/helper';

const DealerAnalytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get('/dealer/stats').then(r => setStats(r.data.data)); }, []);

  if (!stats) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <AnalyticsCard title="Total Pumps" value={stats.totalPumps} icon="⛽" color="orange" />
        <AnalyticsCard title="Total Orders" value={stats.totalOrders} icon="📦" color="blue" />
        <AnalyticsCard title="Completed" value={stats.completedOrders} icon="✅" color="green" />
        <AnalyticsCard title="Revenue" value={formatCurrency(stats.revenue)} icon="💰" color="purple" />
      </div>
      <div className="card text-center py-8 text-gray-400">
        <p>Detailed charts & graphs - Coming Soon</p>
      </div>
    </div>
  );
};

export default DealerAnalytics;

import { useEffect, useState } from 'react';
import AnalyticsCard from '../../components/dealer/AnalyticsCard';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { formatCurrency } from '../../utils/helper';

const DealerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dealer/stats').then(r => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dealer Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnalyticsCard title="My Pumps" value={stats?.totalPumps || 0} icon="⛽" color="orange" />
        <AnalyticsCard title="Total Orders" value={stats?.totalOrders || 0} icon="📦" color="blue" />
        <AnalyticsCard title="Completed Orders" value={stats?.completedOrders || 0} icon="✅" color="green" />
        <AnalyticsCard title="Total Revenue" value={formatCurrency(stats?.revenue || 0)} icon="💰" color="purple" />
      </div>
    </div>
  );
};

export default DealerDashboard;

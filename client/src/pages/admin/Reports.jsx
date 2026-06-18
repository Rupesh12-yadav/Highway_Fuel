import { useEffect, useState } from 'react';
import ReportCard from '../../components/admin/ReportCard';
import api from '../../services/api';
import { formatCurrency } from '../../utils/helper';

const AdminReports = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data.data)); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <ReportCard title="Total Registered Users" value={stats.users} icon="👥" subtitle="All roles combined" />
          <ReportCard title="Total Petrol Pumps" value={stats.pumps} icon="⛽" subtitle="Approved + Pending" />
          <ReportCard title="Total Orders Placed" value={stats.orders} icon="📦" subtitle="All statuses" />
          <ReportCard title="Total Revenue Generated" value={formatCurrency(stats.revenue)} icon="💰" subtitle="Completed orders only" />
        </div>
      )}
      <div className="card text-center py-8 text-gray-400">
        <p>Detailed monthly/weekly charts - Coming Soon</p>
      </div>
    </div>
  );
};

export default AdminReports;

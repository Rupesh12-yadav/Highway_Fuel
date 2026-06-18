import { useEffect, useState } from 'react';
import DealerTable from '../../components/admin/DealerTable';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const AdminDealers = () => {
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/admin/pumps/pending').then(r => setPumps(r.data.data)).finally(() => setLoading(false)); }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/pumps/${id}/approve`);
      setPumps(p => p.filter(pump => pump._id !== id));
      toast.success('Pump approved!');
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dealer Approvals</h1>
      <div className="card">
        {loading ? <Loader /> : <DealerTable dealers={pumps} onApprove={handleApprove} />}
      </div>
    </div>
  );
};

export default AdminDealers;

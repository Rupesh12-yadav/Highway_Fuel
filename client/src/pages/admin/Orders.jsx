import { useEffect, useState } from 'react';
import OrderTable from '../../components/dealer/OrderTable';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/admin/orders').then(r => setOrders(r.data.data)).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Orders</h1>
      <div className="card">
        {loading ? <Loader /> : <OrderTable orders={orders} isDealer={false} />}
      </div>
    </div>
  );
};

export default AdminOrders;

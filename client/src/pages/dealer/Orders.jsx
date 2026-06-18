import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDealerOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import OrderTable from '../../components/dealer/OrderTable';
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast';

const DealerOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(s => s.orders);

  useEffect(() => { dispatch(fetchDealerOrders()); }, []);

  const handleStatusUpdate = async (id, status) => {
    const result = await dispatch(updateOrderStatus({ id, status }));
    if (updateOrderStatus.fulfilled.match(result)) toast.success('Status updated');
    else toast.error('Update failed');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders Management</h1>
      <div className="card">
        {loading ? <Loader /> : <OrderTable orders={orders} onStatusUpdate={handleStatusUpdate} isDealer />}
      </div>
    </div>
  );
};

export default DealerOrders;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import OrderCard from '../../components/customer/OrderCard';
import Loader from '../../components/common/Loader';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(s => s.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
      {loading ? <Loader /> : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-3">📦</span>
          <p>No orders yet. Order fuel from a nearby pump!</p>
        </div>
      ) : (
        orders.map(order => <OrderCard key={order._id} order={order} />)
      )}
    </div>
  );
};

export default MyOrders;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPumpById } from '../../redux/slices/pumpSlice';
import { createOrder } from '../../redux/slices/orderSlice';
import ReviewCard from '../../components/customer/ReviewCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { FiMapPin, FiStar, FiPhone } from 'react-icons/fi';
import { pumpService } from '../../services/pumpService';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const PumpDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectedPump: pump } = useSelector(s => s.pumps);
  const { loading: orderLoading } = useSelector(s => s.orders);
  const [reviews, setReviews] = useState([]);
  const [orderModal, setOrderModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [orderForm, setOrderForm] = useState({ fuelType: '', quantity: 1, deliveryAddress: '', notes: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: '' });

  useEffect(() => {
    dispatch(fetchPumpById(id));
    api.get(`/reviews/${id}`).then(r => setReviews(r.data.data));
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    const result = await dispatch(createOrder({ ...orderForm, pumpId: id }));
    if (createOrder.fulfilled.match(result)) {
      toast.success('Order placed successfully!');
      setOrderModal(false);
      navigate('/my-orders');
    } else {
      toast.error(result.payload);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { pumpId: id, ...reviewForm });
      toast.success('Review submitted!');
      setReviewModal(false);
      api.get(`/reviews/${id}`).then(r => setReviews(r.data.data));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    }
  };

  if (!pump) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{pump.pumpName}</h1>
            <p className="text-gray-500 flex items-center gap-1 mt-1"><FiMapPin size={14} /> {pump.address}, {pump.city}</p>
            <p className="text-gray-500 text-sm">Highway: {pump.highway}</p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
            <FiStar className="text-yellow-500 fill-yellow-500" size={16} />
            <span className="font-semibold text-gray-700">{pump.rating}</span>
            <span className="text-gray-400 text-sm">({pump.totalReviews})</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {pump.fuelTypes?.filter(f => f.available).map(f => (
            <div key={f.type} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="font-semibold text-primary text-lg">{f.type.toUpperCase()}</p>
              <p className="text-gray-600 text-sm">₹{f.pricePerLitre}/L</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setOrderModal(true)}>Order Fuel</Button>
          {isAuthenticated && <Button variant="outline" onClick={() => setReviewModal(true)}>Write Review</Button>}
        </div>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(r => <ReviewCard key={r._id} review={r} />)
        )}
      </div>

      {/* Order Modal */}
      <Modal isOpen={orderModal} onClose={() => setOrderModal(false)} title="Order Fuel">
        <form onSubmit={handleOrder} className="space-y-4">
          <div>
            <label className="label">Fuel Type</label>
            <select className="input" required value={orderForm.fuelType}
              onChange={e => setOrderForm({...orderForm, fuelType: e.target.value})}>
              <option value="">Select fuel</option>
              {pump.fuelTypes?.filter(f => f.available).map(f => (
                <option key={f.type} value={f.type}>{f.type.toUpperCase()} - ₹{f.pricePerLitre}/L</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Quantity (Litres)</label>
            <input type="number" className="input" min={1} required value={orderForm.quantity}
              onChange={e => setOrderForm({...orderForm, quantity: Number(e.target.value)})} />
          </div>
          <div>
            <label className="label">Delivery Address (optional)</label>
            <textarea className="input" rows={2} value={orderForm.deliveryAddress}
              onChange={e => setOrderForm({...orderForm, deliveryAddress: e.target.value})} />
          </div>
          {orderForm.fuelType && (
            <div className="bg-orange-50 rounded-lg p-3 text-sm">
              <span className="font-medium">Estimated Amount: </span>
              ₹{(pump.fuelTypes?.find(f => f.type === orderForm.fuelType)?.pricePerLitre || 0) * orderForm.quantity}
            </div>
          )}
          <Button type="submit" loading={orderLoading} className="w-full justify-center">Place Order</Button>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewModal} onClose={() => setReviewModal(false)} title="Write a Review">
        <form onSubmit={handleReview} className="space-y-4">
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setReviewForm({...reviewForm, rating: s})}
                  className={`text-2xl transition ${s <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Review</label>
            <textarea className="input" rows={3} required value={reviewForm.review}
              onChange={e => setReviewForm({...reviewForm, review: e.target.value})} />
          </div>
          <Button type="submit" className="w-full justify-center">Submit Review</Button>
        </form>
      </Modal>
    </div>
  );
};

export default PumpDetails;

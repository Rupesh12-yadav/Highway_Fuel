import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helper';

const OrderCard = ({ order }) => (
  <div className="card mb-3">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="font-semibold text-gray-800">{order.pumpId?.pumpName || 'N/A'}</h4>
        <p className="text-gray-500 text-sm">{order.pumpId?.city}</p>
      </div>
      <span className={getStatusBadge(order.status)}>{order.status}</span>
    </div>
    <div className="grid grid-cols-3 gap-3 text-sm text-gray-600 mt-2">
      <div><span className="text-gray-400 block text-xs">Fuel</span>{order.fuelType?.toUpperCase()}</div>
      <div><span className="text-gray-400 block text-xs">Qty</span>{order.quantity}L</div>
      <div><span className="text-gray-400 block text-xs">Amount</span>{formatCurrency(order.amount)}</div>
    </div>
    <p className="text-xs text-gray-400 mt-2">{formatDate(order.createdAt)}</p>
  </div>
);

export default OrderCard;

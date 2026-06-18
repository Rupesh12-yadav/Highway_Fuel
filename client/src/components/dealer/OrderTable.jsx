import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helper';

const OrderTable = ({ orders, onStatusUpdate, isDealer }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
          <th className="px-4 py-3 text-left">Customer</th>
          <th className="px-4 py-3 text-left">Pump</th>
          <th className="px-4 py-3 text-left">Fuel</th>
          <th className="px-4 py-3 text-left">Qty</th>
          <th className="px-4 py-3 text-left">Amount</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Date</th>
          {isDealer && <th className="px-4 py-3 text-left">Action</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {orders.map(order => (
          <tr key={order._id} className="hover:bg-gray-50 transition">
            <td className="px-4 py-3">{order.customerId?.name || 'N/A'}</td>
            <td className="px-4 py-3">{order.pumpId?.pumpName || 'N/A'}</td>
            <td className="px-4 py-3 uppercase">{order.fuelType}</td>
            <td className="px-4 py-3">{order.quantity}L</td>
            <td className="px-4 py-3 font-medium">{formatCurrency(order.amount)}</td>
            <td className="px-4 py-3"><span className={getStatusBadge(order.status)}>{order.status}</span></td>
            <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
            {isDealer && (
              <td className="px-4 py-3">
                <select
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                  defaultValue={order.status}
                  onChange={e => onStatusUpdate(order._id, e.target.value)}
                >
                  {['pending','confirmed','processing','completed','cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            )}
          </tr>
        ))}
        {orders.length === 0 && (
          <tr><td colSpan={isDealer ? 8 : 7} className="text-center py-8 text-gray-400">No orders found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

export default OrderTable;

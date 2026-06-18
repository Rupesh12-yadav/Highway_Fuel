import Button from '../common/Button';

const DealerTable = ({ dealers, onApprove }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
          <th className="px-4 py-3 text-left">Pump Name</th>
          <th className="px-4 py-3 text-left">Owner</th>
          <th className="px-4 py-3 text-left">City</th>
          <th className="px-4 py-3 text-left">Highway</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {dealers.map(pump => (
          <tr key={pump._id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium">{pump.pumpName}</td>
            <td className="px-4 py-3">{pump.ownerId?.name}</td>
            <td className="px-4 py-3">{pump.city}</td>
            <td className="px-4 py-3">{pump.highway}</td>
            <td className="px-4 py-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${pump.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {pump.isApproved ? 'Approved' : 'Pending'}
              </span>
            </td>
            <td className="px-4 py-3">
              {!pump.isApproved && (
                <Button size="sm" onClick={() => onApprove(pump._id)}>Approve</Button>
              )}
            </td>
          </tr>
        ))}
        {dealers.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400">No dealers found</td></tr>}
      </tbody>
    </table>
  </div>
);

export default DealerTable;

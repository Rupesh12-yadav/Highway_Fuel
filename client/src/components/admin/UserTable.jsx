const UserTable = ({ users, onStatusChange }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-left">Role</th>
          <th className="px-4 py-3 text-left">Phone</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {users.map(user => (
          <tr key={user._id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium">{user.name}</td>
            <td className="px-4 py-3 text-gray-600">{user.email}</td>
            <td className="px-4 py-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'dealer' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                {user.role}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-600">{user.phone || '-'}</td>
            <td className="px-4 py-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {user.status}
              </span>
            </td>
            <td className="px-4 py-3">
              <select className="text-xs border border-gray-300 rounded px-2 py-1" defaultValue={user.status}
                onChange={e => onStatusChange(user._id, e.target.value)}>
                {['active','inactive','banned'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </td>
          </tr>
        ))}
        {users.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400">No users found</td></tr>}
      </tbody>
    </table>
  </div>
);

export default UserTable;

import { useEffect, useState } from 'react';
import UserTable from '../../components/admin/UserTable';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/admin/users').then(r => setUsers(r.data.data)).finally(() => setLoading(false)); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      setUsers(u => u.map(user => user._id === id ? { ...user, status } : user));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
      <div className="card">
        {loading ? <Loader /> : <UserTable users={users} onStatusChange={handleStatusChange} />}
      </div>
    </div>
  );
};

export default AdminUsers;

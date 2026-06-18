import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiTool, FiShoppingBag, FiBarChart2, FiLogOut } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const links = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/dealers', icon: FiTool, label: 'Dealers' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/reports', icon: FiBarChart2, label: 'Reports' },
];

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { signOut(); navigate('/login'); };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-secondary text-white min-h-screen flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">⛽</span>
            <span className="font-bold text-lg">Highway<span className="text-primary">Fuel</span></span>
          </div>
          <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/admin'}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white transition text-sm w-full px-3 py-2">
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto"><Outlet /></main>
    </div>
  );
};

export default AdminLayout;

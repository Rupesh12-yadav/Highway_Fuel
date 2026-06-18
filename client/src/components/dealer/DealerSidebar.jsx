import { FiGrid, FiShoppingBag, FiTool, FiUsers, FiBarChart2, FiLogOut } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const links = [
  { to: '/dealer', icon: FiGrid, label: 'Dashboard' },
  { to: '/dealer/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/dealer/pumps', icon: FiTool, label: 'My Pumps' },
  { to: '/dealer/staff', icon: FiUsers, label: 'Staff' },
  { to: '/dealer/analytics', icon: FiBarChart2, label: 'Analytics' },
];

const DealerSidebar = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { signOut(); navigate('/login'); };

  return (
    <aside className="w-64 bg-secondary text-white min-h-screen flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">⛽</span>
          <span className="font-bold text-lg">Highway<span className="text-primary">Fuel</span></span>
        </div>
        <p className="text-gray-400 text-xs">Dealer Panel</p>
      </div>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/dealer'}
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
  );
};

export default DealerSidebar;

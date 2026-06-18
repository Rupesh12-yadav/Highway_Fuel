import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isDealer, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { signOut(); navigate('/login'); };

  const dashboardLink = isAdmin ? '/admin' : isDealer ? '/dealer' : '/';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">⛽</span>
            <span className="text-xl font-bold text-secondary">Highway<span className="text-primary">Fuel</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/pumps" className="text-gray-600 hover:text-primary transition font-medium">Find Pumps</Link>
            {isAuthenticated ? (
              <>
                <Link to={dashboardLink} className="text-gray-600 hover:text-primary transition font-medium">Dashboard</Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Hi, {user?.name?.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-600 transition">
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-outline text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
          <Link to="/pumps" className="text-gray-600 hover:text-primary" onClick={() => setOpen(false)}>Find Pumps</Link>
          {isAuthenticated ? (
            <>
              <Link to={dashboardLink} className="text-gray-600 hover:text-primary" onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="text-red-500 text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="text-gray-600" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

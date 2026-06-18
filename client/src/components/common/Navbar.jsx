import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiSearch } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isDealer, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleLogout = () => { signOut(); navigate('/login'); };
  const dashboardLink = isAdmin ? '/admin' : isDealer ? '/dealer' : '/';

  // Search submit - pumps page pe city param ke saath bhejo
  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/pumps?city=${encodeURIComponent(q)}`);
    setSearch('');
    setSearchOpen(false);
    setMenuOpen(false);
  };

  // Mobile search box open hone pe auto focus
  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">⛽</span>
            <span className="text-xl font-bold text-secondary">
              Highway<span className="text-primary">Fuel</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <FiSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="City ya highway se pump search karo..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 hover:bg-white transition"
              />
              {search && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full hover:bg-orange-600 transition"
                >
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link to="/pumps" className="text-gray-600 hover:text-primary transition font-medium text-sm">
              Find Pumps
            </Link>
            {isAuthenticated ? (
              <>
                <Link to={dashboardLink} className="text-gray-600 hover:text-primary transition font-medium text-sm">
                  Dashboard
                </Link>
                <span className="text-sm text-gray-500">Hi, {user?.name?.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 transition text-sm"
                >
                  <FiLogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm py-1.5">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => { setSearchOpen(s => !s); setMenuOpen(false); }}
              className="p-2 text-gray-600 hover:text-primary transition"
            >
              {searchOpen ? <FiX size={22} /> : <FiSearch size={22} />}
            </button>
            <button
              onClick={() => { setMenuOpen(s => !s); setSearchOpen(false); }}
              className="p-2 text-gray-600 hover:text-primary transition"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="City ya highway se pump search karo..."
                className="w-full pl-9 pr-24 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white text-xs px-3 py-1.5 rounded-full hover:bg-orange-600 transition"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
          <Link to="/pumps" className="text-gray-600 hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>
            ⛽ Find Pumps
          </Link>
          {isAuthenticated ? (
            <>
              <Link to={dashboardLink} className="text-gray-600 hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>
                📊 Dashboard
              </Link>
              <button onClick={handleLogout} className="text-red-500 text-sm text-left flex items-center gap-1">
                <FiLogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="text-gray-600 text-sm" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

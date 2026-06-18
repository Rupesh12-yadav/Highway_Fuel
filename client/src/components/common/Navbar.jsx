import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiSearch, FiMapPin } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

// Static suggestions list - cities + highways
const SUGGESTIONS = [
  // Major Cities
  'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Jaipur', 'Lucknow', 'Pune', 'Ahmedabad', 'Surat', 'Kanpur',
  'Nagpur', 'Indore', 'Bhopal', 'Patna', 'Agra', 'Varanasi',
  'Meerut', 'Faridabad', 'Ghaziabad', 'Noida', 'Gurugram',
  'Chandigarh', 'Amritsar', 'Ludhiana', 'Jodhpur', 'Udaipur',
  'Kota', 'Ajmer', 'Dehradun', 'Haridwar', 'Rishikesh',
  'Shimla', 'Manali', 'Jammu', 'Srinagar', 'Ranchi',
  'Raipur', 'Bhubaneswar', 'Visakhapatnam', 'Coimbatore',
  'Madurai', 'Thiruvananthapuram', 'Kochi', 'Mysuru',
  // Highways
  'NH1', 'NH2', 'NH3', 'NH4', 'NH5', 'NH6', 'NH7', 'NH8',
  'NH44', 'NH48', 'NH58', 'NH24', 'NH19', 'NH27', 'NH30',
  'NH66', 'NH75', 'NH52', 'NH11', 'NH12',
];

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isDealer, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleLogout = () => { signOut(); navigate('/login'); };
  const dashboardLink = isAdmin ? '/admin' : isDealer ? '/dealer' : '/';

  // Filter suggestions when user types 3+ chars
  useEffect(() => {
    if (search.trim().length >= 3) {
      const q = search.trim().toLowerCase();
      const filtered = SUGGESTIONS.filter(s => s.toLowerCase().includes(q)).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  }, [search]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Mobile search open → auto focus
  useEffect(() => {
    if (searchOpen && mobileInputRef.current) mobileInputRef.current.focus();
  }, [searchOpen]);

  const doSearch = (query) => {
    const q = (query || search).trim();
    if (!q) return;
    navigate(`/pumps?city=${encodeURIComponent(q)}`);
    setSearch('');
    setShowSuggestions(false);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      doSearch(suggestions[activeIndex]);
    } else {
      doSearch();
    }
  };

  // Keyboard arrow navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const SearchBox = ({ isMobile }) => (
    <form onSubmit={handleSubmit} className={isMobile ? 'relative w-full' : 'relative w-full'}>
      <div className="relative">
        <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          ref={isMobile ? mobileInputRef : inputRef}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => search.length >= 3 && setShowSuggestions(true)}
          placeholder="City ya highway search karo..."
          className="w-full pl-9 pr-20 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 hover:bg-white transition"
          autoComplete="off"
        />
        {search && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button type="button" onClick={() => { setSearch(''); setShowSuggestions(false); }}
              className="text-gray-400 hover:text-gray-600 p-0.5">
              <FiX size={13} />
            </button>
            <button type="submit"
              className="bg-primary text-white text-xs px-3 py-1 rounded-full hover:bg-orange-600 transition">
              Go
            </button>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <p className="text-xs text-gray-400 px-4 pt-2.5 pb-1 font-medium uppercase tracking-wide">
            Suggestions
          </p>
          {suggestions.map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => doSearch(s)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition ${
                i === activeIndex ? 'bg-orange-50 text-primary' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiMapPin size={13} className={i === activeIndex ? 'text-primary' : 'text-gray-400'} />
              <span>
                {/* Bold matching part */}
                {s.split(new RegExp(`(${search.trim()})`, 'gi')).map((part, j) =>
                  part.toLowerCase() === search.trim().toLowerCase()
                    ? <strong key={j} className="text-primary font-semibold">{part}</strong>
                    : part
                )}
              </span>
              <span className="ml-auto text-xs text-gray-300">
                {s.startsWith('NH') ? 'Highway' : 'City'}
              </span>
            </button>
          ))}
          <div className="border-t border-gray-100 px-4 py-2">
            <button type="submit"
              className="text-xs text-primary hover:underline flex items-center gap-1">
              <FiSearch size={11} /> "{search}" ke liye search karo
            </button>
          </div>
        </div>
      )}
    </form>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4" ref={wrapperRef}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">⛽</span>
            <span className="text-xl font-bold text-secondary">
              Highway<span className="text-primary">Fuel</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBox isMobile={false} />
          </div>

          {/* Desktop Nav */}
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
                <button onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 transition text-sm">
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

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center gap-1 ml-auto">
            <button onClick={() => { setSearchOpen(s => !s); setMenuOpen(false); }}
              className="p-2 text-gray-600 hover:text-primary transition">
              {searchOpen ? <FiX size={22} /> : <FiSearch size={22} />}
            </button>
            <button onClick={() => { setMenuOpen(s => !s); setSearchOpen(false); setShowSuggestions(false); }}
              className="p-2 text-gray-600 hover:text-primary transition">
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden pb-3 px-1" ref={wrapperRef}>
            <SearchBox isMobile={true} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
          <Link to="/pumps" className="text-gray-600 hover:text-primary text-sm font-medium"
            onClick={() => setMenuOpen(false)}>⛽ Find Pumps</Link>
          {isAuthenticated ? (
            <>
              <Link to={dashboardLink} className="text-gray-600 hover:text-primary text-sm font-medium"
                onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
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

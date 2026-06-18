import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPumps } from '../../redux/slices/pumpSlice';
import PumpCard from '../../components/customer/PumpCard';
import RealPumpCard from '../../components/customer/RealPumpCard';
import Loader from '../../components/common/Loader';
import LocationPopup from '../../components/common/LocationPopup';
import { FiSearch, FiNavigation, FiMapPin, FiRefreshCw, FiInfo } from 'react-icons/fi';
import { locationService, getCurrentLocation } from '../../services/locationService';
import { toast } from 'react-hot-toast';

const RADIUS_OPTIONS = [
  { label: '1 km', value: 1000 },
  { label: '2 km', value: 2000 },
  { label: '5 km', value: 5000 },
  { label: '10 km', value: 10000 },
  { label: '20 km', value: 20000 },
];

const POPULAR_CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Jaipur', 'Lucknow', 'Pune', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Chandigarh'];

export default function PumpList() {
  const dispatch = useDispatch();
  const { pumps: dbPumps, loading: dbLoading, total } = useSelector(s => s.pumps);

  const [tab, setTab] = useState('nearby');

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);

  // Nearby GPS state
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(5000);
  const [realPumps, setRealPumps] = useState([]);
  const [realLoading, setRealLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  // City search state
  const [cityInput, setCityInput] = useState('');
  const [cityPumps, setCityPumps] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityResult, setCityResult] = useState(null);

  // DB filter state
  const [filters, setFilters] = useState({ city: '', highway: '', fuelType: '' });
  const [page, setPage] = useState(1);

  // On mount - show popup if location not yet taken
  useEffect(() => {
    if (tab === 'nearby' && !userLocation) {
      setShowPopup(true);
    }
  }, []);

  useEffect(() => {
    if (tab === 'db') dispatch(fetchPumps({ ...filters, page }));
  }, [tab, page]);

  useEffect(() => {
    if (userLocation && tab === 'nearby') {
      fetchNearby(userLocation.lat, userLocation.lng, radius);
    }
  }, [userLocation, radius]);

  // User clicks "Allow" in popup
  const handlePopupAllow = async () => {
    setPopupLoading(true);
    setLocationError('');
    try {
      const pos = await getCurrentLocation();
      setUserLocation(pos);
      setShowPopup(false);
      toast.success('📍 Location mil gayi! Pumps fetch ho rahe hain...');
    } catch (err) {
      setLocationError(err.message);
      setShowPopup(false);
      toast.error('Location access denied');
    } finally {
      setPopupLoading(false);
    }
  };

  // User clicks "Abhi Nahi" in popup
  const handlePopupDeny = () => {
    setShowPopup(false);
    setTab('city');
    toast('City Search use karo ⬆️', { icon: '🏙️' });
  };

  const handleDetectLocation = async () => {
    setLocationError('');
    setRealLoading(true);
    try {
      const pos = await getCurrentLocation();
      setUserLocation(pos);
      toast.success('📍 Location updated!');
    } catch (err) {
      setLocationError(err.message);
      toast.error('Location access denied');
    } finally {
      setRealLoading(false);
    }
  };

  const fetchNearby = async (lat, lng, rad) => {
    setRealLoading(true);
    try {
      const res = await locationService.getNearby(lat, lng, rad);
      setRealPumps(res.data.data.pumps);
      if (res.data.data.pumps.length === 0) {
        toast('Is area mein koi pump nahi mila, radius badhao', { icon: 'ℹ️' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Pump fetch failed');
    } finally {
      setRealLoading(false);
    }
  };

  const handleCitySearch = async (city) => {
    const q = city || cityInput;
    if (!q.trim()) return;
    setCityInput(q);
    setCityLoading(true);
    setCityResult(null);
    try {
      const res = await locationService.getByCity(q, 10000);
      setCityPumps(res.data.data.pumps);
      setCityResult({ name: res.data.data.cityName, total: res.data.data.total });
    } catch (err) {
      toast.error(err.response?.data?.message || 'City search failed');
    } finally {
      setCityLoading(false);
    }
  };

  const handleDbSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(fetchPumps({ ...filters, page: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ══ LOCATION PERMISSION POPUP ══ */}
      {showPopup && (
        <LocationPopup
          onAllow={handlePopupAllow}
          onDeny={handlePopupDeny}
          loading={popupLoading}
        />
      )}

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">⛽ Find Petrol Pumps</h1>
        <p className="text-gray-500 text-sm mt-1">
          Real-time data powered by{' '}
          <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer"
            className="text-green-600 font-medium hover:underline">OpenStreetMap</a>
          {' '}— 100% Free, No API Key
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit flex-wrap">
        {[
          { key: 'nearby', label: '📍 Near Me (GPS)' },
          { key: 'city', label: '🏙️ City Search' },
          { key: 'db', label: '🗄️ Our Pumps (DB)' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.key ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════ TAB 1 - GPS NEARBY ══════════ */}
      {tab === 'nearby' && (
        <div>
          {/* Controls Bar */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 mb-5 flex flex-wrap items-center gap-3 shadow-sm">
            <button onClick={handleDetectLocation} disabled={realLoading}
              className="btn-primary flex items-center gap-2 text-sm">
              <FiNavigation size={14} />
              {realLoading ? 'Detecting...' : userLocation ? 'Re-detect Location' : 'Detect My Location'}
            </button>

            {userLocation && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500 whitespace-nowrap">Radius:</label>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={radius} onChange={e => setRadius(Number(e.target.value))}>
                    {RADIUS_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>

                <button onClick={() => fetchNearby(userLocation.lat, userLocation.lng, radius)}
                  disabled={realLoading}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                  <FiRefreshCw size={13} className={realLoading ? 'animate-spin' : ''} />
                  Refresh
                </button>

                <div className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                  <FiMapPin size={11} />
                  {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                </div>
              </>
            )}
          </div>

          {/* Location Error */}
          {locationError && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 flex gap-3">
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <p className="text-amber-800 font-medium text-sm">Location Access Failed</p>
                <p className="text-amber-700 text-xs mt-0.5">{locationError}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setShowPopup(true)}
                    className="text-xs bg-primary text-white px-3 py-1 rounded-lg">
                    Dobara Try Karo
                  </button>
                  <button onClick={() => setTab('city')}
                    className="text-xs border border-gray-300 text-gray-600 px-3 py-1 rounded-lg">
                    City Search Use Karo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {realLoading ? (
            <div className="text-center py-20">
              <div className="h-14 w-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Aapke aas-paas ke pumps dhoondh rahe hain...</p>
              <p className="text-gray-400 text-sm mt-1">OpenStreetMap se live data aa raha hai ⛽</p>
            </div>
          ) : !userLocation && !locationError ? (
            <div className="text-center py-20 text-gray-400">
              <FiNavigation size={52} className="mx-auto mb-4 text-primary opacity-40" />
              <p className="text-lg font-medium text-gray-600">Location Permission Chahiye</p>
              <p className="text-sm mt-1 mb-5">Nearby pumps dikhane ke liye location allow karo</p>
              <button onClick={() => setShowPopup(true)} className="btn-primary flex items-center gap-2 mx-auto">
                <FiNavigation size={15} /> Location Allow Karo
              </button>
            </div>
          ) : realPumps.length === 0 && userLocation ? (
            <div className="text-center py-16 text-gray-400">
              <span className="text-5xl block mb-3">⛽</span>
              <p className="font-medium text-gray-600">{radius / 1000}km mein koi pump nahi mila</p>
              <p className="text-sm mt-1 mb-4">Radius badhao ya city search try karo</p>
              <button onClick={() => setRadius(10000)} className="btn-primary text-sm mx-auto">
                Radius 10km kar do
              </button>
            </div>
          ) : (
            <>
              <ResultHeader count={realPumps.length} suffix={`within ${radius / 1000}km`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {realPumps.map(pump => (
                  <RealPumpCard key={pump.osm_id} pump={pump} userLocation={userLocation} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════ TAB 2 - CITY SEARCH ══════════ */}
      {tab === 'city' && (
        <div>
          <form onSubmit={(e) => { e.preventDefault(); handleCitySearch(); }}
            className="bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow-sm flex gap-3">
            <div className="relative flex-1">
              <FiMapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="City ka naam likho (e.g. Delhi, Jaipur, Mumbai)..."
                value={cityInput} onChange={e => setCityInput(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary text-sm flex items-center gap-2">
              <FiSearch size={14} /> Search
            </button>
          </form>

          {!cityResult && (
            <div className="mb-5">
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Popular Cities</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CITIES.map(c => (
                  <button key={c} onClick={() => handleCitySearch(c)}
                    className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {cityLoading ? (
            <Loader text={`"${cityInput}" mein petrol pumps search ho rahi hain...`} />
          ) : cityResult ? (
            <>
              <ResultHeader count={cityPumps.length} suffix={`in "${cityInput}"`} />
              {cityPumps.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <span className="text-4xl block mb-3">🏙️</span>
                  <p>Is city mein koi pump nahi mila</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cityPumps.map(pump => (
                    <RealPumpCard key={pump.osm_id} pump={pump} userLocation={null} />
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* ══════════ TAB 3 - DB PUMPS ══════════ */}
      {tab === 'db' && (
        <div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 flex gap-2 text-sm text-blue-700">
            <FiInfo size={16} className="shrink-0 mt-0.5" />
            <p>Ye hamare platform pe registered aur admin-approved pumps hain.</p>
          </div>

          <form onSubmit={handleDbSearch}
            className="bg-white border border-gray-100 rounded-xl p-4 mb-5 shadow-sm flex flex-wrap gap-3">
            <input className="input flex-1 min-w-32 text-sm" placeholder="City..."
              value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })} />
            <input className="input flex-1 min-w-32 text-sm" placeholder="Highway (NH48)..."
              value={filters.highway} onChange={e => setFilters({ ...filters, highway: e.target.value })} />
            <select className="input w-36 text-sm" value={filters.fuelType}
              onChange={e => setFilters({ ...filters, fuelType: e.target.value })}>
              <option value="">All Fuels</option>
              {['petrol', 'diesel', 'cng', 'ev'].map(f => (
                <option key={f} value={f}>{f.toUpperCase()}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary text-sm flex items-center gap-2">
              <FiSearch size={14} /> Search
            </button>
          </form>

          {dbLoading ? <Loader /> : (
            <>
              <p className="text-gray-500 text-sm mb-4">
                <span className="font-semibold text-gray-700">{total}</span> pumps found in database
              </p>
              {dbPumps.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <span className="text-5xl block mb-3">⛽</span>
                  <p>No pumps found. Filters change karo.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {dbPumps.map(pump => <PumpCard key={pump._id} pump={pump} />)}
                </div>
              )}
              {total > 10 && (
                <div className="flex justify-center mt-6 gap-2">
                  <button className="btn-outline text-sm" disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}>← Previous</button>
                  <span className="px-4 py-2 text-sm text-gray-600 font-medium">Page {page}</span>
                  <button className="btn-outline text-sm" disabled={dbPumps.length < 10}
                    onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResultHeader({ count, suffix }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-gray-700 font-medium text-sm">
        <span className="text-primary font-bold text-lg">{count}</span> pumps found {suffix}
      </p>
      <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-medium">
        🗺️ OpenStreetMap Live Data
      </span>
    </div>
  );
}

import { FiMapPin, FiNavigation, FiExternalLink, FiPhone, FiClock } from 'react-icons/fi';

const FUEL_COLORS = {
  petrol: 'bg-red-50 text-red-600 border-red-200',
  diesel: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  cng: 'bg-green-50 text-green-700 border-green-200',
  lpg: 'bg-blue-50 text-blue-700 border-blue-200',
  ev: 'bg-purple-50 text-purple-700 border-purple-200',
};

const BRAND_COLORS = {
  'Indian Oil': 'bg-orange-500',
  'IOCL': 'bg-orange-500',
  'HP': 'bg-blue-500',
  'Bharat Petroleum': 'bg-blue-500',
  'BPCL': 'bg-blue-500',
  'Shell': 'bg-yellow-500',
  'Reliance': 'bg-sky-500',
  'Essar': 'bg-red-500',
};

const RealPumpCard = ({ pump, userLocation }) => {
  const brandColor = BRAND_COLORS[pump.brand] || BRAND_COLORS[pump.name] || 'bg-gray-500';

  const navigateToGoogle = () => {
    const base = userLocation
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${pump.latitude},${pump.longitude}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${pump.latitude},${pump.longitude}`;
    window.open(base, '_blank');
  };

  const openOSM = () => window.open(pump.osmUrl, '_blank');

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Top color bar with brand initial */}
      <div className={`${brandColor} h-1.5 w-full`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">
              {pump.name}
            </h3>
            {pump.brand && pump.brand !== pump.name && (
              <p className="text-xs text-gray-400 mt-0.5">{pump.brand}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <span className="text-primary font-bold text-sm">{pump.distanceKm} km</span>
          </div>
        </div>

        {/* Address */}
        <p className="text-gray-500 text-xs flex items-start gap-1 mb-3">
          <FiMapPin size={11} className="shrink-0 mt-0.5 text-gray-400" />
          <span className="line-clamp-2">{pump.address}</span>
        </p>

        {/* Fuel types */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {pump.fuelTypes.map(f => (
            <span key={f} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${FUEL_COLORS[f] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              {f.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Phone & Hours */}
        <div className="space-y-1 mb-3">
          {pump.phone && (
            <a href={`tel:${pump.phone}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition">
              <FiPhone size={11} /> {pump.phone}
            </a>
          )}
          {pump.opening_hours && (
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <FiClock size={11} /> {pump.opening_hours}
            </p>
          )}
        </div>

        {/* OSM Badge */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
            🗺️ OpenStreetMap
          </span>
          <span className="text-xs text-gray-400">Real Data</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button onClick={navigateToGoogle}
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white text-xs py-2 rounded-lg hover:bg-orange-600 transition font-medium">
            <FiNavigation size={13} /> Navigate
          </button>
          <button onClick={openOSM}
            className="flex items-center justify-center gap-1 border border-gray-200 text-gray-500 text-xs px-3 py-2 rounded-lg hover:bg-gray-50 transition"
            title="View on OpenStreetMap">
            <FiExternalLink size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealPumpCard;

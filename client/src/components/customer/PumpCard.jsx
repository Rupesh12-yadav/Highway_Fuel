import { FiMapPin, FiStar, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PumpCard = ({ pump }) => {
  const fuelBadge = { petrol: 'bg-red-100 text-red-700', diesel: 'bg-yellow-100 text-yellow-700', cng: 'bg-green-100 text-green-700', ev: 'bg-blue-100 text-blue-700' };
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{pump.pumpName}</h3>
          <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><FiMapPin size={12} /> {pump.city}, {pump.highway}</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <FiStar size={14} fill="currentColor" />
          <span className="text-sm font-medium text-gray-700">{pump.rating || '0'}</span>
          <span className="text-xs text-gray-400">({pump.totalReviews})</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pump.address}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {pump.fuelTypes?.filter(f => f.available).map(f => (
          <span key={f.type} className={`text-xs px-2 py-1 rounded-full font-medium ${fuelBadge[f.type] || 'bg-gray-100 text-gray-600'}`}>
            {f.type.toUpperCase()} - ₹{f.pricePerLitre}/L
          </span>
        ))}
      </div>

      <Link to={`/pumps/${pump._id}`} className="btn-primary w-full text-center block text-sm">
        View Details
      </Link>
    </div>
  );
};

export default PumpCard;

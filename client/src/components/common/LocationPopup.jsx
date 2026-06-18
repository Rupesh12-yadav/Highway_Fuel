import { FiNavigation, FiX, FiMapPin } from 'react-icons/fi';

const LocationPopup = ({ onAllow, onDeny, loading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Popup Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden animate-bounce-in">
        {/* Top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600" />

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-orange-50 flex items-center justify-center">
              <FiMapPin size={40} className="text-primary" />
            </div>
          </div>

          {/* Text */}
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
            Apni Location Allow Karo
          </h2>
          <p className="text-gray-500 text-sm text-center mb-1">
            Aapke aas-paas ke petrol pumps fetch karne ke liye
          </p>
          <p className="text-gray-400 text-xs text-center mb-6">
            📍 Aapki location sirf pump search ke liye use hogi
          </p>

          {/* Steps */}
          <div className="bg-orange-50 rounded-xl p-3 mb-5 space-y-2">
            <p className="text-xs font-semibold text-orange-700 mb-1">Kaise kaam karta hai:</p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
              "Allow" dabao neeche
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
              Browser popup mein "Allow" click karo
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
              Aapke nearest pumps turant dikhenge ⛽
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={onAllow}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition mb-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Location detect ho rahi hai...
              </>
            ) : (
              <>
                <FiNavigation size={16} />
                Haan, Location Allow Karo
              </>
            )}
          </button>

          <button
            onClick={onDeny}
            disabled={loading}
            className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Abhi Nahi — City Search Use Karunga
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPopup;

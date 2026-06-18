import { useState } from 'react';
import { FiNavigation, FiMapPin, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const LocationPopup = ({ onAllow, onDeny, loading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Top bar */}
        <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600" />

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-orange-50 flex items-center justify-center border-4 border-orange-100">
              <FiMapPin size={36} className="text-primary" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
            Location Access Chahiye
          </h2>
          <p className="text-gray-500 text-sm text-center mb-5">
            Aapke <span className="font-semibold text-primary">current location</span> ke aas-paas ke<br />
            real petrol pumps fetch karne ke liye
          </p>

          {/* Info box */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-5 space-y-2">
            {[
              'GPS se exact current location lega',
              'Nearest petrol pumps real-time fetch honge',
              'Location sirf pump search ke liye use hogi',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                <FiCheckCircle size={13} className="text-green-500 shrink-0" />
                {text}
              </div>
            ))}
          </div>

          {/* Allow Button */}
          <button
            onClick={onAllow}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-orange-600 active:scale-95 transition mb-2 disabled:opacity-70"
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

          {/* Deny */}
          <button
            onClick={onDeny}
            disabled={loading}
            className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition rounded-xl hover:bg-gray-50"
          >
            Nahi — City Search Use Karunga
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPopup;

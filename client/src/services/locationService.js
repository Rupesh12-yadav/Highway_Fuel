import api from './api';

export const locationService = {
  getNearby: (lat, lng, radius = 5000) =>
    api.get('/location/nearby', { params: { lat, lng, radius } }),
  getByCity: (city, radius = 10000) =>
    api.get('/location/city', { params: { city, radius } }),
  getPumpDetails: (osmId, type = 'node') =>
    api.get(`/location/pump/${osmId}`, { params: { type } }),
};

/**
 * Fresh accurate GPS location lo - no cache, high accuracy
 */
export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation browser mein supported nahi hai'));
      return;
    }

    // maximumAge: 0 = always fresh location, no cache
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy, // meters mein accuracy
        });
      },
      (err) => {
        const msgs = {
          1: 'Location permission denied - browser settings mein allow karo',
          2: 'Location unavailable - GPS signal nahi mila',
          3: 'Location timeout - dobara try karo',
        };
        reject(new Error(msgs[err.code] || err.message));
      },
      {
        enableHighAccuracy: true, // GPS use karo, WiFi nahi
        timeout: 15000,           // 15 sec wait
        maximumAge: 0,            // NO cache - hamesha fresh location
      }
    );
  });

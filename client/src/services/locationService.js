import api from './api';

export const locationService = {
  // GPS coordinates se nearby pumps (Overpass API)
  getNearby: (lat, lng, radius = 5000) =>
    api.get('/location/nearby', { params: { lat, lng, radius } }),

  // City name se pumps (Nominatim + Overpass)
  getByCity: (city, radius = 10000) =>
    api.get('/location/city', { params: { city, radius } }),

  // OSM pump details
  getPumpDetails: (osmId, type = 'node') =>
    api.get(`/location/pump/${osmId}`, { params: { type } }),
};

/**
 * Browser Geolocation API se current GPS position lo
 * Returns: Promise<{ lat, lng }>
 */
export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation browser mein supported nahi hai'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        const msgs = {
          1: 'Location permission denied - browser settings mein allow karo',
          2: 'Location unavailable - GPS signal nahi mila',
          3: 'Location timeout - dobara try karo',
        };
        reject(new Error(msgs[err.code] || err.message));
      },
      { timeout: 12000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  });

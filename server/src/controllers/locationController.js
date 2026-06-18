const axios = require('axios');

// Overpass API - OpenStreetMap ka free API, no key required
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
// Nominatim - Free geocoding API (city → lat/lng), no key required
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

/**
 * GPS lat/lng se nearby petrol pumps fetch karo
 * GET /api/location/nearby?lat=28.6139&lng=77.2090&radius=5000
 */
const getNearbyPumps = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'lat aur lng required hain' });
    }

    const radiusM = Math.min(Number(radius), 50000); // max 50km

    // Overpass QL query - fuel station type ke sab nodes/ways fetch karo
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="fuel"](around:${radiusM},${lat},${lng});
        way["amenity"="fuel"](around:${radiusM},${lat},${lng});
      );
      out body center;
    `;

    const response = await axios.post(OVERPASS_URL, query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 30000,
    });

    const elements = response.data.elements || [];
    const pumps = elements.map((el) => parsePump(el, Number(lat), Number(lng)));
    pumps.sort((a, b) => Number(a.distanceKm) - Number(b.distanceKm));

    res.json({
      success: true,
      message: `${pumps.length} petrol pumps found within ${radiusM / 1000}km`,
      data: {
        pumps,
        total: pumps.length,
        searchLocation: { lat: Number(lat), lng: Number(lng) },
        radiusKm: radiusM / 1000,
        source: 'OpenStreetMap (Overpass API)',
      },
    });
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ success: false, message: 'Overpass API timeout - radius kam karo' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * City name se petrol pumps fetch karo
 * GET /api/location/city?city=Delhi&radius=10000
 */
const getPumpsByCity = async (req, res) => {
  try {
    const { city, radius = 10000 } = req.query;

    if (!city) return res.status(400).json({ success: false, message: 'city required hai' });

    // Step 1: Nominatim se city geocode karo (free)
    const geoRes = await axios.get(`${NOMINATIM_URL}/search`, {
      params: {
        q: `${city}, India`,
        format: 'json',
        limit: 1,
        addressdetails: 1,
      },
      headers: { 'User-Agent': 'HighwayFuelApp/1.0' },
      timeout: 10000,
    });

    if (!geoRes.data?.length) {
      return res.status(404).json({ success: false, message: `"${city}" city nahi mili` });
    }

    const { lat, lon: lng, display_name } = geoRes.data[0];

    // Step 2: Overpass se us city ke pumps fetch karo
    const radiusM = Math.min(Number(radius), 30000);
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="fuel"](around:${radiusM},${lat},${lng});
        way["amenity"="fuel"](around:${radiusM},${lat},${lng});
      );
      out body center;
    `;

    const overpassRes = await axios.post(OVERPASS_URL, query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 30000,
    });

    const elements = overpassRes.data.elements || [];
    const pumps = elements.map((el) => parsePump(el, Number(lat), Number(lng)));
    pumps.sort((a, b) => Number(a.distanceKm) - Number(b.distanceKm));

    res.json({
      success: true,
      message: `${pumps.length} petrol pumps found in ${city}`,
      data: {
        pumps,
        total: pumps.length,
        cityCenter: { lat: Number(lat), lng: Number(lng) },
        cityName: display_name,
        source: 'OpenStreetMap (Overpass API)',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * OSM Node ID se pump details fetch karo
 * GET /api/location/pump/:osmId
 */
const getPumpDetails = async (req, res) => {
  try {
    const { osmId } = req.params;
    const type = req.query.type || 'node'; // node ya way

    const query = `
      [out:json][timeout:10];
      ${type}(${osmId});
      out body;
    `;

    const response = await axios.post(OVERPASS_URL, query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 15000,
    });

    const el = response.data.elements?.[0];
    if (!el) return res.status(404).json({ success: false, message: 'Pump not found' });

    const tags = el.tags || {};

    res.json({
      success: true,
      message: 'Pump details fetched',
      data: {
        osm_id: osmId,
        osm_type: type,
        name: tags.name || tags.brand || 'Petrol Pump',
        brand: tags.brand || null,
        operator: tags.operator || null,
        phone: tags.phone || tags['contact:phone'] || null,
        website: tags.website || tags['contact:website'] || null,
        opening_hours: tags.opening_hours || null,
        latitude: el.lat || el.center?.lat,
        longitude: el.lon || el.center?.lon,
        fuelTypes: extractFuelTypes(tags),
        address: buildAddress(tags),
        source: 'OpenStreetMap',
        osmUrl: `https://www.openstreetmap.org/${type}/${osmId}`,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Helpers ─────────────────────────────────────────────

/**
 * OSM element ko clean pump object mein convert karo
 */
function parsePump(el, userLat, userLng) {
  const tags = el.tags || {};
  const lat = el.lat || el.center?.lat;
  const lng = el.lon || el.center?.lon;
  const distKm = haversineDistance(userLat, userLng, lat, lng);

  return {
    osm_id: String(el.id),
    osm_type: el.type,         // 'node' ya 'way'
    name: tags.name || tags.brand || tags.operator || 'Petrol Pump',
    brand: tags.brand || null,
    operator: tags.operator || null,
    address: buildAddress(tags),
    latitude: lat,
    longitude: lng,
    distanceKm: distKm.toFixed(2),
    phone: tags.phone || tags['contact:phone'] || null,
    opening_hours: tags.opening_hours || null,
    fuelTypes: extractFuelTypes(tags),
    source: 'openstreetmap',
    osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  };
}

/**
 * OSM tags se fuel types nikalo
 */
function extractFuelTypes(tags) {
  const types = [];
  if (tags['fuel:petrol'] === 'yes' || tags['fuel:octane_91'] === 'yes' || tags['fuel:octane_95'] === 'yes') types.push('petrol');
  if (tags['fuel:diesel'] === 'yes' || tags['fuel:HGV_diesel'] === 'yes') types.push('diesel');
  if (tags['fuel:cng'] === 'yes') types.push('cng');
  if (tags['fuel:lpg'] === 'yes') types.push('lpg');
  if (tags['fuel:electric'] === 'yes' || tags['amenity'] === 'charging_station') types.push('ev');
  // Agar koi tag nahi to default petrol + diesel assume karo
  if (types.length === 0) types.push('petrol', 'diesel');
  return types;
}

/**
 * OSM tags se readable address build karo
 */
function buildAddress(tags) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:neighbourhood'],
    tags['addr:suburb'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
    tags['addr:state'],
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : tags.description || 'Address not available';
}

/**
 * Haversine distance formula (km)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = { getNearbyPumps, getPumpsByCity, getPumpDetails };

const axios = require('axios');

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

// GET request use karo (POST 406 deta hai kuch environments mein)
const runOverpassQuery = async (query) => {
  const res = await axios.get(OVERPASS_URL, {
    params: { data: query },
    headers: { 'User-Agent': 'HighwayFuelApp/1.0' },
    timeout: 30000,
  });
  return res.data.elements || [];
};

/**
 * GET /api/location/nearby?lat=28.6139&lng=77.2090&radius=5000
 */
const getNearbyPumps = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'lat aur lng required hain' });
    }

    const radiusM = Math.min(Number(radius), 50000);
    const query = `[out:json][timeout:25];(node["amenity"="fuel"](around:${radiusM},${lat},${lng});way["amenity"="fuel"](around:${radiusM},${lat},${lng}););out body center;`;

    const elements = await runOverpassQuery(query);
    const pumps = elements
      .map(el => parsePump(el, Number(lat), Number(lng)))
      .filter(p => p.latitude && p.longitude)
      .sort((a, b) => Number(a.distanceKm) - Number(b.distanceKm));

    return res.json({
      success: true,
      message: `${pumps.length} petrol pumps found within ${radiusM / 1000}km`,
      data: {
        pumps,
        total: pumps.length,
        searchLocation: { lat: Number(lat), lng: Number(lng) },
        radiusKm: radiusM / 1000,
        source: 'OpenStreetMap',
      },
    });
  } catch (err) {
    console.error('getNearbyPumps error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/location/city?city=Delhi&radius=10000
 */
const getPumpsByCity = async (req, res) => {
  try {
    const { city, radius = 10000 } = req.query;
    if (!city) return res.status(400).json({ success: false, message: 'city required hai' });

    // Nominatim geocode
    const geoRes = await axios.get(`${NOMINATIM_URL}/search`, {
      params: { q: `${city}, India`, format: 'json', limit: 1, addressdetails: 1 },
      headers: { 'User-Agent': 'HighwayFuelApp/1.0' },
      timeout: 10000,
    });

    if (!geoRes.data?.length) {
      return res.status(404).json({ success: false, message: `"${city}" city nahi mili` });
    }

    const { lat, lon: lng, display_name } = geoRes.data[0];
    const radiusM = Math.min(Number(radius), 30000);

    const query = `[out:json][timeout:25];(node["amenity"="fuel"](around:${radiusM},${lat},${lng});way["amenity"="fuel"](around:${radiusM},${lat},${lng}););out body center;`;

    const elements = await runOverpassQuery(query);
    const pumps = elements
      .map(el => parsePump(el, Number(lat), Number(lng)))
      .filter(p => p.latitude && p.longitude)
      .sort((a, b) => Number(a.distanceKm) - Number(b.distanceKm));

    return res.json({
      success: true,
      message: `${pumps.length} petrol pumps found in ${city}`,
      data: {
        pumps,
        total: pumps.length,
        cityCenter: { lat: Number(lat), lng: Number(lng) },
        cityName: display_name,
        source: 'OpenStreetMap',
      },
    });
  } catch (err) {
    console.error('getPumpsByCity error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/location/pump/:osmId?type=node
 */
const getPumpDetails = async (req, res) => {
  try {
    const { osmId } = req.params;
    const type = req.query.type || 'node';
    const query = `[out:json][timeout:10];${type}(${osmId});out body;`;

    const elements = await runOverpassQuery(query);
    if (!elements.length) {
      return res.status(404).json({ success: false, message: 'Pump not found' });
    }

    const el = elements[0];
    const tags = el.tags || {};

    return res.json({
      success: true,
      message: 'Pump details fetched',
      data: {
        osm_id: osmId,
        osm_type: type,
        name: tags.name || tags.brand || tags.operator || 'Petrol Pump',
        brand: tags.brand || null,
        phone: tags.phone || tags['contact:phone'] || null,
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
    console.error('getPumpDetails error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Helpers ─────────────────────────────────────────────

function parsePump(el, userLat, userLng) {
  const tags = el.tags || {};
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;

  return {
    osm_id: String(el.id),
    osm_type: el.type,
    name: tags.name || tags.brand || tags.operator || 'Petrol Pump',
    brand: tags.brand || null,
    operator: tags.operator || null,
    address: buildAddress(tags),
    latitude: lat,
    longitude: lng,
    distanceKm: haversineDistance(userLat, userLng, lat, lng).toFixed(2),
    phone: tags.phone || tags['contact:phone'] || null,
    opening_hours: tags.opening_hours || null,
    fuelTypes: extractFuelTypes(tags),
    source: 'openstreetmap',
    osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  };
}

function extractFuelTypes(tags) {
  const types = [];
  if (tags['fuel:petrol'] === 'yes' || tags['fuel:octane_91'] === 'yes' || tags['fuel:octane_95'] === 'yes') types.push('petrol');
  if (tags['fuel:diesel'] === 'yes' || tags['fuel:HGV_diesel'] === 'yes') types.push('diesel');
  if (tags['fuel:cng'] === 'yes') types.push('cng');
  if (tags['fuel:lpg'] === 'yes') types.push('lpg');
  if (tags['fuel:electric'] === 'yes') types.push('ev');
  if (types.length === 0) types.push('petrol', 'diesel');
  return types;
}

function buildAddress(tags) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
    tags['addr:state'],
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Address not available';
}

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

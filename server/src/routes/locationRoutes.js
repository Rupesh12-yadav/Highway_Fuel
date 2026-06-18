const express = require('express');
const router = express.Router();
const { getNearbyPumps, getPumpsByCity, getPumpDetails } = require('../controllers/locationController');

// GPS se nearby pumps - ?lat=28.6139&lng=77.2090&radius=5000
router.get('/nearby', getNearbyPumps);

// City name se pumps - ?city=Delhi&radius=10000
router.get('/city', getPumpsByCity);

// OSM pump details - /pump/123456789?type=node
router.get('/pump/:osmId', getPumpDetails);

module.exports = router;

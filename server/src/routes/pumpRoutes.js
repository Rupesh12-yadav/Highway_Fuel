const express = require('express');
const router = express.Router();
const { getAllPumps, getPumpById, createPump, updatePump, deletePump, getMyPumps } = require('../controllers/pumpController');
const { protect } = require('../middleware/authMiddleware');
const { dealerOnly } = require('../middleware/dealerMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', getAllPumps);
router.get('/my', protect, dealerOnly, getMyPumps);
router.get('/:id', getPumpById);
router.post('/', protect, dealerOnly, upload.fields([{ name: 'image' }, { name: 'license' }]), createPump);
router.put('/:id', protect, dealerOnly, updatePump);
router.delete('/:id', protect, dealerOnly, deletePump);

module.exports = router;

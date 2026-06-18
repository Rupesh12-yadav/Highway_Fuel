const PetrolPump = require('../models/PetrolPump');
const { sendResponse } = require('../utils/responseHandler');

const getAllPumps = async (req, res) => {
  try {
    const { city, highway, fuelType, page = 1, limit = 10 } = req.query;
    const filter = { isApproved: true, status: 'active' };
    if (city) filter.city = new RegExp(city, 'i');
    if (highway) filter.highway = new RegExp(highway, 'i');
    if (fuelType) filter['fuelTypes.type'] = fuelType;

    const pumps = await PetrolPump.find(filter)
      .populate('ownerId', 'name email phone')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await PetrolPump.countDocuments(filter);
    sendResponse(res, 200, true, 'Pumps fetched', { pumps, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const getPumpById = async (req, res) => {
  try {
    const pump = await PetrolPump.findById(req.params.id).populate('ownerId', 'name email phone');
    if (!pump) return sendResponse(res, 404, false, 'Pump not found');
    sendResponse(res, 200, true, 'Pump fetched', pump);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const createPump = async (req, res) => {
  try {
    const pumpData = { ...req.body, ownerId: req.user._id };
    if (req.files?.license) pumpData.license = req.files.license[0].path;
    if (req.files?.image) pumpData.image = req.files.image[0].path;
    const pump = await PetrolPump.create(pumpData);
    sendResponse(res, 201, true, 'Pump created, pending approval', pump);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const updatePump = async (req, res) => {
  try {
    const pump = await PetrolPump.findById(req.params.id);
    if (!pump) return sendResponse(res, 404, false, 'Pump not found');
    if (pump.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return sendResponse(res, 403, false, 'Not authorized');
    const updated = await PetrolPump.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendResponse(res, 200, true, 'Pump updated', updated);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const deletePump = async (req, res) => {
  try {
    const pump = await PetrolPump.findById(req.params.id);
    if (!pump) return sendResponse(res, 404, false, 'Pump not found');
    if (pump.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return sendResponse(res, 403, false, 'Not authorized');
    await pump.deleteOne();
    sendResponse(res, 200, true, 'Pump deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

const getMyPumps = async (req, res) => {
  try {
    const pumps = await PetrolPump.find({ ownerId: req.user._id });
    sendResponse(res, 200, true, 'My pumps fetched', pumps);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

module.exports = { getAllPumps, getPumpById, createPump, updatePump, deletePump, getMyPumps };

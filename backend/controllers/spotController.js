const ParkingSpot = require("../models/ParkingSpot");

async function getSpots(req, res) {
  const filter = {};
  if (req.query.zone) filter.zone = req.query.zone;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;
  const spots = await ParkingSpot.find(filter).sort({ zone: 1, code: 1 });
  res.json(spots);
}

async function getSpot(req, res) {
  const spot = await ParkingSpot.findById(req.params.id);
  if (!spot) return res.status(404).json({ message: "Vendi nuk u gjet" });
  res.json(spot);
}

async function createSpot(req, res) {
  try {
    const spot = await ParkingSpot.create(req.body);
    res.status(201).json(spot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function updateSpot(req, res) {
  const spot = await ParkingSpot.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!spot) return res.status(404).json({ message: "Vendi nuk u gjet" });
  res.json(spot);
}

async function deleteSpot(req, res) {
  const spot = await ParkingSpot.findByIdAndDelete(req.params.id);
  if (!spot) return res.status(404).json({ message: "Vendi nuk u gjet" });
  res.json({ message: "Vendi u fshi" });
}

async function stats(req, res) {
  const total = await ParkingSpot.countDocuments();
  const free = await ParkingSpot.countDocuments({ status: "free" });
  const reserved = await ParkingSpot.countDocuments({ status: "reserved" });
  const occupied = await ParkingSpot.countDocuments({ status: "occupied" });
  res.json({ total, free, reserved, occupied });
}

module.exports = { getSpots, getSpot, createSpot, updateSpot, deleteSpot, stats };

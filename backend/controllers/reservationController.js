const Reservation = require("../models/Reservation");
const ParkingSpot = require("../models/ParkingSpot");

function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

async function createReservation(req, res) {
  const { spot, startTime, endTime, plate } = req.body;
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ message: "Intervali kohor nuk eshte valid" });
    }

    const parkingSpot = await ParkingSpot.findById(spot);
    if (!parkingSpot) return res.status(404).json({ message: "Vendi nuk u gjet" });

    const active = await Reservation.find({ spot, status: "active" });
    const clash = active.some((r) => overlaps(start, end, r.startTime, r.endTime));
    if (clash) {
      return res.status(409).json({ message: "Vendi eshte i zene per kete kohe" });
    }

    const hours = (end - start) / (1000 * 60 * 60);
    const totalPrice = Math.round(hours * parkingSpot.pricePerHour * 100) / 100;

    const reservation = await Reservation.create({
      user: req.user._id,
      spot,
      startTime: start,
      endTime: end,
      plate: plate || req.user.plate,
      totalPrice,
    });

    parkingSpot.status = "reserved";
    await parkingSpot.save();

    res.status(201).json(await reservation.populate("spot"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function myReservations(req, res) {
  const list = await Reservation.find({ user: req.user._id })
    .populate("spot")
    .sort({ startTime: -1 });
  res.json(list);
}

async function allReservations(req, res) {
  const list = await Reservation.find()
    .populate("spot")
    .populate("user", "name email")
    .sort({ startTime: -1 });
  res.json(list);
}

async function cancelReservation(req, res) {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return res.status(404).json({ message: "Rezervimi nuk u gjet" });
  if (
    reservation.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Nuk ke qasje ne kete rezervim" });
  }
  reservation.status = "cancelled";
  await reservation.save();

  const stillBusy = await Reservation.exists({ spot: reservation.spot, status: "active" });
  if (!stillBusy) {
    await ParkingSpot.findByIdAndUpdate(reservation.spot, { status: "free" });
  }
  res.json({ message: "Rezervimi u anulua" });
}

async function suggest(req, res) {
  const { zone, type } = req.query;
  const filter = { status: "free" };
  if (zone) filter.zone = zone;
  if (type) filter.type = type;
  const spot = await ParkingSpot.findOne(filter).sort({ pricePerHour: 1, floor: 1 });
  if (!spot) return res.status(404).json({ message: "Nuk ka vend te lire" });
  res.json(spot);
}

module.exports = {
  createReservation,
  myReservations,
  allReservations,
  cancelReservation,
  suggest,
};

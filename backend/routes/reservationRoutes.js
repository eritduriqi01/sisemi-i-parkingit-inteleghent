const express = require("express");
const {
  createReservation,
  myReservations,
  allReservations,
  cancelReservation,
  suggest,
} = require("../controllers/reservationController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.get("/suggest", suggest);
router.post("/", protect, createReservation);
router.get("/mine", protect, myReservations);
router.get("/", protect, admin, allReservations);
router.put("/:id/cancel", protect, cancelReservation);

module.exports = router;

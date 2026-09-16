const express = require("express");
const {
  getSpots,
  getSpot,
  createSpot,
  updateSpot,
  deleteSpot,
  stats,
} = require("../controllers/spotController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.get("/", getSpots);
router.get("/stats", stats);
router.get("/:id", getSpot);
router.post("/", protect, admin, createSpot);
router.put("/:id", protect, admin, updateSpot);
router.delete("/:id", protect, admin, deleteSpot);

module.exports = router;

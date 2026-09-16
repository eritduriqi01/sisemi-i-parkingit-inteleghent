const mongoose = require("mongoose");

const spotSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    zone: { type: String, required: true, trim: true },
    floor: { type: Number, default: 0 },
    type: { type: String, enum: ["standard", "disabled", "electric"], default: "standard" },
    pricePerHour: { type: Number, default: 1 },
    status: { type: String, enum: ["free", "reserved", "occupied"], default: "free" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParkingSpot", spotSchema);

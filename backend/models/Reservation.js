const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    spot: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingSpot", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    plate: { type: String, trim: true, uppercase: true },
    totalPrice: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "finished", "cancelled"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);

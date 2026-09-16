require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const ParkingSpot = require("./models/ParkingSpot");
const Reservation = require("./models/Reservation");

const zones = ["A", "B", "C"];

async function run() {
  await connectDB();

  await Reservation.deleteMany();
  await ParkingSpot.deleteMany();
  await User.deleteMany();

  await User.create({
    name: "Admin",
    email: "admin@parking.com",
    password: "admin123",
    role: "admin",
    plate: "01-ADM",
  });

  await User.create({
    name: "Perdorues Test",
    email: "user@parking.com",
    password: "user123",
    plate: "02-USR",
  });

  const spots = [];
  zones.forEach((zone) => {
    for (let i = 1; i <= 10; i++) {
      const num = String(i).padStart(2, "0");
      let type = "standard";
      if (i === 1) type = "disabled";
      if (i === 2) type = "electric";
      spots.push({
        code: `${zone}${num}`,
        zone,
        floor: zone === "C" ? 1 : 0,
        type,
        pricePerHour: type === "electric" ? 2 : 1,
      });
    }
  });
  await ParkingSpot.insertMany(spots);

  console.log(`U krijuan ${spots.length} vende dhe 2 perdorues`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

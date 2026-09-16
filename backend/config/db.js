const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB u lidh");
  } catch (err) {
    console.error("Lidhja me MongoDB deshtoi:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;

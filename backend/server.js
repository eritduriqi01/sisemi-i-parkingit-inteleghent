require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const spotRoutes = require("./routes/spotRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/spots", spotRoutes);
app.use("/api/reservations", reservationRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use((req, res) => res.status(404).json({ message: "Rruga nuk u gjet" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveri po degjon ne portin ${PORT}`));

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const connectDB = require("./src/config/connect");
const authRoutes = require("./src/routes/authRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");

app.use(express.json());
app.use(cors());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server and DB connection
const start = () => {
  connectDB(process.env.MONGO_URI)
    .then(() => {
      console.log(`Connected to Database... ✅`);
      app.listen(port, () => {
        console.log(`Server is running at port ${port}... ✅`);
      });
    })
    .catch((error) => {
      console.log("Failed to connect");
      console.log(error.message);
    });
};

start();

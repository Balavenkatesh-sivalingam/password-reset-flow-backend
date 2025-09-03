const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./router/userRouter");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({ origin: "https://passwords-reset-flow.netlify.app" }));

// Routes
app.use("/api/users", userRoutes);

// Optional root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

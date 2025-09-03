const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./router/userRouter");
const cors = require("cors");

require("dotenv").config();

const app = express();

connectDB();

app.use(express.json());

app.use(cors());

app.use("/api/users", userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server is running");
});

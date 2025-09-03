const mongoose = require("mongoose");

require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongodb is connected");
  } catch (error) {
    console.log("unable to connect to the database");
  }
};

module.exports = connectDB;

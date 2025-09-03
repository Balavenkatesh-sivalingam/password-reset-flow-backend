const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const sendMail = require("../mailer/nodeMail");

const router = express.Router();

require("dotenv").config();

// ----------------- REGISTER -----------------
router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const exisitingUser = await User.findOne({
      $or: [{ userName }, { email }],
    });
    if (exisitingUser) {
      return res.status(400).json({
        error: "User already exists in DB",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashPassword });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to register the user",
    });
  }
});

// ----------------- LOGIN -----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found, please register" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
});

// ----------------- PASSWORD RESET REQUEST -----------------
router.post("/passwordReset", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User is not registered, please register",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetlink = `http://localhost:3000/resetPassword/${token}`;
    await sendMail(user.email, "Password Reset", `Reset your password: ${resetlink}`);

    res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- RESET PASSWORD -----------------
router.post("/resetPassword/:token", async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: "Token has expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;

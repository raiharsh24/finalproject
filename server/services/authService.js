// Auth Service Layer – OTP + Password authentication

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

// In-memory OTP store (⚠️ replace with Redis in production)
const otpStore = {};

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= HELPERS ================= */

// Hash password
const hashPassword = async (pwd) => {
  return await bcrypt.hash(pwd, 10);
};

// Verify OTP (central logic)
const verifyStoredOtp = (email, otp) => {
  const record = otpStore[email];

  if (!record) {
    throw new Error("No OTP found");
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    throw new Error("OTP expired");
  }

  if (record.otp !== otp.toString()) {
    throw new Error("Invalid OTP");
  }

  // ✅ OTP is valid → remove it (one-time use)
  delete otpStore[email];
};

/* ================= SERVICES ================= */

// Send OTP
const sendOtp = async ({ email }) => {
  if (!email) {
    throw new Error("Email required");
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });

  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  console.log("OTP (dev):", otp);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
  });

  return { message: "OTP sent successfully" };
};

// Register (OTP + password)
const registerUserAfterOtp = async ({ email, otp, password }) => {
  if (!email || !otp || !password) {
    throw new Error("Email, OTP and password are required");
  }

  // ✅ Verify OTP inside register (IMPORTANT)
  verifyStoredOtp(email, otp);

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  await User.create({
    email,
    password: hashedPassword,
    role: "student",
  });

  return { message: "User registered successfully" };
};

// Login
const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, role: user.role };
};

// Forgot password (send OTP)
const forgotPassword = async ({ email }) => {
  return await sendOtp({ email });
};

// Verify OTP (optional endpoint)
const verifyOtp = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  verifyStoredOtp(email, otp);

  return { message: "OTP verified successfully" };
};

// Reset password
const resetPassword = async ({ email, otp, password }) => {
  if (!email || !otp || !password) {
    throw new Error("Email, OTP and password required");
  }

  verifyStoredOtp(email, otp);

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  user.password = await hashPassword(password);
  await user.save();

  return { message: "Password updated successfully" };
};

/* ================= EXPORTS ================= */

module.exports = {
  sendOtp,
  registerUserAfterOtp,
  loginUser,
  verifyOtp,
  forgotPassword,
  resetPassword,
};
const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const otpGenerator = require(
  "otp-generator"
);

/* ================= OTP STORE ================= */

const otpStore = {};

/* ================= MAIL ================= */

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,

      pass: process.env.EMAIL_PASS,
    },
  });

/* ================= HELPERS ================= */

const hashPassword =
  async (pwd) => {
    return await bcrypt.hash(
      pwd,
      10
    );
  };

const verifyStoredOtp = (
  email,
  otp
) => {
  const record =
    otpStore[email];

  if (!record) {
    throw new Error(
      "No OTP found"
    );
  }

  if (
    Date.now() >
    record.expiresAt
  ) {
    delete otpStore[email];

    throw new Error(
      "OTP expired"
    );
  }

  if (
    record.otp !==
    otp.toString()
  ) {
    throw new Error(
      "Invalid OTP"
    );
  }

  delete otpStore[email];
};

/* ================= JWT ================= */

const generateToken = (
  user
) => {
  return jwt.sign(
    {
      id: user._id,

      role: user.role,

      email: user.email,
    },

    process.env.JWT_SECRET ||
      "SECRET_KEY",

    {
      expiresIn: "7d",
    }
  );
};

/* ================= SEND OTP ================= */

const sendOtp = async ({
  email,
  mode,
}) => {
  if (!email) {
    throw new Error(
      "Email required"
    );
  }

  const user =
    await User.findOne({
      email,
    });

  /* ================= SIGNUP CHECK ================= */

  if (
    mode === "signup" &&
    user
  ) {
    throw new Error(
      "User already exists"
    );
  }

  /* ================= FORGOT CHECK ================= */

  if (
    mode === "forgot" &&
    !user
  ) {
    throw new Error(
      "User not found"
    );
  }

  /* ================= GENERATE OTP ================= */

  const otp =
    otpGenerator.generate(
      6,
      {
        upperCaseAlphabets: false,

        lowerCaseAlphabets: false,

        specialChars: false,

        digits: true,
      }
    );

  otpStore[email] = {
    otp,

    expiresAt:
      Date.now() +
      5 * 60 * 1000,
  };

  console.log(
    "OTP (dev):",
    otp
  );

  /* ================= SEND EMAIL ================= */

  await transporter.sendMail({
    from:
      process.env.EMAIL_USER,

    to: email,

    subject:
      "CodeArena OTP Verification",

    text: `Your OTP is ${otp}`,
  });

  return {
    success: true,

    message:
      "OTP sent successfully",
  };
};

/* ================= REGISTER ================= */

const registerUserAfterOtp =
  async ({
    email,
    otp,
    password,
    name,
  }) => {
    if (
      !email ||
      !otp ||
      !password
    ) {
      throw new Error(
        "Email, OTP and password are required"
      );
    }

    verifyStoredOtp(
      email,
      otp
    );

    const existing =
      await User.findOne({
        email,
      });

    if (existing) {
      throw new Error(
        "User already exists"
      );
    }

    const hashedPassword =
      await hashPassword(
        password
      );

    const user =
      await User.create({
        name:
          name || "New User",

        email,

        password:
          hashedPassword,

        role: "student",
      });

    const token =
      generateToken(user);

    return {
      success: true,

      message:
        "User registered successfully",

      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,
      },
    };
  };

/* ================= LOGIN ================= */

const loginUser = async ({
  email,
  password,
}) => {
  if (
    !email ||
    !password
  ) {
    throw new Error(
      "Email and password required"
    );
  }

  const user =
    await User.findOne({
      email,
    });

  /* ================= USER CHECK ================= */

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  /* ================= BLOCK CHECK ================= */

  if (
    user.isBlocked
  ) {
    throw new Error(
      "Your account has been blocked"
    );
  }

  if (
    !user.isActive
  ) {
    throw new Error(
      "Your account is inactive"
    );
  }

  /* ================= PASSWORD CHECK ================= */

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Incorrect password"
    );
  }

  /* ================= UPDATE LOGIN ================= */

  user.lastLogin =
    new Date();

  await user.save();

  /* ================= TOKEN ================= */

  const token =
    generateToken(user);

  return {
    success: true,

    message:
      "Login successful",

    token,

    user: {
      id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      contestScore:
        user.contestScore,

      problemsSolved:
        user.problemsSolved,
    },
  };
};

/* ================= FORGOT PASSWORD ================= */

const forgotPassword =
  async ({ email }) => {
    return await sendOtp({
      email,

      mode: "forgot",
    });
  };

/* ================= VERIFY OTP ================= */

const verifyOtp = async ({
  email,
  otp,
}) => {
  if (
    !email ||
    !otp
  ) {
    throw new Error(
      "Email and OTP are required"
    );
  }

  verifyStoredOtp(
    email,
    otp
  );

  return {
    success: true,

    message:
      "OTP verified successfully",
  };
};

/* ================= RESET PASSWORD ================= */

const resetPassword =
  async ({
    email,
    otp,
    password,
  }) => {
    if (
      !email ||
      !otp ||
      !password
    ) {
      throw new Error(
        "Email, OTP and password required"
      );
    }

    verifyStoredOtp(
      email,
      otp
    );

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    user.password =
      await hashPassword(
        password
      );

    await user.save();

    return {
      success: true,

      message:
        "Password updated successfully",
    };
  };

module.exports = {
  sendOtp,

  registerUserAfterOtp,

  loginUser,

  verifyOtp,

  forgotPassword,

  resetPassword,
};
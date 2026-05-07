const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* ================= BASIC AUTH ================= */

    name: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* ================= ROLE SYSTEM ================= */

    role: {
      type: String,
      enum: [
        "student",
        "teacher",
        "admin",
      ],
      default: "student",
    },

    /* ================= USER STATUS ================= */

    isActive: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    /* ================= PROFILE ================= */

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    /* ================= CONTEST MODE ================= */

    contestJoined: {
      type: Boolean,
      default: false,
    },

    contestStartTime: {
      type: Date,
      default: null,
    },

    contestScore: {
      type: Number,
      default: 0,
    },

    contestSolved: [
      {
        problemId: String,

        score: {
          type: Number,
          default: 0,
        },

        solvedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* ================= ANALYTICS ================= */

    totalSubmissions: {
      type: Number,
      default: 0,
    },

    acceptedSubmissions: {
      type: Number,
      default: 0,
    },

    contestsParticipated: {
      type: Number,
      default: 0,
    },

    problemsSolved: {
      type: Number,
      default: 0,
    },

    /* ================= ADMIN ================= */

    lastLogin: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);
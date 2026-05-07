const mongoose =
  require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
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

      /* ================= CONTEST SYSTEM ================= */

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
        },
      ],

      /* ================= ANALYTICS ================= */

      problemsSolved: {
        type: Number,
        default: 0,
      },
    },

    /* IMPORTANT */

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "User",
    userSchema
  );
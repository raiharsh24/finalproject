const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,

  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student"
  },

  /* ================= CONTEST MODE ================= */

  // ✅ has user joined contest
  contestJoined: {
    type: Boolean,
    default: false,
  },

  // ✅ when user joined
  contestStartTime: {
    type: Date,
    default: null,
  },

  // ✅ total contest score
  contestScore: {
    type: Number,
    default: 0,
  },

  // ✅ problems solved in contest
  contestSolved: [
    {
      problemId: String,
      score: Number,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
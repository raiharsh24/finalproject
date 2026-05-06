const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ✅ FIX: use string instead of ObjectId
  problemId: {
    type: String,
    required: true,
  },

  // ✅ NEW: store score
  score: {
    type: Number,
    default: 0,
  },

  // Passed / Failed / Accepted
  status: {
    type: String,
    required: true,
  },

  // ✅ NEW: language tracking
  language: {
    type: String,
    default: "cpp",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* ✅ IMPORTANT INDEXES (for leaderboard performance) */
submissionSchema.index({ problemId: 1, score: -1 });
submissionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  status: String, // Passed / Failed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", submissionSchema);
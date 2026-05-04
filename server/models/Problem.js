const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  starterCode: { type: String, default: "" },
  testCases: [{ input: String, expected: String }]
});

module.exports = mongoose.model("Problem", problemSchema);
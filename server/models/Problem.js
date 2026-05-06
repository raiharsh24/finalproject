const mongoose = require("mongoose");

const sampleIOSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
    },

    output: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const hiddenTestCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
    },

    output: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    /* BASIC INFO */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      default: "DSA",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    tags: [
      {
        type: String,
      },
    ],

    constraints: {
      type: String,
      default: "",
    },

    /* CODEARENA TEST CASES */

    sampleIO: [sampleIOSchema],

    hiddenTestCases: [hiddenTestCaseSchema],

    /* EXISTING SUPPORT */

    starterCode: {
      type: String,
      default: "",
    },

    testCases: [
      {
        input: String,
        expected: String,
      },
    ],

    /* ANALYTICS */

    submissions: {
      type: Number,
      default: 0,
    },

    acceptedSubmissions: {
      type: Number,
      default: 0,
    },

    acceptance: {
      type: String,
      default: "0%",
    },

    /* RELATIONS */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Problem",
  problemSchema
);
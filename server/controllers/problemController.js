const Problem = require("../models/Problem");

/* ---------------- HELPER ---------------- */

const calculateAcceptance = (
  submissions,
  accepted
) => {
  if (!submissions || submissions === 0) {
    return "0%";
  }

  return `${Math.round(
    (accepted / submissions) * 100
  )}%`;
};

/* ---------------- GET ALL ---------------- */

exports.getAll = async (req, res) => {
  try {
    const problems = await Problem.find()
      .populate("createdBy", "email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ---------------- GET ONE ---------------- */

exports.getOne = async (req, res) => {
  try {
    const problem = await Problem.findById(
      req.params.id
    ).populate("createdBy", "email role");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({
      success: true,
      data: problem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ---------------- CREATE ---------------- */

exports.create = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      difficulty,
      tags,
      constraints,
      sampleIO,
      hiddenTestCases,
      starterCode,
    } = req.body;

    if (
      !title ||
      !description ||
      !subject
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and subject are required",
      });
    }

    const problem = new Problem({
      title,
      description,
      subject,
      difficulty,
      tags,
      constraints,
      sampleIO,
      hiddenTestCases,
      starterCode,

      submissions: 0,
      acceptedSubmissions: 0,
      acceptance: "0%",

      createdBy: req.user?.id,
    });

    await problem.save();

    res.status(201).json({
      success: true,
      message:
        "Problem created successfully",
      data: problem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ---------------- UPDATE ---------------- */

exports.update = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (
      updates.submissions !== undefined ||
      updates.acceptedSubmissions !==
        undefined
    ) {
      const submissions =
        updates.submissions || 0;

      const accepted =
        updates.acceptedSubmissions || 0;

      updates.acceptance =
        calculateAcceptance(
          submissions,
          accepted
        );
    }

    const problem =
      await Problem.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({
      success: true,
      message:
        "Problem updated successfully",
      data: problem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ---------------- DELETE ---------------- */

exports.remove = async (req, res) => {
  try {
    const problem =
      await Problem.findByIdAndDelete(
        req.params.id
      );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({
      success: true,
      message:
        "Problem deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
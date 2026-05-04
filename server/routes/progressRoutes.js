const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const Submission = require("../models/Submission");

/* USER PROGRESS */
router.get("/", auth, async (req, res) => {
  const submissions = await Submission.find({ userId: req.user.id });

  const total = submissions.length;
  const passed = submissions.filter(s => s.status === "Passed").length;

  res.json({
    total,
    passed,
    failed: total - passed
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();

const {
  runCode,
  submitCode,
} = require('../controllers/runController');

const codeService = require('../services/codeService'); // ✅ NEW

const validate = require('../middleware/validate');
const { runSchema, submitSchema } = require('../validation/codeSchemas');

/* ================= RUN ================= */
router.post('/run', validate(runSchema), runCode);

/* ================= SUBMIT ================= */
router.post('/submit', validate(submitSchema), submitCode);

/* ================= NEW: USER SUBMISSIONS ================= */
router.get('/history', async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const result = await codeService.getUserSubmissions(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/* ================= NEW: LEADERBOARD ================= */
router.get('/leaderboard/:problem', async (req, res, next) => {
  try {
    const { problem } = req.params;
    const result = await codeService.getLeaderboard(problem);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
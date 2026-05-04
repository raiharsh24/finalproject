const express = require('express');
const router = express.Router();

const { runCode, submitCode } = require('../controllers/runController');
const validate = require('../middleware/validate');
const { runSchema, submitSchema } = require('../validation/codeSchemas');

// Run code with Joi validation
router.post('/run', validate(runSchema), runCode);

// Submit code with Joi validation (requires problemId)
router.post('/submit', validate(submitSchema), submitCode);

module.exports = router;

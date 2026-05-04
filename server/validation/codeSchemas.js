// Joi schemas for code execution routes
const Joi = require('joi');

// Shared schema for both run and submit endpoints
const baseSchema = {
  code: Joi.string().required(),
  language: Joi.string().valid('cpp', 'python', 'javascript', 'java').required(),
  input: Joi.string().optional(),
  problemId: Joi.string().optional(),
};

// Run code schema (input is optional, problemId not used)
const runSchema = Joi.object({
  code: baseSchema.code,
  language: baseSchema.language,
  input: baseSchema.input,
});

// Submit code schema (requires problemId, may include input)
const submitSchema = Joi.object({
  code: baseSchema.code,
  language: baseSchema.language,
  input: baseSchema.input,
  problemId: baseSchema.problemId.required(),
});

module.exports = {
  runSchema,
  submitSchema,
};

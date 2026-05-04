const executeCpp = require("../compiler/executeCpp");
const executePython = require("../compiler/executePython");
const executeNode = require("../compiler/executeNode");
const executeJava = require("../compiler/executeJava");
const Submission = require("../models/Submission");

/* ---------------- RUN CODE ---------------- */

const codeService = require('../services/codeService');

// Controllers delegate to the service layer and rely on central error handling.

exports.runCode = async (req, res, next) => {
  try {
    const result = await codeService.runCode(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.submitCode = async (req, res, next) => {
  try {
    // Attach userId if authenticated (assuming auth middleware adds req.user)
    const payload = { ...req.body, userId: req.user ? req.user.id : undefined };
    const result = await codeService.submitCode(payload);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
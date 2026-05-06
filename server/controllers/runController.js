const codeService = require('../services/codeService');

/* ---------------- RUN CODE ---------------- */

exports.runCode = async (req, res, next) => {
  try {
    const result = await codeService.runCode(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/* ---------------- SUBMIT CODE (REAL JUDGE) ---------------- */

exports.submitCode = async (req, res, next) => {
  try {
    const { code, language, problem } = req.body;

    // ✅ Basic validation (IMPORTANT for judge stability)
    if (!code || !language || !problem) {
      return res.status(400).json({
        success: false,
        message: "Code, language and problem are required",
      });
    }

    // ✅ Attach userId if available
    const payload = {
      code,
      language,
      problem,
      userId: req.user ? req.user.id : null,
    };

    const result = await codeService.submitCode(payload);

    return res.json({
      success: true,
      ...result,
    });

  } catch (err) {
    next(err);
  }
};
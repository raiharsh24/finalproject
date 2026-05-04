const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ---------------- AI HINT ROUTE ---------------- */

router.post("/hint", async (req, res) => {
  try {
    const { code } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        hint: "API key not configured"
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        hint: "No code provided"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
You are a coding tutor.

Give ONLY a short hint (1-2 lines).
Do NOT give full solution.

Code:
${code}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    res.json({
      success: true,
      hint: response || "No hint generated"
    });

  } catch (err) {
    console.error("❌ GEMINI ERROR:", err.message);

    res.status(500).json({
      success: false,
      hint: "Failed to generate hint",
      error: err.message
    });
  }
});

module.exports = router;
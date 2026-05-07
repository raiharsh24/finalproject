import axios from "axios";

const API_KEY =
  import.meta.env.VITE_OPENROUTER_API_KEY;

export const askAI = async ({
  code,
  problem,
  action,
  output,
}) => {
  try {
    const prompt = `
You are an elite competitive programming mentor inside CodeArena AI.

================ PROBLEM ================
${problem}

================ USER CODE ================
${code}

================ PROGRAM OUTPUT ================
${output}

================ USER REQUEST ================
${action}

================ IMPORTANT RULES ================

- NEVER immediately give full direct solution.
- NEVER dump full copy-paste code.
- Guide the student step-by-step.
- Explain mistakes clearly.
- Explain algorithm intuition.
- Explain time complexity if relevant.
- Mention edge cases.
- If syntax error exists, explain exact line issue.
- If logic is wrong, explain WHY.
- Keep response concise and practical.
- Use bullet points.
- Sound like a real DSA mentor.
- Prefer hints over solutions.
- Help student think independently.

================ RESPONSE STYLE ================

Use this format:

## Issue
(short explanation)

## Hint
(guidance only)

## Improvement
(better approach)

## Complexity
(optional)
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "openrouter/auto",

        messages: [
          {
            role: "system",

            content:
              "You are CodeArena AI, an elite competitive programming mentor.",
          },

          {
            role: "user",

            content: prompt,
          },
        ],

        temperature: 0.7,

        max_tokens: 700,
      },

      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,

          "Content-Type":
            "application/json",

          "HTTP-Referer":
            "http://localhost:5173",

          "X-Title":
            "CodeArena AI",
        },
      }
    );

    return (
      response.data.choices?.[0]
        ?.message?.content ||
      "No AI response"
    );
  } catch (err) {
    console.log(err);

    if (
      err.response?.data?.error
    ) {
      return `AI Error: ${err.response.data.error.message}`;
    }

    return "AI request failed";
  }
};
// Code Service Layer

const executeCpp = require("../compiler/executeCpp");
const executePython = require("../compiler/executePython");
const executeNode = require("../compiler/executeNode");
const executeJava = require("../compiler/executeJava");
const Submission = require("../models/Submission");
const User = require("../models/User");

/* ================= EXECUTORS ================= */

const executors = {
  cpp: executeCpp,
  python: executePython,
  javascript: executeNode,
  java: executeJava,
};

/* ================= REAL CONTEST CONFIG ================= */

const CONTEST = {
  startTime: new Date("2026-05-05T17:30:00"),
  endTime: new Date("2026-05-05T18:30:00"),
};

/* ================= PROBLEMS ================= */

const problems = {
  "Two Sum": {
    testCases: [
      { input: "2 7 11 15\n9", expected: "0 1", hidden: false },
      { input: "3 2 4\n6", expected: "1 2", hidden: false },
      { input: "3 3\n6", expected: "0 1", hidden: true },
    ],
  },

  "Add Two Numbers": {
    testCases: [
      { input: "2 4 3\n5 6 4", expected: "7 0 8", hidden: false },
      { input: "0\n0", expected: "0", hidden: true },
    ],
  },
};

/* ================= HELPERS ================= */

const normalize = (str) =>
  (str || "").toString().trim().replace(/\s+/g, " ");

/* ================= RUN CODE ================= */

async function runCode({ code, input = "", language = "cpp" }) {
  if (!code) {
    const err = new Error("No code provided");
    err.status = 400;
    throw err;
  }

  const executor = executors[language];
  if (!executor) {
    const err = new Error(`Unsupported language: ${language}`);
    err.status = 400;
    throw err;
  }

  const output = await executor(code, input);

  return { success: true, output };
}

/* ================= SUBMIT CODE ================= */

async function submitCode({ code, problem, language = "cpp", userId }) {
  if (!code || !problem) {
    const err = new Error("Code and problem are required");
    err.status = 400;
    throw err;
  }

  const now = new Date();

  if (now < CONTEST.startTime) {
    const err = new Error("Contest has not started yet");
    err.status = 403;
    throw err;
  }

  if (now > CONTEST.endTime) {
    const err = new Error("Contest is over. Submissions are closed");
    err.status = 403;
    throw err;
  }

  const executor = executors[language];
  if (!executor) {
    const err = new Error(`Unsupported language: ${language}`);
    err.status = 400;
    throw err;
  }

  const prob = problems[problem];
  if (!prob) {
    const err = new Error("Invalid problem");
    err.status = 400;
    throw err;
  }

  let passedCount = 0;
  const results = [];

  for (let i = 0; i < prob.testCases.length; i++) {
    const test = prob.testCases[i];

    try {
      const rawOutput = await executor(code, test.input);

      const actual = normalize(rawOutput);
      const expected = normalize(test.expected);

      const passed = actual === expected;

      if (passed) passedCount++;

      results.push({
        testCase: i + 1,
        status: passed ? "Passed" : "Failed",
        ...(test.hidden
          ? {}
          : {
              input: test.input,
              expected: test.expected,
              received: actual,
            }),
      });
    } catch (err) {
      results.push({
        testCase: i + 1,
        status: "Error",
        message: err.message,
      });
    }
  }

  const total = prob.testCases.length;
  const score = Math.round((passedCount / total) * 100);
  const finalStatus = passedCount === total ? "Accepted" : "Failed";

  if (userId) {
    const existing = await Submission.findOne({
      userId,
      problemId: problem,
    });

    if (!existing) {
      await Submission.create({
        userId,
        problemId: problem,
        status: finalStatus,
        score,
        language,
      });
    } else if (score > existing.score) {
      existing.score = score;
      existing.status = finalStatus;
      existing.language = language;
      existing.createdAt = new Date();
      await existing.save();
    }
  }

  if (userId) {
    const user = await User.findById(userId);

    const alreadySolved = user.contestSolved.find(
      (p) => p.problemId === problem
    );

    if (!alreadySolved) {
      user.contestSolved.push({ problemId: problem, score });
      user.contestScore += score;
    } else if (score > alreadySolved.score) {
      user.contestScore += score - alreadySolved.score;
      alreadySolved.score = score;
    }

    await user.save();
  }

  return {
    success: true,
    total,
    passed: passedCount,
    score,
    finalStatus,
    results,
  };
}

/* ================= USER SUBMISSIONS ================= */

async function getUserSubmissions(userId) {
  if (!userId) {
    const err = new Error("User not authenticated");
    err.status = 401;
    throw err;
  }

  const submissions = await Submission.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return { success: true, submissions };
}

/* ================= LEADERBOARD ================= */

async function getLeaderboard(problem) {
  if (!problem) {
    const err = new Error("Problem required");
    err.status = 400;
    throw err;
  }

  const now = new Date();

  /* 🔒 FREEZE DURING CONTEST */
  if (now < CONTEST.endTime) {
    return {
      success: true,
      frozen: true,
      message: "Leaderboard will be revealed after contest ends",
    };
  }

  const leaderboard = await Submission.find({ problemId: problem })
    .sort({ score: -1 })
    .limit(10)
    .populate("userId", "email")
    .lean();

  return { success: true, frozen: false, leaderboard };
}

/* ================= CONTEST LEADERBOARD ================= */

async function getContestLeaderboard() {
  const now = new Date();

  /* 🔒 FREEZE DURING CONTEST */
  if (now < CONTEST.endTime) {
    return {
      success: true,
      frozen: true,
      message: "Contest leaderboard is frozen",
    };
  }

  const users = await User.find({})
    .sort({ contestScore: -1 })
    .select("email contestScore contestSolved")
    .lean();

  return { success: true, frozen: false, leaderboard: users };
}

module.exports = {
  runCode,
  submitCode,
  getUserSubmissions,
  getLeaderboard,
  getContestLeaderboard,
};
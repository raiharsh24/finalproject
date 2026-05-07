const executeCpp = require("../compiler/executeCpp");
const executePython = require("../compiler/executePython");
const executeNode = require("../compiler/executeNode");
const executeJava = require("../compiler/executeJava");

const Submission = require("../models/Submission");
const User = require("../models/User");
const Problem = require("../models/Problem");

/* ================= EXECUTORS ================= */

const executors = {
  cpp: executeCpp,
  python: executePython,
  javascript: executeNode,
  java: executeJava,
};

/* ================= CONTEST CONFIG ================= */

const CONTEST = {
  startTime: new Date("2026-05-05T17:30:00"),
  endTime: new Date("2026-05-05T18:30:00"),
};

/* ================= HELPERS ================= */

const normalize = (str) =>
  (str || "")
    .toString()
    .trim()
    .replace(/\s+/g, " ");

/* ================= RUN CODE ================= */

async function runCode({
  code,
  input = "",
  language = "cpp",
}) {
  if (!code) {
    const err = new Error(
      "No code provided"
    );

    err.status = 400;

    throw err;
  }

  const executor = executors[language];

  if (!executor) {
    const err = new Error(
      `Unsupported language: ${language}`
    );

    err.status = 400;

    throw err;
  }

  const output = await executor(
    code,
    input
  );

  return {
    success: true,
    output,
  };
}

/* ================= SUBMIT CODE ================= */

async function submitCode({
  code,
  problem,
  language = "cpp",
  userId,
}) {
  if (!code || !problem) {
    const err = new Error(
      "Code and problem are required"
    );

    err.status = 400;

    throw err;
  }

  const now = new Date();

  if (now < CONTEST.startTime) {
    const err = new Error(
      "Contest has not started yet"
    );

    err.status = 403;

    throw err;
  }

  if (now > CONTEST.endTime) {
    const err = new Error(
      "Contest is over. Submissions are closed"
    );

    err.status = 403;

    throw err;
  }

  const executor = executors[language];

  if (!executor) {
    const err = new Error(
      `Unsupported language: ${language}`
    );

    err.status = 400;

    throw err;
  }

  /* ================= FETCH PROBLEM ================= */

  let dbProblem = null;

  try {
    dbProblem = await Problem.findOne({
      title: problem,
    });
  } catch {
    dbProblem = null;
  }

  if (!dbProblem) {
    const err = new Error(
      "Problem not found"
    );

    err.status = 404;

    throw err;
  }

  /* ================= BUILD TEST CASES ================= */

  let testCases = [];

  /* Hidden Judge Cases */

  if (
    dbProblem.hiddenTestCases &&
    dbProblem.hiddenTestCases.length > 0
  ) {
    testCases =
      dbProblem.hiddenTestCases.map(
        (t) => ({
          input: t.input,
          expected: t.output,
          hidden: true,
        })
      );
  }

  /* Fallback Test Cases */

  if (
    testCases.length === 0 &&
    dbProblem.testCases &&
    dbProblem.testCases.length > 0
  ) {
    testCases = dbProblem.testCases.map(
      (t) => ({
        input: t.input,
        expected: t.expected,
        hidden: false,
      })
    );
  }

  if (testCases.length === 0) {
    return {
      success: false,
      message:
        "No test cases found for this problem",
    };
  }

  /* ================= EXECUTE ================= */

  let passedCount = 0;

  const results = [];

  for (
    let i = 0;
    i < testCases.length;
    i++
  ) {
    const test = testCases[i];

    try {
      const rawOutput =
        await executor(
          code,
          test.input
        );

      const actual =
        normalize(rawOutput);

      const expected =
        normalize(test.expected);

      const passed =
        actual === expected;

      if (passed) {
        passedCount++;
      }

      results.push({
        testCase: i + 1,

        status: passed
          ? "Passed"
          : "Failed",

        ...(test.hidden
          ? {}
          : {
              input: test.input,
              expected:
                test.expected,
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

  /* ================= FINAL SCORE ================= */

  const total =
    testCases.length;

  const score = Math.round(
    (passedCount / total) * 100
  );

  const finalStatus =
    passedCount === total
      ? "Accepted"
      : "Failed";

  /* ================= UPDATE PROBLEM ANALYTICS ================= */

  dbProblem.submissions += 1;

  if (finalStatus === "Accepted") {
    dbProblem.acceptedSubmissions += 1;
  }

  dbProblem.acceptance = `${Math.round(
    (dbProblem.acceptedSubmissions /
      dbProblem.submissions) *
      100
  )}%`;

  await dbProblem.save();

  /* ================= SAVE SUBMISSION ================= */

  if (userId) {
    const existing =
      await Submission.findOne({
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
    } else if (
      score > existing.score
    ) {
      existing.score = score;

      existing.status =
        finalStatus;

      existing.language =
        language;

      existing.createdAt =
        new Date();

      await existing.save();
    }
  }

  /* ================= UPDATE USER SCORE ================= */

  if (userId) {
    const user =
      await User.findById(userId);

    if (user) {
      const alreadySolved =
        user.contestSolved.find(
          (p) =>
            p.problemId ===
            problem
        );

      if (!alreadySolved) {
        user.contestSolved.push({
          problemId: problem,
          score,
        });

        user.contestScore +=
          score;
      } else if (
        score > alreadySolved.score
      ) {
        user.contestScore +=
          score -
          alreadySolved.score;

        alreadySolved.score =
          score;
      }

      await user.save();
    }
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

async function getUserSubmissions(
  userId
) {
  if (!userId) {
    const err = new Error(
      "User not authenticated"
    );

    err.status = 401;

    throw err;
  }

  const submissions =
    await Submission.find({
      userId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

  return {
    success: true,
    submissions,
  };
}

/* ================= LEADERBOARD ================= */

async function getLeaderboard(
  problem
) {
  if (!problem) {
    const err = new Error(
      "Problem required"
    );

    err.status = 400;

    throw err;
  }

  const now = new Date();

  if (now < CONTEST.endTime) {
    return {
      success: true,
      frozen: true,
      message:
        "Leaderboard will be revealed after contest ends",
    };
  }

  const leaderboard =
    await Submission.find({
      problemId: problem,
    })
      .sort({ score: -1 })
      .limit(10)
      .populate(
        "userId",
        "email"
      )
      .lean();

  return {
    success: true,
    frozen: false,
    leaderboard,
  };
}

/* ================= CONTEST LEADERBOARD ================= */

async function getContestLeaderboard() {
  const now = new Date();

  if (now < CONTEST.endTime) {
    return {
      success: true,
      frozen: true,
      message:
        "Contest leaderboard is frozen",
    };
  }

  const users =
    await User.find({})
      .sort({
        contestScore: -1,
      })
      .select(
        "email contestScore contestSolved"
      )
      .lean();

  return {
    success: true,
    frozen: false,
    leaderboard: users,
  };
}

module.exports = {
  runCode,
  submitCode,
  getUserSubmissions,
  getLeaderboard,
  getContestLeaderboard,
};
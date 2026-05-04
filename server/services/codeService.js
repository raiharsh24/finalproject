// Code Service Layer
// Encapsulates business logic for running and submitting code.

const executeCpp = require("../compiler/executeCpp");
const executePython = require("../compiler/executePython");
const executeNode = require("../compiler/executeNode");
const executeJava = require("../compiler/executeJava");
const Submission = require("../models/Submission");

// Cache executor map to avoid rebuilding on each call
const executors = {
  cpp: executeCpp,
  python: executePython,
  javascript: executeNode,
  java: executeJava,
};

/** Run code for a given language */
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

/** Submit code against predefined test cases */
async function submitCode({ code, problemId = "default", language = "cpp", userId }) {
  if (!code) {
    const err = new Error("No code submitted");
    err.status = 400;
    throw err;
  }
  const testCases = [
    { input: "2 7 11 15\n9", expected: "0 1" },
    { input: "3 2 4\n6", expected: "1 2" },
  ];

  const executor = executors[language];
  if (!executor) {
    const err = new Error(`Unsupported language: ${language}`);
    err.status = 400;
    throw err;
  }

  const results = await Promise.all(
    testCases.map(async (test, index) => {
      try {
        const output = await executor(code, test.input);
        const passed = output.trim() === test.expected;
        return passed
          ? { testCase: index + 1, status: "Passed" }
          : {
              testCase: index + 1,
              status: "Failed",
              expected: test.expected,
              received: output.trim(),
            };
      } catch (err) {
        return { testCase: index + 1, status: "Error", message: err.message };
      }
    })
  );

  const allPassed = results.every((r) => r.status === "Passed");

  if (userId) {
    await Submission.create({
      userId,
      problemId,
      status: allPassed ? "Passed" : "Failed",
    });
  }

  return { success: true, results, finalStatus: allPassed ? "Passed" : "Failed" };
}

module.exports = {
  runCode,
  submitCode,
};

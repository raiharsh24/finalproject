import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";

/* ================= CONTEST CONFIG ================= */

const CONTEST = {
  startTime: new Date("2026-05-05T17:30:00"),
  endTime: new Date("2026-05-05T18:30:00"),
};

/* ================= PROBLEM DATA ================= */

const problems = {
  "Two Sum": {
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",

    example:
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",

    starterCode:
      "// Two Sum\n// Return indices of two numbers\n",

    input:
      "2 7 11 15\n9",

    testCases: [
      {
        input: "2 7 11 15\n9",
        expected: "[0,1]",
      },
      {
        input: "3 2 4\n6",
        expected: "[1,2]",
      },
    ],
  },

  "Add Two Numbers": {
    description:
      "You are given two non-empty linked lists representing two non-negative integers.",

    example:
      "Input: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]",

    starterCode:
      "// Add Two Numbers\n",

    input:
      "2 4 3\n5 6 4",

    testCases: [
      {
        input: "2 4 3\n5 6 4",
        expected: "[7,0,8]",
      },
    ],
  },
};

export default function MainApp({
  role,
  onBack,
  selectedProblem,
}) {

  const [currentProblem,
    setCurrentProblem] =
    useState(null);

  const [code,
    setCode] =
    useState("// Write C++ code");

  const [output,
    setOutput] =
    useState("");

  const [input,
    setInput] =
    useState("");

  const [language,
    setLanguage] =
    useState("cpp");

  const [results,
    setResults] =
    useState([]);

  const [submission,
    setSubmission] =
    useState(null);

  /* ================= CONTEST STATE ================= */

  const [timeLeft,
    setTimeLeft] =
    useState(0);

  const [status,
    setStatus] =
    useState("loading");

  useEffect(() => {

    const updateTimer = () => {

      const now = new Date();

      if (now < CONTEST.startTime) {

        setStatus("not-started");

        setTimeLeft(
          Math.floor(
            (CONTEST.startTime - now) / 1000
          )
        );

      } else if (now > CONTEST.endTime) {

        setStatus("ended");

        setTimeLeft(0);

      } else {

        setStatus("running");

        setTimeLeft(
          Math.floor(
            (CONTEST.endTime - now) / 1000
          )
        );
      }
    };

    updateTimer();

    const interval =
      setInterval(updateTimer, 1000);

    return () =>
      clearInterval(interval);

  }, []);

  const formatTime = () => {

    const min =
      Math.floor(timeLeft / 60);

    const sec =
      timeLeft % 60;

    return `${min}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const isLocked =
    status !== "running";

  useEffect(() => {

    if (selectedProblem) {

      setCurrentProblem(selectedProblem);

      const prob =
        problems[selectedProblem];

      if (prob) {

        setCode(prob.starterCode);

        setInput(prob.input);
      }
    }

  }, [selectedProblem]);

  /* ================= RUN CODE ================= */

  const runCode = async () => {

    if (isLocked) return;

    try {

      const res = await fetch(
        "http://localhost:5000/api/code/run",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            code,
            input,
            language,
          }),
        }
      );

      const data =
        await res.json();

      setOutput(
        data.output || "No output"
      );

    } catch {

      setOutput(
        "Error running code"
      );
    }
  };

  /* ================= RUN TESTS ================= */

  const runTests = async () => {

    if (
      !currentProblem ||
      isLocked
    )
      return;

    const testCases =
      problems[currentProblem]
        .testCases;

    const resultsArr = [];

    for (let test of testCases) {

      try {

        const res = await fetch(
          "http://localhost:5000/api/code/run",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              code,
              input: test.input,
              language,
            }),
          }
        );

        const data =
          await res.json();

        const actual =
          (data.output || "").trim();

        const passed =
          actual === test.expected;

        resultsArr.push({
          input: test.input,
          expected: test.expected,
          actual,
          passed,
        });

      } catch {

        resultsArr.push({
          input: test.input,
          expected: test.expected,
          actual: "Error",
          passed: false,
        });
      }
    }

    setResults(resultsArr);
  };

  /* ================= SUBMIT CODE ================= */

  const submitCode = async () => {

    if (
      !currentProblem ||
      isLocked
    )
      return;

    try {

      const res = await fetch(
        "http://localhost:5000/api/code/submit",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            code,
            language,
            problem:
              currentProblem,
          }),
        }
      );

      const data =
        await res.json();

      setSubmission(data);

    } catch {

      setSubmission({
        finalStatus: "Error",
        score: 0,
        passed: 0,
        total: 0,
      });
    }
  };

  return (

    <div style={styles.container}>

      {/* TOP BAR */}

      <div style={styles.backBar}>

        <button
          onClick={onBack}
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>

        <div
          style={{
            fontWeight: "700",
            fontSize: "16px",
          }}
        >

          {status === "not-started" &&
            `⏳ Starts in: ${formatTime()}`}

          {status === "running" &&
            `🔥 Ends in: ${formatTime()}`}

          {status === "ended" &&
            `❌ Contest Ended`}

        </div>

      </div>

      {/* SIDEBAR */}

      <div style={styles.sidebar}>

        <h2
          style={{
            marginBottom: "20px",
            fontSize: "24px",
            fontWeight: "800",
          }}
        >
          Problems
        </h2>

        {Object.keys(problems).map((p) => (

          <div
            key={p}
            style={{
              ...styles.problem,

              background:
                currentProblem === p
                  ? "linear-gradient(135deg,#7c3aed,#d946ef)"
                  : styles.problem.background,

              opacity:
                isLocked ? 0.6 : 1,
            }}

            onClick={() => {

              if (isLocked)
                return;

              setCurrentProblem(p);

              setCode(
                problems[p]
                  .starterCode
              );

              setInput(
                problems[p].input
              );

              setResults([]);

              setSubmission(null);
            }}
          >
            {p}
          </div>

        ))}

      </div>

      {/* MAIN */}

      <div style={styles.main}>

        {/* TOPBAR */}

        <div style={styles.topbar}>

          <span>

            {currentProblem
              ? `Problem: ${currentProblem}`
              : "Select a Problem"}

          </span>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(
                e.target.value
              )
            }
            style={styles.select}
            disabled={isLocked}
          >

            <option value="cpp">
              C++
            </option>

            <option value="java">
              Java
            </option>

          </select>

        </div>

        {/* EDITOR */}

        <div style={styles.editor}>

          <Editor
height="100%"
width="100%"
language={language}
theme="vs-dark"
value={code}
onChange={(value) =>
setCode(value || "")
}
options={{
readOnly: false,
fontSize: 16,
minimap: {
enabled: false,
},
wordWrap: "on",
scrollBeyondLastLine: false,
automaticLayout: true,
cursorBlinking: "smooth",
smoothScrolling: true,
padding: {
top: 18,
},
}}
/>


        </div>

        {/* OUTPUT */}

        <div style={styles.output}>

          <h3
            style={{
              marginBottom: "12px",
            }}
          >
            Output
          </h3>

          <pre>
            {output}
          </pre>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div style={styles.right}>

        {currentProblem && (
          <>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: "900",
              }}
            >
              {currentProblem}
            </h2>

            <div style={styles.desc}>

              <h3>Description</h3>

              <p>
                {
                  problems[
                    currentProblem
                  ].description
                }
              </p>

            </div>

            <div style={styles.example}>

              <h3>Example</h3>

              <pre>
                {
                  problems[
                    currentProblem
                  ].example
                }
              </pre>

            </div>

          </>
        )}

        {/* INPUT */}

        <div>

          <h3
            style={{
              marginBottom: "10px",
            }}
          >
            Input
          </h3>

          <textarea
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            style={styles.textarea}
            disabled={isLocked}
          />

        </div>

        {/* BUTTONS */}

        <div style={styles.buttons}>

          <button
            onClick={runCode}
            style={
              styles.buttonPrimary
            }
            disabled={isLocked}
          >
            Run
          </button>

          <button
            onClick={runTests}
            style={
              styles.buttonSecondary
            }
            disabled={isLocked}
          >
            Run Tests
          </button>

          <button
            onClick={submitCode}
            style={
              styles.buttonPrimary
            }
            disabled={isLocked}
          >
            Submit
          </button>

        </div>

        {/* TEST RESULTS */}

        {results.length > 0 && (

          <div style={styles.testResults}>

            <h3>
              Test Results
            </h3>

            {results.map((r, i) => (

              <div
                key={i}
                style={{
                  padding: "14px",
                  marginTop: "12px",
                  borderRadius: "16px",

                  background:
                    r.passed
                      ? "rgba(16,185,129,0.2)"
                      : "rgba(239,68,68,0.2)",

                  border:
                    r.passed
                      ? "1px solid rgba(16,185,129,0.4)"
                      : "1px solid rgba(239,68,68,0.4)",
                }}
              >

                <strong>
                  Test {i + 1}
                </strong>

                <br />

                {r.passed
                  ? "✅ Passed"
                  : "❌ Failed"}

                <br />

                Expected:
                {" "}
                {r.expected}

                <br />

                Got:
                {" "}
                {r.actual}

              </div>

            ))}

          </div>

        )}

        {/* SUBMISSION */}

        {submission && (

          <div style={styles.testResults}>

            <h3>
              Submission Result
            </h3>

            <div>
              Status:
              {" "}
              <b>
                {
                  submission.finalStatus
                }
              </b>
            </div>

            <div>
              Score:
              {" "}
              {submission.score}%
            </div>

            <div>
              Passed:
              {" "}
              {submission.passed}/
              {submission.total}
            </div>

          </div>

        )}

      </div>

    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns:
      "260px 1fr 360px",
    gridTemplateRows:
      "70px 1fr",
    height: "100vh",

    background:
      "linear-gradient(to bottom right, #0b1120, #111827)",

    color: "#fff",

    gap: "18px",

    padding: "18px",

    overflow: "hidden",
  },

  backBar: {
    gridColumn: "1 / -1",

    display: "flex",

    alignItems: "center",

    justifyContent:
      "space-between",

    background:
      "rgba(17,24,39,0.9)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "24px",

    padding: "16px 24px",

    backdropFilter:
      "blur(16px)",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.35)",
  },

  backButton: {
    padding: "12px 18px",

    borderRadius: "16px",

    background:
      "linear-gradient(135deg,#7c3aed,#d946ef)",

    border: "none",

    color: "#fff",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: "14px",

    transition: "0.25s",
  },

  sidebar: {
    background:
      "rgba(17,24,39,0.9)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "30px",

    padding: "24px",

    overflowY: "auto",

    backdropFilter:
      "blur(16px)",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.35)",
  },

  problem: {
    padding: "16px",

    marginTop: "10px",

    background:
      "rgba(255,255,255,0.05)",

    borderRadius: "18px",

    cursor: "pointer",

    transition:
      "all 0.25s ease",

    border:
      "1px solid rgba(255,255,255,0.05)",

    fontWeight: "600",
  },

  main: {
    display: "grid",

    gridTemplateRows:
      "70px 1fr 220px",

    gap: "14px",
  },

  topbar: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    background:
      "rgba(17,24,39,0.9)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "24px",

    padding: "0 24px",

    backdropFilter:
      "blur(16px)",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.35)",

    fontWeight: "700",

    fontSize: "18px",
  },

  select: {
    padding: "10px 14px",

    borderRadius: "14px",

    background: "#0f172a",

    color: "#fff",

    border:
      "1px solid rgba(255,255,255,0.1)",

    outline: "none",

    fontWeight: "600",
  },

  editor: {
    borderRadius: "28px",

    overflow: "hidden",

    border:
      "1px solid rgba(255,255,255,0.08)",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.35)",
  },

  output: {
    background:
      "rgba(17,24,39,0.9)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "28px",

    padding: "20px",

    overflowY: "auto",

    backdropFilter:
      "blur(16px)",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.35)",
  },

  right: {
    background:
      "rgba(17,24,39,0.9)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "30px",

    padding: "24px",

    display: "flex",

    flexDirection: "column",

    gap: "18px",

    overflowY: "auto",

    backdropFilter:
      "blur(16px)",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.35)",
  },

  desc: {
    background:
      "rgba(255,255,255,0.04)",

    borderRadius: "22px",

    padding: "18px",

    border:
      "1px solid rgba(255,255,255,0.06)",

    lineHeight: "1.7",
  },

  example: {
    background:
      "rgba(255,255,255,0.04)",

    borderRadius: "22px",

    padding: "18px",

    border:
      "1px solid rgba(255,255,255,0.06)",
  },

  textarea: {
    background: "#020617",

    color: "#fff",

    padding: "16px",

    borderRadius: "18px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    minHeight: "120px",

    outline: "none",

    resize: "none",

    fontSize: "14px",
  },

  buttons: {
    display: "grid",

    gridTemplateColumns:
      "repeat(3,1fr)",

    gap: "12px",
  },

  buttonPrimary: {
    background:
      "linear-gradient(135deg,#7c3aed,#d946ef)",

    padding: "14px",

    border: "none",

    borderRadius: "16px",

    color: "#fff",

    fontWeight: "700",

    cursor: "pointer",

    transition: "0.25s",

    boxShadow:
      "0 10px 30px rgba(124,58,237,0.35)",
  },

  buttonSecondary: {
    background:
      "rgba(255,255,255,0.08)",

    padding: "14px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "16px",

    color: "#fff",

    fontWeight: "700",

    cursor: "pointer",
  },

  testResults: {
    marginTop: "10px",

    background:
      "rgba(255,255,255,0.04)",

    borderRadius: "22px",

    padding: "18px",

    border:
      "1px solid rgba(255,255,255,0.08)",
  },
};
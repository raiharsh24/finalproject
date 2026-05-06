import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";

/* ================= CONTEST CONFIG (MATCH BACKEND) ================= */
const CONTEST = {
  startTime: new Date("2026-05-05T17:30:00"),
  endTime: new Date("2026-05-05T18:30:00"),
};

/* ✅ PROBLEM DATA WITH TEST CASES */
const problems = {
  "Two Sum": {
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
    starterCode: "// Two Sum\n// Return indices of two numbers\n",
    input: "2 7 11 15\n9",
    testCases: [
      { input: "2 7 11 15\n9", expected: "[0,1]" },
      { input: "3 2 4\n6", expected: "[1,2]" },
    ],
  },

  "Add Two Numbers": {
    description:
      "You are given two non-empty linked lists representing two non-negative integers.",
    example: "Input: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]",
    starterCode: "// Add Two Numbers\n",
    input: "2 4 3\n5 6 4",
    testCases: [
      { input: "2 4 3\n5 6 4", expected: "[7,0,8]" },
    ],
  },
};

export default function MainApp({ role, onBack, selectedProblem }) {
  const [currentProblem, setCurrentProblem] = useState(null);

  const [code, setCode] = useState("// Write C++ code");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("cpp");

  const [results, setResults] = useState([]);
  const [submission, setSubmission] = useState(null);

  /* ================= NEW: CONTEST STATE ================= */
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();

      if (now < CONTEST.startTime) {
        setStatus("not-started");
        setTimeLeft(Math.floor((CONTEST.startTime - now) / 1000));
      } else if (now > CONTEST.endTime) {
        setStatus("ended");
        setTimeLeft(0);
      } else {
        setStatus("running");
        setTimeLeft(Math.floor((CONTEST.endTime - now) / 1000));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const isLocked = status !== "running";

  useEffect(() => {
    if (selectedProblem) {
      setCurrentProblem(selectedProblem);

      const prob = problems[selectedProblem];
      if (prob) {
        setCode(prob.starterCode);
        setInput(prob.input);
      }
    }
  }, [selectedProblem]);

  const runCode = async () => {
    if (isLocked) return;

    try {
      const res = await fetch("http://localhost:5000/api/code/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, input, language }),
      });

      const data = await res.json();
      setOutput(data.output || "No output");
    } catch {
      setOutput("Error running code");
    }
  };

  const runTests = async () => {
    if (!currentProblem || isLocked) return;

    const testCases = problems[currentProblem].testCases;
    const resultsArr = [];

    for (let test of testCases) {
      try {
        const res = await fetch("http://localhost:5000/api/code/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            input: test.input,
            language,
          }),
        });

        const data = await res.json();
        const actual = (data.output || "").trim();

        const passed = actual === test.expected;

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

  const submitCode = async () => {
    if (!currentProblem || isLocked) return;

    try {
      const res = await fetch("http://localhost:5000/api/code/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          problem: currentProblem,
        }),
      });

      const data = await res.json();
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
      <div style={styles.backBar}>
        <button onClick={onBack} style={styles.backButton}>
          ← Back to Dashboard
        </button>

        {/* ✅ NEW: CONTEST STATUS */}
        <span style={{ marginLeft: "20px" }}>
          {status === "not-started" && `⏳ Starts in: ${formatTime()}`}
          {status === "running" && `🔥 Ends in: ${formatTime()}`}
          {status === "ended" && `❌ Contest Ended`}
        </span>
      </div>

      <div style={styles.sidebar}>
        <h3>Problems</h3>
        {Object.keys(problems).map((p) => (
          <div
            key={p}
            style={{
              ...styles.problem,
              background:
                currentProblem === p ? "#6366f1" : styles.problem.background,
              opacity: isLocked ? 0.5 : 1,
            }}
            onClick={() => {
              if (isLocked) return;

              setCurrentProblem(p);
              setCode(problems[p].starterCode);
              setInput(problems[p].input);
              setResults([]);
              setSubmission(null);
            }}
          >
            {p}
          </div>
        ))}
      </div>

      <div style={styles.main}>
        <div style={styles.topbar}>
          <span>
            {currentProblem
              ? `Problem: ${currentProblem}`
              : "Select a Problem"}
          </span>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.select}
            disabled={isLocked}
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div style={styles.editor}>
          <Editor
            height="100%"
            width="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{ readOnly: isLocked }}
          />
        </div>

        <div style={styles.output}>
          <h4>Output</h4>
          <pre>{output}</pre>
        </div>
      </div>

      <div style={styles.right}>
        {currentProblem && (
          <>
            <h3>{currentProblem}</h3>

            <div style={styles.desc}>
              <h4>Description</h4>
              <p>{problems[currentProblem].description}</p>
            </div>

            <div style={styles.example}>
              <h4>Example</h4>
              <pre>{problems[currentProblem].example}</pre>
            </div>
          </>
        )}

        <h3>Input</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.textarea}
          disabled={isLocked}
        />

        <div style={styles.buttons}>
          <button onClick={runCode} style={styles.buttonPrimary} disabled={isLocked}>
            Run
          </button>

          <button onClick={runTests} style={styles.buttonSecondary} disabled={isLocked}>
            Run Tests
          </button>

          <button onClick={submitCode} style={styles.buttonPrimary} disabled={isLocked}>
            Submit
          </button>
        </div>

        {results.length > 0 && (
          <div style={styles.testResults}>
            <h4>Test Results</h4>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "8px",
                  marginTop: "6px",
                  borderRadius: "6px",
                  background: r.passed ? "#065f46" : "#7f1d1d",
                }}
              >
                <strong>Test {i + 1}:</strong>{" "}
                {r.passed ? "✅ Passed" : "❌ Failed"}
                <br />
                Expected: {r.expected}
                <br />
                Got: {r.actual}
              </div>
            ))}
          </div>
        )}

        {submission && (
          <div style={styles.testResults}>
            <h4>Submission Result</h4>
            <div>
              Status: <b>{submission.finalStatus}</b>
            </div>
            <div>Score: {submission.score}%</div>
            <div>
              Passed: {submission.passed}/{submission.total}
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
    gridTemplateColumns: "220px 1fr 320px",
    height: "100vh",
    background: "rgba(15,23,42,0.85)",
    color: "#fff",
    gap: "12px",
    padding: "12px",
  },

  backBar: {
    gridColumn: "1 / -1",
    padding: "10px",
    background: "#0f172a",
  },

  backButton: {
    padding: "8px 12px",
    background: "#6366f1",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },

  sidebar: { background: "#1e293b", padding: "10px" },

  problem: {
    padding: "10px",
    marginTop: "6px",
    background: "#334155",
    cursor: "pointer",
  },

  main: { display: "grid", gridTemplateRows: "60px 1fr 180px" },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
  },

  select: { padding: "6px" },

  editor: { background: "#020617" },

  output: { background: "#020617", padding: "10px" },

  right: {
    background: "#1e293b",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  desc: { background: "#020617", padding: "8px" },

  example: { background: "#020617", padding: "8px" },

  textarea: {
    background: "#020617",
    color: "#fff",
    padding: "8px",
  },

  buttons: { display: "flex", gap: "8px" },

  buttonPrimary: { background: "#6366f1", padding: "8px", border: "none" },

  buttonSecondary: { background: "#334155", padding: "8px", border: "none" },

  testResults: {
    marginTop: "10px",
    background: "#020617",
    padding: "10px",
  },
};
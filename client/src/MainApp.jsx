import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { askAI } from "./aiHelper";

/* ================= API ================= */

const API =
  "http://localhost:5000/api/problems";

/* ================= CONTEST CONFIG ================= */

const CONTEST = {
  startTime: new Date("2026-05-05T17:30:00"),
  endTime: new Date("2026-05-05T18:30:00"),
};

/* ================= FALLBACK ================= */

const fallbackProblem = {
  _id: "fallback",

  title: "Demo Problem",

  description:
    "Backend problems failed to load.",

  starterCode: `#include <bits/stdc++.h>
using namespace std;

int main() {

    return 0;
}`,

  sampleIO: [
    {
      input: "2 3",
      output: "5",
    },
  ],
};

export default function MainApp({
  onBack,
  selectedProblem,
}) {
  /* ================= PROBLEMS ================= */

  const [problems, setProblems] =
    useState([]);

  const [currentProblem, setCurrentProblem] =
    useState(null);

  const [loadingProblems, setLoadingProblems] =
    useState(true);

  /* ================= EDITOR ================= */

  const [code, setCode] =
    useState("");

  const [output, setOutput] =
    useState("No output");

  const [input, setInput] =
    useState("");

  const [language, setLanguage] =
    useState("cpp");

  /* ================= AI ================= */

  const [aiOpen, setAiOpen] =
    useState(false);

  const [aiLoading, setAiLoading] =
    useState(false);

  const [aiResponse, setAiResponse] =
    useState(
      "Ask CodeArena AI for coding help."
    );

  /* ================= SUBMISSION ================= */

  const [submitting, setSubmitting] =
    useState(false);

  const [submissionResult, setSubmissionResult] =
    useState(null);

  /* ================= TIMER ================= */

  const [timeLeft, setTimeLeft] =
    useState(0);

  const [status, setStatus] =
    useState("running");

  /* ================= FETCH PROBLEMS ================= */

  useEffect(() => {
    const fetchProblems =
      async () => {
        try {
          setLoadingProblems(true);

          const res =
            await axios.get(API);

          const fetched =
            res.data.data || [];

          if (fetched.length === 0) {
            setProblems([
              fallbackProblem,
            ]);

            setCurrentProblem(
              fallbackProblem
            );

            return;
          }

          setProblems(fetched);

          const selected =
            fetched.find(
              (p) =>
                p.title ===
                selectedProblem
            ) || fetched[0];

          setCurrentProblem(selected);
        } catch (err) {
          console.error(err);

          setProblems([
            fallbackProblem,
          ]);

          setCurrentProblem(
            fallbackProblem
          );
        } finally {
          setLoadingProblems(false);
        }
      };

    fetchProblems();
  }, [selectedProblem]);

  /* ================= LOAD PROBLEM ================= */

  useEffect(() => {
    if (!currentProblem) return;

    setCode(
      currentProblem.starterCode ||
        fallbackProblem.starterCode
    );

    setInput(
      currentProblem.sampleIO?.[0]
        ?.input || ""
    );
  }, [currentProblem]);

  /* ================= TIMER ================= */

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();

      if (now > CONTEST.endTime) {
        setStatus("ended");

        setTimeLeft(0);
      } else {
        setStatus("running");

        setTimeLeft(
          Math.floor(
            (CONTEST.endTime -
              now) /
              1000
          )
        );
      }
    };

    updateTimer();

    const interval =
      setInterval(
        updateTimer,
        1000
      );

    return () =>
      clearInterval(interval);
  }, []);

  const formatTime = () => {
    const min =
      Math.floor(timeLeft / 60);

    const sec = timeLeft % 60;

    return `${min}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  /* ================= RUN ================= */

  const runCode = async () => {
    try {
      const res =
        await fetch(
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
        data.output ||
          "No output"
      );
    } catch {
      setOutput(
        "Error running code"
      );
    }
  };

  /* ================= SUBMIT ================= */

  const submitCode = async () => {
    try {
      setSubmitting(true);

      const res =
        await fetch(
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
                currentProblem.title,
            }),
          }
        );

      const data =
        await res.json();

      setSubmissionResult(data);

      if (
        data.finalStatus
      ) {
        setOutput(
          `${data.finalStatus}

Score: ${data.score || 0}%

Passed: ${data.passed || 0}/${data.total || 0}`
        );
      }
    } catch {
      setOutput(
        "Submission failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= AI ================= */

  const handleAI = async (
    action
  ) => {
    try {
      setAiOpen(true);

      setAiLoading(true);

      setAiResponse(
        "Thinking..."
      );

      const response =
        await askAI({
          code,
          problem:
            currentProblem.title,
          action,
          output,
        });

      setAiResponse(response);
    } catch {
      setAiResponse(
        "AI request failed."
      );
    } finally {
      setAiLoading(false);
    }
  };

  if (
    loadingProblems &&
    !currentProblem
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "#020617",
          color: "#fff",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
        }}
      >
        Loading Problems...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}

      <div style={styles.header}>
        <button
          onClick={onBack}
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>

        <div style={styles.timer}>
          {status === "running"
            ? `🔥 Ends in: ${formatTime()}`
            : "❌ Contest Ended"}
        </div>
      </div>

      {/* BODY */}

      <div style={styles.body}>
        {/* SIDEBAR */}

        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>
            Problems
          </h2>

          {problems.map(
            (problem) => (
              <div
                key={problem._id}
                onClick={() =>
                  setCurrentProblem(
                    problem
                  )
                }
                style={{
                  ...styles.problemItem,

                  background:
                    currentProblem?._id ===
                    problem._id
                      ? "linear-gradient(135deg,#7c3aed,#d946ef)"
                      : "rgba(255,255,255,0.05)",
                }}
              >
                {problem.title}
              </div>
            )
          )}
        </div>

        {/* CENTER */}

        <div style={styles.center}>
          <div style={styles.editorTop}>
            <div>
              Problem:
              {" "}
              {currentProblem.title}
            </div>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value
                )
              }
              style={styles.select}
            >
              <option value="cpp">
                C++
              </option>

              <option value="python">
                Python
              </option>

              <option value="java">
                Java
              </option>
            </select>
          </div>

          {/* EDITOR */}

          <div
            style={
              styles.editorContainer
            }
          >
            <Editor
              height="100%"
              language={
                language
              }
              theme="vs-dark"
              value={code}
              onChange={(
                value
              ) =>
                setCode(
                  value || ""
                )
              }
            />
          </div>

          {/* OUTPUT */}

          <div
            style={
              styles.outputCard
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom: "10px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                }}
              >
                Output
              </h3>

              <div
                style={{
                  background:
                    "rgba(124,58,237,0.18)",
                  color: "#c084fc",
                  padding:
                    "5px 10px",
                  borderRadius:
                    "999px",
                  fontSize:
                    "11px",
                  fontWeight:
                    "700",
                }}
              >
                Live
              </div>
            </div>

            <pre
              style={
                styles.outputText
              }
            >
              {output}
            </pre>
          </div>

          {/* SUBMISSION RESULT */}

          {submissionResult && (
            <div
              style={{
                background:
                  submissionResult.finalStatus ===
                  "Accepted"
                    ? "rgba(34,197,94,0.12)"
                    : "rgba(239,68,68,0.12)",

                border:
                  submissionResult.finalStatus ===
                  "Accepted"
                    ? "1px solid rgba(34,197,94,0.35)"
                    : "1px solid rgba(239,68,68,0.35)",

                borderRadius:
                  "20px",

                padding: "18px",
              }}
            >
              <h2>
                {submissionResult.finalStatus ===
                "Accepted"
                  ? "✅ Accepted"
                  : "❌ Failed"}
              </h2>

              <div>
                Score:
                {" "}
                {
                  submissionResult.score ||
                  0
                }
                %
              </div>

              <div>
                Passed:
                {" "}
                {
                  submissionResult.passed ||
                  0
                }
                /
                {
                  submissionResult.total ||
                  0
                }
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}

        <div style={styles.rightPanel}>
          <h1
            style={
              styles.problemTitle
            }
          >
            {
              currentProblem.title
            }
          </h1>

          <div style={styles.infoCard}>
            <h3>Description</h3>

            <p>
              {
                currentProblem.description
              }
            </p>
          </div>

          <div style={styles.infoCard}>
            <h3>Example</h3>

            <pre>
              Input:
              {"\n"}
              {
                currentProblem
                  .sampleIO?.[0]
                  ?.input
              }

              {"\n\n"}
              Output:
              {"\n"}
              {
                currentProblem
                  .sampleIO?.[0]
                  ?.output
              }
            </pre>
          </div>

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
            />
          </div>

          {/* BUTTONS */}

          <div style={styles.buttonRow}>
            <button
              style={
                styles.primaryButton
              }
              onClick={runCode}
            >
              Run
            </button>

            <button
              style={
                styles.secondaryButton
              }
              onClick={() =>
                setAiOpen(true)
              }
            >
              Open AI
            </button>

            <button
              style={{
                ...styles.primaryButton,

                opacity:
                  submitting
                    ? 0.7
                    : 1,
              }}
              onClick={
                submitCode
              }
            >
              {submitting
                ? "Submitting..."
                : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING AI */}

      <div
        style={{
          ...styles.aiFloating,

          height: aiOpen
            ? "430px"
            : "65px",
        }}
      >
        <div
          style={styles.aiTop}
          onClick={() =>
            setAiOpen(!aiOpen)
          }
        >
          <div>
            🤖 CodeArena AI
          </div>

          <div>
            {aiOpen ? "−" : "+"}
          </div>
        </div>

        {aiOpen && (
          <>
            <div
              style={
                styles.aiResponse
              }
            >
              <pre
                style={{
                  whiteSpace:
                    "pre-wrap",

                  lineHeight:
                    "1.7",

                  margin: 0,
                }}
              >
                {aiResponse}
              </pre>
            </div>

            <div
              style={
                styles.aiButtons
              }
            >
              <button
                style={
                  styles.aiButton
                }
                disabled={
                  aiLoading
                }
                onClick={() =>
                  handleAI(
                    "Explain the error in this code"
                  )
                }
              >
                Explain Error
              </button>

              <button
                style={
                  styles.aiButton
                }
                disabled={
                  aiLoading
                }
                onClick={() =>
                  handleAI(
                    "Give hints only"
                  )
                }
              >
                Give Hint
              </button>

              <button
                style={
                  styles.aiButton
                }
                disabled={
                  aiLoading
                }
                onClick={() =>
                  handleAI(
                    "Optimize this code"
                  )
                }
              >
                Optimize
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    height: "100vh",
    background:
      "linear-gradient(to bottom right,#020617,#0f172a)",
    padding: "14px",
    color: "#fff",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  header: {
    height: "70px",
    background:
      "rgba(15,23,42,0.95)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    padding: "0 18px",
  },

  backButton: {
    background:
      "linear-gradient(135deg,#7c3aed,#d946ef)",
    border: "none",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
  },

  timer: {
    fontWeight: "700",
  },

  body: {
    flex: 1,
    display: "grid",
    gridTemplateColumns:
      "180px 1fr 280px",
    gap: "14px",
  },

  sidebar: {
    background:
      "rgba(15,23,42,0.95)",
    borderRadius: "20px",
    padding: "16px",
  },

  sidebarTitle: {
    marginBottom: "20px",
  },

  problemItem: {
    padding: "14px",
    borderRadius: "14px",
    cursor: "pointer",
    marginBottom: "10px",
    fontWeight: "700",
  },

  center: {
    display: "grid",
    gridTemplateRows:
      "60px 1fr 170px auto",
    gap: "12px",
  },

  editorTop: {
    background:
      "rgba(15,23,42,0.95)",
    borderRadius: "18px",
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  select: {
    background: "#020617",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
  },

  editorContainer: {
    borderRadius: "20px",
    overflow: "hidden",
  },

  outputCard: {
    background:
      "rgba(15,23,42,0.95)",
    borderRadius: "20px",
    padding: "16px",
    overflowY: "auto",
  },

  outputText: {
    whiteSpace: "pre-wrap",
    margin: 0,
  },

  rightPanel: {
    background:
      "rgba(15,23,42,0.95)",
    borderRadius: "20px",
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  problemTitle: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "900",
  },

  infoCard: {
    background:
      "rgba(255,255,255,0.04)",
    borderRadius: "16px",
    padding: "14px",
    lineHeight: "1.7",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    background: "#020617",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px",
    resize: "none",
    outline: "none",
  },

  buttonRow: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,1fr)",
    gap: "10px",
  },

  primaryButton: {
    background:
      "linear-gradient(135deg,#7c3aed,#d946ef)",
    border: "none",
    color: "#fff",
    padding: "14px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
  },

  secondaryButton: {
    background:
      "rgba(255,255,255,0.08)",
    border: "none",
    color: "#fff",
    padding: "14px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
  },

  aiFloating: {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    width: "330px",
    background:
      "linear-gradient(135deg,#4c1d95,#7c3aed)",
    borderRadius: "22px",
    overflow: "hidden",
    zIndex: 999,
    transition: "0.3s",
    display: "flex",
    flexDirection: "column",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.45)",
  },

  aiTop: {
    height: "65px",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    padding: "0 18px",
    cursor: "pointer",
    fontWeight: "800",
  },

  aiResponse: {
    flex: 1,
    overflowY: "auto",
    background:
      "rgba(255,255,255,0.08)",
    margin: "0 14px",
    borderRadius: "14px",
    padding: "14px",
    fontSize: "13px",
  },

  aiButtons: {
    display: "grid",
    gap: "8px",
    padding: "14px",
  },

  aiButton: {
    background:
      "rgba(255,255,255,0.12)",
    border: "none",
    color: "#fff",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },
};
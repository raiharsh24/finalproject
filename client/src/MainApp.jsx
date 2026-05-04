import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function MainApp({ role }) {
  const [selectedProblem, setSelectedProblem] = useState(null);

  const [code, setCode] = useState("// Write C++ code");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("cpp");

  const runCode = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          input,
          language,
        }),
      });

      const data = await res.json();
      setOutput(data.output || "No output");
    } catch (err) {
      setOutput("Error running code");
    }
  };

  return (
    <div style={styles.container}>
      
      {/* LEFT SIDEBAR */}
      <div style={styles.sidebar}>
        <h3>Problems</h3>
        {['Two Sum', 'Add Two Numbers'].map((p) => (
          <div
            key={p}
            style={{
              ...styles.problem,
              background: selectedProblem === p ? '#6366f1' : styles.problem.background,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onClick={() => setSelectedProblem(p)}
            onMouseEnter={(e) => (e.currentTarget.style.background = selectedProblem === p ? '#6366f1' : '#475569')}
            onMouseLeave={(e) => (e.currentTarget.style.background = selectedProblem === p ? '#6366f1' : styles.problem.background)}
          >
            {p}
          </div>
        ))}
      </div>

      {/* CENTER */}
      <div style={styles.main}>
        
        {/* TOP BAR */}
        <div style={styles.topbar}>
          <span>Logged in as: <b>{role}</b></span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.select}
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
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
            onChange={(value) => setCode(value || "")}
          />
        </div>

        {/* OUTPUT */}
        <div style={styles.output}>
          <h4>Output</h4>
          <pre>{output}</pre>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.right}>
        <h3>Input</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.textarea}
          placeholder="Custom input..."
        />

        <div style={styles.buttons}>
          <button onClick={runCode} style={styles.buttonPrimary}>
            Run
          </button>
          <button style={styles.buttonSecondary}>
            Submit
          </button>
        </div>

        <div style={styles.hint}>
          <h4>Hints</h4>
          <p>Use efficient approach 🚀</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "220px 1fr 300px",
    height: "100vh",
    background: "rgba(15,23,42,0.85)",
    color: "#fff",
    overflow: "hidden",
    gap: "12px",
    padding: "12px",
    backdropFilter: "blur(8px)"
  },

  sidebar: {
    background: "rgba(30,41,59,0.85)",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
  },

  problem: {
    padding: "10px",
    marginTop: "8px",
    background: "rgba(51,65,85,0.85)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s"
  },

  main: {
    display: "grid",
    gridTemplateRows: "60px 1fr 180px",
    overflow: "hidden"
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "rgba(30,41,59,0.85)",
    borderRadius: "8px"
  },

  select: {
    padding: "6px",
    borderRadius: "6px"
  },

  editor: {
    padding: "10px",
    background: "rgba(2,6,23,0.85)",
    borderRadius: "8px",
    overflow: "hidden"
  },

  output: {
    background: "#020617",
    padding: "12px",
    borderRadius: "8px",
    overflowY: "auto"
  },

  right: {
    background: "rgba(30,41,59,0.85)",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    borderRadius: "8px"
  },

  textarea: {
    width: "100%",
    height: "120px",
    background: "#020617",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px"
  },

  buttons: {
    display: "flex",
    gap: "10px"
  },

  buttonPrimary: {
    flex: 1,
    padding: "10px",
    background: "#6366f1",
    border: "none",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer"
  },

  buttonSecondary: {
    flex: 1,
    padding: "10px",
    background: "#334155",
    border: "none",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer"
  },

  hint: {
    background: "#020617",
    padding: "10px",
    borderRadius: "6px",
    flex: 1
  }
};
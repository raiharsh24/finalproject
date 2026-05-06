import { useState, useEffect } from "react";

import Login from "./Login";
import MainApp from "./MainApp";
import AdminPanel from "./AdminPanel";
import StudentDashboard from "./StudentDashboard";

import TeacherDashboard from "./teacher/pages/TeacherDashboard.jsx";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [role, setRole] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [view, setView] =
    useState("dashboard");

  const [selectedProblem,
    setSelectedProblem] =
    useState(null);

  const [submissions,
    setSubmissions] =
    useState([]);

  const [leaderboard,
    setLeaderboard] =
    useState([]);

  const [
    contestLeaderboard,
    setContestLeaderboard,
  ] = useState([]);

  const [timeLeft,
    setTimeLeft] =
    useState(3600);

  /* ================= LOAD ROLE ================= */

  useEffect(() => {
    const savedRole =
      localStorage.getItem(
        "role"
      );

    if (savedRole) {
      setRole(savedRole);
    }

    setLoading(false);
  }, []);

  /* ================= STUDENT TIMER ================= */

  useEffect(() => {
    if (
      role === "student" &&
      timeLeft > 0
    ) {
      const timer =
        setInterval(() => {
          setTimeLeft(
            (prev) =>
              prev - 1
          );
        }, 1000);

      return () =>
        clearInterval(timer);
    }
  }, [timeLeft, role]);

  /* ================= FORMAT TIMER ================= */

  const formatTime =
    () => {
      const min =
        Math.floor(
          timeLeft / 60
        );

      const sec =
        timeLeft % 60;

      return `${min}:${sec
        .toString()
        .padStart(2, "0")}`;
    };

  /* ================= LOGIN ================= */

  const handleLogin =
    (data) => {
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      setRole(data.role);
    };

  /* ================= LOGOUT ================= */

  const handleLogout =
    () => {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "role"
      );

      setRole(null);

      setView(
        "dashboard"
      );

      setSelectedProblem(
        null
      );
    };

  /* ================= NAVIGATION ================= */

  const handleNavigate =
    async (data) => {
      if (
        typeof data ===
        "string"
      ) {
        setView(data);
        return;
      }

      setView(data.view);

      setSelectedProblem(
        data.problem ||
          null
      );

      /* SUBMISSIONS */

      if (
        data.view ===
        "submissions"
      ) {
        try {
          const res =
            await fetch(
              "http://localhost:5000/api/code/history",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "token"
                  )}`,
                },
              }
            );

          const result =
            await res.json();

          setSubmissions(
            result.submissions ||
              []
          );
        } catch {
          setSubmissions(
            []
          );
        }
      }

      /* LEADERBOARD */

      if (
        data.view ===
        "leaderboard"
      ) {
        try {
          const res =
            await fetch(
              `http://localhost:5000/api/code/leaderboard/${
                data.problem ||
                "Two Sum"
              }`
            );

          const result =
            await res.json();

          setLeaderboard(
            result.leaderboard ||
              []
          );
        } catch {
          setLeaderboard(
            []
          );
        }
      }

      /* CONTEST */

      if (
        data.view ===
        "contest"
      ) {
        try {
          const res =
            await fetch(
              "http://localhost:5000/api/code/contest-leaderboard"
            );

          const result =
            await res.json();

          setContestLeaderboard(
            result.leaderboard ||
              []
          );
        } catch {
          setContestLeaderboard(
            []
          );
        }
      }
    };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <h2>
        Loading...
      </h2>
    );
  }

  let content;

  /* ================= LOGIN PAGE ================= */

  if (!role) {
    content = (
      <Login
        onLogin={
          handleLogin
        }
      />
    );
  }

  /* ================= ADMIN ================= */

  else if (
    role === "admin"
  ) {
    content = (
      <div>

        <div style={styles.topbar}>

          <span>
            ADMIN PANEL
          </span>

          <button
            onClick={
              handleLogout
            }
          >
            Logout
          </button>

        </div>

        <AdminPanel />

      </div>
    );
  }

  /* ================= STUDENT ================= */

  else if (
    role === "student"
  ) {
    content = (
      <div className="bg-gray-100 min-h-screen">

        {/* TOPBAR */}

        <div style={styles.topbar}>

          <span>

            {view ===
            "dashboard"
              ? "Logged in as: STUDENT"
              : view ===
                "submissions"
              ? "My Submissions"
              : view ===
                "leaderboard"
              ? "Leaderboard"
              : view ===
                "contest"
              ? "Contest"
              : "Editor"}

          </span>

          <span>
            ⏱{" "}
            {formatTime()}
          </span>

          <button
            onClick={
              handleLogout
            }
          >
            Logout
          </button>

        </div>

        {/* DASHBOARD */}

        {view ===
          "dashboard" && (
          <StudentDashboard
            onNavigate={
              handleNavigate
            }
          />
        )}

        {/* EDITOR */}

        {view ===
          "editor" && (
          <MainApp
            role={role}
            selectedProblem={
              selectedProblem
            }
            onBack={() =>
              setView(
                "dashboard"
              )
            }
          />
        )}

        {/* SUBMISSIONS */}

        {view ===
          "submissions" && (
          <div
            style={
              styles.pageContainer
            }
          >

            <button
              onClick={() =>
                setView(
                  "dashboard"
                )
              }
              style={
                styles.backButton
              }
            >
              ← Back to
              Dashboard
            </button>

            <h2>
              My
              Submissions
            </h2>

            {submissions.map(
              (s, i) => (
                <div
                  key={i}
                  style={
                    styles.card
                  }
                >

                  <div>
                    <b>
                      Problem:
                    </b>{" "}
                    {
                      s.problemId
                    }
                  </div>

                  <div>
                    <b>
                      Status:
                    </b>{" "}
                    {
                      s.status
                    }
                  </div>

                  <div>
                    <b>
                      Score:
                    </b>{" "}
                    {
                      s.score
                    }
                    %
                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* LEADERBOARD */}

        {view ===
          "leaderboard" && (
          <div
            style={
              styles.pageContainer
            }
          >

            <button
              onClick={() =>
                setView(
                  "dashboard"
                )
              }
              style={
                styles.backButton
              }
            >
              ← Back to
              Dashboard
            </button>

            <h2>
              Leaderboard
            </h2>

            {leaderboard.map(
              (u, i) => (
                <div
                  key={i}
                  style={
                    styles.card
                  }
                >

                  <div>
                    <b>
                      Rank:
                    </b>{" "}
                    #
                    {i + 1}
                  </div>

                  <div>
                    <b>
                      User:
                    </b>{" "}
                    {
                      u.userId
                        ?.email
                    }
                  </div>

                  <div>
                    <b>
                      Score:
                    </b>{" "}
                    {
                      u.score
                    }
                    %
                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* CONTEST */}

        {view ===
          "contest" && (
          <div
            style={
              styles.pageContainer
            }
          >

            <button
              onClick={() =>
                setView(
                  "dashboard"
                )
              }
              style={
                styles.backButton
              }
            >
              ← Back to
              Dashboard
            </button>

            <h2>
              Contest
              Leaderboard
            </h2>

            {contestLeaderboard.map(
              (u, i) => (
                <div
                  key={i}
                  style={
                    styles.card
                  }
                >

                  <div>
                    <b>
                      Rank:
                    </b>{" "}
                    #
                    {i + 1}
                  </div>

                  <div>
                    <b>
                      User:
                    </b>{" "}
                    {u.email}
                  </div>

                  <div>
                    <b>
                      Score:
                    </b>{" "}
                    {
                      u.contestScore
                    }
                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>
    );
  }

  /* ================= TEACHER ================= */

  else if (
    role === "teacher"
  ) {
    content = (
      <TeacherDashboard />
    );
  }

  /* ================= DEFAULT ================= */

  else {
    content = (
      <div>

        <div style={styles.topbar}>

          <span>

            Logged in as:{" "}

            <b>
              {role.toUpperCase()}
            </b>

          </span>

          <button
            onClick={
              handleLogout
            }
          >
            Logout
          </button>

        </div>

        <MainApp
          role={role}
        />

      </div>
    );
  }

  return (
    <>

      {content}

      <ToastContainer position="top-right" />

    </>
  );
}

const styles = {
  topbar: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    padding:
      "10px 20px",

    background:
      "#1f2937",

    color: "#fff",
  },

  pageContainer: {
    padding: "20px",

    color: "#fff",

    background:
      "rgba(15,23,42,0.95)",

    minHeight: "100vh",
  },

  backButton: {
    padding: "8px 12px",

    background:
      "#6366f1",

    border: "none",

    color: "#fff",

    cursor: "pointer",

    marginBottom:
      "20px",
  },

  card: {
    background:
      "#1e293b",

    padding: "10px",

    marginTop: "10px",

    borderRadius: "6px",
  },
};
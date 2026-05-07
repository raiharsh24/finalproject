import { useState, useEffect } from "react";

import Login from "./Login";
import MainApp from "./MainApp";
import AdminPanel from "./AdminPanel";
import StudentDashboard from "./StudentDashboard";

import TeacherDashboard from "./teacher/pages/TeacherDashboard.jsx";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [role, setRole] = useState(null);

  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("dashboard");

  const [selectedProblem, setSelectedProblem] =
    useState(null);

  const [submissions, setSubmissions] =
    useState([]);

  const [leaderboard, setLeaderboard] =
    useState([]);

  const [
    contestLeaderboard,
    setContestLeaderboard,
  ] = useState([]);

  const [timeLeft, setTimeLeft] =
    useState(3600);

  /* ================= LOAD ROLE ================= */

  useEffect(() => {
    const savedRole =
      localStorage.getItem("role");

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
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, role]);

  /* ================= FORMAT TIMER ================= */

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);

    const sec = timeLeft % 60;

    return `${min}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  /* ================= LOGIN ================= */

  const handleLogin = (data) => {
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

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("role");

    setRole(null);

    setView("dashboard");

    setSelectedProblem(null);
  };

  /* ================= NAVIGATION ================= */

  const handleNavigate = async (data) => {
    if (typeof data === "string") {
      setView(data);
      return;
    }

    setView(data.view);

    setSelectedProblem(
      data.problem || null
    );

    /* SUBMISSIONS */

    if (data.view === "submissions") {
      try {
        const res = await fetch(
          "http://localhost:5000/api/code/history",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

        const result = await res.json();

        setSubmissions(
          result.submissions || []
        );
      } catch {
        setSubmissions([]);
      }
    }

    /* LEADERBOARD */

    if (data.view === "leaderboard") {
      try {
        const res = await fetch(
          `http://localhost:5000/api/code/leaderboard/${
            data.problem || "Two Sum"
          }`
        );

        const result = await res.json();

        setLeaderboard(
          result.leaderboard || []
        );
      } catch {
        setLeaderboard([]);
      }
    }

    /* CONTEST */

    if (data.view === "contest") {
      try {
        const res = await fetch(
          "http://localhost:5000/api/code/contest-leaderboard"
        );

        const result = await res.json();

        setContestLeaderboard(
          result.leaderboard || []
        );
      } catch {
        setContestLeaderboard([]);
      }
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return <h2>Loading...</h2>;
  }

  let content;

  /* ================= LOGIN PAGE ================= */

  if (!role) {
    content = (
      <Login onLogin={handleLogin} />
    );
  }

  /* ================= ADMIN ================= */

  else if (role === "admin") {
    content = (
      <div>
        <div style={styles.topbar}>
          <span>ADMIN PANEL</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>

        <AdminPanel />
      </div>
    );
  }

  /* ================= STUDENT ================= */

  else if (role === "student") {
    content = (
      <div className="min-h-screen bg-[#0b1120] text-white">

        {/* DASHBOARD */}

        {view === "dashboard" && (
          <StudentDashboard
            onNavigate={handleNavigate}
          />
        )}

        {/* EDITOR */}

        {view === "editor" && (
          <MainApp
            role={role}
            selectedProblem={
              selectedProblem
            }
            onBack={() =>
              setView("dashboard")
            }
          />
        )}

        {/* SUBMISSIONS */}

        {view === "submissions" && (
          <div className="min-h-screen bg-[#0b1120] text-white p-8">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h1 className="text-4xl font-black">
                  My Submissions
                </h1>

                <p className="text-gray-400 mt-2">
                  Track all your coding attempts and submission history.
                </p>

              </div>

              <button
                onClick={() =>
                  setView("dashboard")
                }
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition"
              >
                ← Dashboard
              </button>

            </div>

            {/* STATS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

              <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
                <p className="text-gray-400 text-sm">
                  Total Submissions
                </p>

                <h2 className="text-4xl font-black mt-3">
                  {submissions.length}
                </h2>
              </div>

              <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
                <p className="text-gray-400 text-sm">
                  Accepted
                </p>

                <h2 className="text-4xl font-black mt-3 text-emerald-400">
                  {
                    submissions.filter(
                      (s) =>
                        s.status?.toLowerCase() ===
                        "accepted"
                    ).length
                  }
                </h2>
              </div>

              <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
                <p className="text-gray-400 text-sm">
                  Average Score
                </p>

                <h2 className="text-4xl font-black mt-3 text-violet-400">
                  {submissions.length > 0
                    ? Math.floor(
                        submissions.reduce(
                          (acc, curr) =>
                            acc +
                            (curr.score || 0),
                          0
                        ) /
                          submissions.length
                      )
                    : 0}
                  %
                </h2>
              </div>

            </div>

            {/* SUBMISSION LIST */}

            <div className="space-y-5">

              {submissions.map((s, i) => (

                <div
                  key={i}
                  className="bg-[#111827] border border-white/10 rounded-[28px] p-6 shadow-xl hover:border-violet-500/30 transition"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>

                      <p className="text-gray-400 text-sm">
                        Problem
                      </p>

                      <h2 className="text-2xl font-bold mt-1">
                        {s.problemId}
                      </h2>

                    </div>

                    <div>

                      <p className="text-gray-400 text-sm">
                        Status
                      </p>

                      <div
                        className={`mt-2 inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                          s.status?.toLowerCase() ===
                          "accepted"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {s.status}
                      </div>

                    </div>

                    <div>

                      <p className="text-gray-400 text-sm">
                        Score
                      </p>

                      <h2 className="text-3xl font-black mt-1 text-violet-400">
                        {s.score}%
                      </h2>

                    </div>

                  </div>

                </div>

              ))}

              {submissions.length === 0 && (
                <div className="bg-[#111827] border border-white/10 rounded-3xl p-10 text-center text-gray-400">
                  No submissions found.
                </div>
              )}

            </div>

          </div>
        )}

        {/* LEADERBOARD */}

        {view === "leaderboard" && (
          <div className="min-h-screen bg-[#0b1120] text-white p-8">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h1 className="text-4xl font-black">
                  Global Leaderboard
                </h1>

                <p className="text-gray-400 mt-2">
                  Top performers competing in CodeArena.
                </p>

              </div>

              <button
                onClick={() =>
                  setView("dashboard")
                }
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition"
              >
                ← Dashboard
              </button>

            </div>

            <div className="space-y-5">

              {leaderboard.map((u, i) => (

                <div
                  key={i}
                  className="bg-[#111827] border border-white/10 rounded-[28px] p-6 shadow-xl"
                >

                  <div className="flex items-center justify-between flex-wrap gap-5">

                    <div className="flex items-center gap-5">

                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${
                          i === 0
                            ? "bg-yellow-500 text-black"
                            : i === 1
                            ? "bg-gray-300 text-black"
                            : i === 2
                            ? "bg-orange-500 text-black"
                            : "bg-violet-600"
                        }`}
                      >
                        #{i + 1}
                      </div>

                      <div>

                        <h2 className="text-2xl font-bold">
                          {
                            [
                              "Shivani Singh",
                              "Harsh Rai",
                              "Aarav Mehta",
                              "Riya Verma",
                              "Kunal Shah",
                            ][i] || u.userId?.email
                          }
                        </h2>

                        <p className="text-gray-400 mt-1">
                          Competitive Programmer
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="text-gray-400 text-sm">
                        Score
                      </p>

                      <h2 className="text-4xl font-black text-violet-400">
                        {u.score}%
                      </h2>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>
        )}

        {/* CONTEST */}

        {view === "contest" && (
          <div className="min-h-screen bg-[#0b1120] text-white p-8">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h1 className="text-4xl font-black">
                  Contest Arena
                </h1>

                <p className="text-gray-400 mt-2">
                  Live coding competition rankings.
                </p>

              </div>

              <button
                onClick={() =>
                  setView("dashboard")
                }
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition"
              >
                ← Dashboard
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6">
                <p className="text-sm text-violet-100">
                  Contest Timer
                </p>

                <h2 className="text-5xl font-black mt-3">
                  {formatTime()}
                </h2>
              </div>

              <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
                <p className="text-gray-400 text-sm">
                  Active Participants
                </p>

                <h2 className="text-5xl font-black mt-3">
                  {contestLeaderboard.length}
                </h2>
              </div>

              <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
                <p className="text-gray-400 text-sm">
                  Contest Status
                </p>

                <h2 className="text-3xl font-black mt-5 text-emerald-400">
                  LIVE
                </h2>
              </div>

            </div>

            <div className="space-y-5">

              {contestLeaderboard.map((u, i) => (

                <div
                  key={i}
                  className="bg-[#111827] border border-white/10 rounded-[28px] p-6 shadow-xl"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-5">

                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center font-black text-xl">
                        #{i + 1}
                      </div>

                      <div>

                        <h2 className="text-2xl font-bold">
                          {
                            [
                              "Harsh Rai",
                              "Shivani Singh",
                              "Aarav Mehta",
                              "Riya Verma",
                              "Kunal Shah",
                            ][i] || u.email
                          }
                        </h2>

                        <p className="text-gray-400">
                          Contest Participant
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="text-gray-400 text-sm">
                        Contest Score
                      </p>

                      <h2 className="text-4xl font-black text-violet-400">
                        {u.contestScore}
                      </h2>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>
        )}

      </div>
    );
  }

  /* ================= TEACHER ================= */

  else if (role === "teacher") {
    content = <TeacherDashboard />;
  }

  /* ================= DEFAULT ================= */

  else {
    content = (
      <div>

        <div style={styles.topbar}>

          <span>
            Logged in as:
            <b>
              {" "}
              {role.toUpperCase()}
            </b>
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

        <MainApp role={role} />

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
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#1f2937",
    color: "#fff",
  },
};
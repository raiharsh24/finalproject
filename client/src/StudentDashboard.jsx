import React, { useEffect, useState } from "react";

const containerStyle = {
  minHeight: "100vh",
  background: "#0f172a", // cleaner dark (same family as teacher UI)
  color: "#fff",
  padding: "40px 20px",
};

const headerStyle = {
  fontSize: "2rem",
  fontWeight: "600",
  marginBottom: "30px",
};

const cardContainerStyle = {
  display: "grid",
  gap: "20px",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const cardStyle = {
  background: "#1e293b", // cleaner than rgba
  borderRadius: "14px",
  padding: "24px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export default function StudentDashboard({ onNavigate }) {
  const [role, setRole] = useState("student");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  const goToEditor = () => {
    console.log("Practice clicked");
    onNavigate &&
      onNavigate({
        view: "editor",
        problem: "Two Sum",
      });
  };

  const goToSubmissions = () => {
    console.log("Submissions clicked");
    onNavigate &&
      onNavigate({
        view: "submissions",
      });
  };

  const goToLeaderboard = () => {
    console.log("Performance clicked");
    onNavigate &&
      onNavigate({
        view: "leaderboard",
        problem: "Two Sum",
      });
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}
      </div>

      <div style={cardContainerStyle}>
        
        {/* PRACTICE */}
        <div
          style={cardStyle}
          onClick={goToEditor}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-6px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <h3>Practice Problems</h3>
          <p style={{ opacity: 0.7 }}>Solve coding challenges</p>
        </div>

        {/* SUBMISSIONS */}
        <div
          style={cardStyle}
          onClick={goToSubmissions}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-6px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <h3>My Submissions</h3>
          <p style={{ opacity: 0.7 }}>View your past solutions</p>
        </div>

        {/* PERFORMANCE */}
        <div
          style={cardStyle}
          onClick={goToLeaderboard}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-6px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <h3>Performance</h3>
          <p style={{ opacity: 0.7 }}>Track your progress</p>
        </div>

      </div>
    </div>
  );
}
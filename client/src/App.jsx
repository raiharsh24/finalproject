import { useState, useEffect } from "react";
import Login from "./Login";
import MainApp from "./MainApp";
import AdminPanel from "./AdminPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);
    setLoading(false);
  }, []);

  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    setRole(data.role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
  };

  if (loading) return <h2>Loading...</h2>;

  let content;

  if (!role) {
    content = <Login onLogin={handleLogin} />;
  } else if (role === "admin") {
    content = (
      <div>
        <div style={styles.topbar}>
          <span>ADMIN PANEL</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <AdminPanel />
      </div>
    );
  } else {
    content = (
      <div>
        <div style={styles.topbar}>
          <span>Logged in as: <b>{role.toUpperCase()}</b></span>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <MainApp role={role} />
      </div>
    );
  }

  return (
    <>
      {content}

      {/* ✅ SINGLE GLOBAL INSTANCE */}
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
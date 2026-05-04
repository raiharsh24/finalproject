import { useState } from "react";
import { motion } from "framer-motion";
import { saveToken } from "./utils/auth";

const generateBlobs = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    size: Math.random() * 220 + 180,
    top: Math.random() * 80 + 5,
    left: Math.random() * 80 + 5,
    delay: Math.random() * 4,
    duration: Math.random() * 18 + 22,
    key: index,
  }));
};

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [mode, setMode] = useState("login"); // login | signup | forgot

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const blobs = generateBlobs(8);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        saveToken(data.token);
        localStorage.setItem("role", data.role);
        setMessage("Login successful!");
        if (onLogin) onLogin(data);
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {
    if (!email) return setMessage("Enter email first");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          mode: mode === "signup" ? "signup" : "forgot", // ✅ FIXED
        }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch {
      setMessage("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !otp || !password) {
      return setMessage("All fields required");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful!");
        setMode("login");
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !otp || !password) {
      return setMessage("All fields required");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password updated! Login now.");
        setMode("login");
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background" />

      {blobs.map(({ size, top, left, delay, duration, key }) => (
        <motion.div
          key={key}
          className="login-bubble"
          style={{ width: size, height: size, top: `${top}%`, left: `${left}%` }}
          animate={{ y: [0, -24, 0], x: [0, 18, 0] }}
          transition={{ repeat: Infinity, duration, delay }}
        />
      ))}

      <div className="login-card-wrapper">
        <motion.div className="login-card">

          <div className="login-header">
            <span className="login-label">
              {mode === "login"
                ? "LOGIN"
                : mode === "signup"
                ? "SIGN UP"
                : "RESET"}
            </span>

            <h1>
              {mode === "login"
                ? "Welcome Back"
                : mode === "signup"
                ? "Create Account"
                : "Reset Password"}
            </h1>
          </div>

          <form
            onSubmit={
              mode === "login"
                ? handleLogin
                : mode === "signup"
                ? handleRegister
                : handleResetPassword
            }
            className="login-form"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {mode !== "login" && (
              <input
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            )}

            <input
              type="password"
              placeholder={
                mode === "forgot"
                  ? "New Password"
                  : "Enter Password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="login-submit" disabled={loading}>
              {loading
                ? "Processing..."
                : mode === "login"
                ? "Sign In"
                : mode === "signup"
                ? "Register"
                : "Reset Password"}
            </button>

            {mode !== "login" && (
              <button
                type="button"
                className="login-submit"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
            )}
          </form>

          {message && <p className="login-message">{message}</p>}

          <div className="login-actions">
            {mode === "login" && (
              <>
                <button onClick={() => setMode("forgot")}>
                  Forgot password?
                </button>
                <button onClick={() => setMode("signup")}>
                  Sign up
                </button>
              </>
            )}

            {mode !== "login" && (
              <button onClick={() => setMode("login")}>
                Back to Login
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
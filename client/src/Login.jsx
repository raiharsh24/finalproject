import { useState } from "react";
import { motion } from "framer-motion";

const saveToken = (token) => {
  localStorage.setItem("token", token);
};

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

  const [mode, setMode] = useState("login");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        saveToken(data.token);

        localStorage.setItem("role", data.role);

        setMessage("Login successful!");

        if (onLogin) {
          onLogin(data);
        }
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {
    if (!email) {
      setMessage("Enter email first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          mode: mode === "signup" ? "signup" : "forgot",
        }),
      });

      const data = await res.json();

      setMessage(data.message || "OTP sent");
    } catch (err) {
      setMessage("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !otp || !password) {
      setMessage("All fields required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful! Please login.");
        setMode("login");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      setMessage("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !otp || !password) {
      setMessage("All fields required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Password updated! Login now.");
        setMode("login");
      } else {
        setMessage(data.message || "Reset failed");
      }
    } catch (err) {
      setMessage("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-4 py-10 text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.2),transparent_35%)]" />

      {/* Animated Blobs */}
      {blobs.map(({ size, top, left, delay, duration, key }) => (
        <motion.div
          key={key}
          className="absolute rounded-full bg-violet-500/10 blur-3xl"
          style={{
            width: size,
            height: size,
            top: `${top}%`,
            left: `${left}%`,
          }}
          animate={{
            y: [0, -24, 0],
            x: [0, 18, 0],
          }}
          transition={{
            repeat: Infinity,
            duration,
            delay,
          }}
        />
      ))}

      {/* Login Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold tracking-[0.3em] text-violet-300">
            {mode === "login"
              ? "LOGIN"
              : mode === "signup"
              ? "SIGN UP"
              : "RESET"}
          </p>

          <h1 className="text-4xl font-bold">
            {mode === "login"
              ? "Welcome Back"
              : mode === "signup"
              ? "Create Account"
              : "Reset Password"}
          </h1>

          <p className="mt-3 text-sm text-gray-300">
            Continue your coding journey with CodeArena
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={
            mode === "login"
              ? handleLogin
              : mode === "signup"
              ? handleRegister
              : handleResetPassword
          }
          className="space-y-5"
        >
          {/* Email */}
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40"
          />

          {/* OTP */}
          {mode !== "login" && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40"
            />
          )}

          {/* Password */}
          <input
            type="password"
            placeholder={
              mode === "forgot"
                ? "Enter new password"
                : "Enter password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-4 text-lg font-semibold transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : mode === "login"
              ? "Sign In"
              : mode === "signup"
              ? "Register"
              : "Reset Password"}
          </button>

          {/* Send OTP */}
          {mode !== "login" && (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full rounded-2xl border border-violet-500/30 bg-violet-500/10 px-5 py-4 font-medium transition hover:bg-violet-500/20"
            >
              Send OTP
            </button>
          )}
        </form>

        {/* Message */}
        {message && (
          <div className="mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-center text-sm text-violet-200">
            {message}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col items-center gap-3 text-sm">
          {mode === "login" ? (
            <>
              <button
                onClick={() => setMode("forgot")}
                className="text-violet-300 transition hover:text-white"
              >
                Forgot Password?
              </button>

              <button
                onClick={() => setMode("signup")}
                className="text-violet-300 transition hover:text-white"
              >
                Create New Account
              </button>
            </>
          ) : (
            <button
              onClick={() => setMode("login")}
              className="text-violet-300 transition hover:text-white"
            >
              Back to Login
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
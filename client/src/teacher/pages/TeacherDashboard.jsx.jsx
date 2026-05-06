import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "../components/Layout";

import Dashboard from "./Dashboard";
import ProblemsBank from "./ProblemsBank";
import QuizManagement from "./QuizManagement";
import Messages from "./Messages";
import Schedule from "./Schedule";
import Library from "./Library";
import Homeworks from "./Homeworks";
import Settings from "./Settings";
import Leaderboard from "./Leaderboard";

export default function TeacherDashboard() {
  return (
    <Layout>

      <Routes>

        <Route
          path="/"
          element={
            <Navigate to="/dashboard" />
          }
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/problems-bank"
          element={<ProblemsBank />}
        />

        <Route
          path="/quiz-management"
          element={<QuizManagement />}
        />

        <Route
          path="/messages"
          element={<Messages />}
        />

        <Route
          path="/schedule"
          element={<Schedule />}
        />

        <Route
          path="/library"
          element={<Library />}
        />

        <Route
          path="/homeworks"
          element={<Homeworks />}
        />

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>

    </Layout>
  );
}
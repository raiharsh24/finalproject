import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import QuizManagement from './pages/QuizManagement';
import ProblemsBank from './pages/ProblemsBank';
import Schedule from './pages/Schedule';
import Library from './pages/Library';
import Homeworks from './pages/Homeworks';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>{/* layout contains sidebar+navbar */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="messages" element={<Messages />} />
          <Route path="quiz-management" element={<QuizManagement />} />
          <Route path="problems-bank" element={<ProblemsBank />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="library" element={<Library />} />
          <Route path="homeworks" element={<Homeworks />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

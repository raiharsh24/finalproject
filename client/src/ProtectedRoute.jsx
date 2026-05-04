import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from './utils/auth';

// Simple protected route wrapper
export default function ProtectedRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

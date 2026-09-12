import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-page-container">
        <div className="spinner" style={{ borderColor: 'rgba(0,0,0,0.15)', borderTopColor: 'var(--brand-red)', width: 32, height: 32 }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-page-container">
        <div className="spinner" style={{ borderColor: 'rgba(0,0,0,0.15)', borderTopColor: 'var(--brand-red)', width: 32, height: 32 }} />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

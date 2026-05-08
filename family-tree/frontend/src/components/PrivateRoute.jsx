import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, onlyApproved = false }) {
  const token = localStorage.getItem('family_tree_token');
  const user = JSON.parse(localStorage.getItem('family_tree_user') || 'null');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If status exists and is not approved, block access to restricted pages
  if (onlyApproved && user?.status && user.status !== 'approved') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PrivateRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, onlyApproved = false }) {
  const token = localStorage.getItem('family_tree_token');
  const user = JSON.parse(localStorage.getItem('family_tree_user') || 'null');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (onlyApproved && user?.status !== 'approved') {
    return <Navigate to="/payment" replace />;
  }

  return children;
}

export default PrivateRoute;

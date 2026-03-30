import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  // Check if user is logged in
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  // If user is not logged in, redirect to login page
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the protected component
  return element;
};

export default ProtectedRoute;

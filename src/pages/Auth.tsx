
import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/Auth/LoginForm';

const Auth = () => {
  // Check if user is already logged in
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // If user is authenticated, redirect to admin dashboard
  if (user && user.isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <LoginForm />
    </div>
  );
};

export default Auth;

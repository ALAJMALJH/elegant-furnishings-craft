
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/Auth/LoginForm';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

const Auth = () => {
  const [showSecurityAlert, setShowSecurityAlert] = useState(true);
  
  // Check if user is already logged in
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // If user is authenticated, redirect to admin dashboard
  if (user && user.isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted p-4">
      {showSecurityAlert && (
        <Alert className="mb-6 max-w-md">
          <Shield className="h-5 w-5 text-amber-500" />
          <AlertTitle>Secure Admin Access</AlertTitle>
          <AlertDescription>
            This area is restricted to authorized personnel only. All login attempts are logged for security purposes.
          </AlertDescription>
        </Alert>
      )}
      
      <LoginForm />
      
      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        <p>This admin panel provides real-time updates and secure access to manage your store's products, orders, customers, and more.</p>
      </div>
    </div>
  );
};

export default Auth;

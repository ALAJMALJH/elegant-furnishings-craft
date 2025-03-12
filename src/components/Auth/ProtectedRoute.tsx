
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// Define the roles and their access levels
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  SUPPORT: 'support',
  ADMIN: 'admin', // For backward compatibility
};

// Define route access by role
const ROLE_ACCESS = {
  '/admin/dashboard': [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.SUPPORT, ROLES.ADMIN],
  '/admin/products': [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.ADMIN],
  '/admin/sales': [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.ADMIN],
  '/admin/customers': [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.SUPPORT, ROLES.ADMIN],
  '/admin/analytics': [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.ADMIN],
  '/admin/discounts': [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.ADMIN],
  '/admin/settings': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
};

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  
  // Check if user is authenticated
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // If not authenticated, redirect to login
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check role-based access for the current path
  const currentPath = Object.keys(ROLE_ACCESS).find(path => 
    location.pathname.startsWith(path)
  );
  
  // If path requires role check
  if (currentPath) {
    const userRole = user.role || ROLES.ADMIN; // Default to admin for backwards compatibility
    const allowedRoles = ROLE_ACCESS[currentPath];
    
    // If user doesn't have permission for this route
    if (!allowedRoles.includes(userRole)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive"
      });
      
      // Redirect to dashboard or a permitted page
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  
  // If authenticated and has permission, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;

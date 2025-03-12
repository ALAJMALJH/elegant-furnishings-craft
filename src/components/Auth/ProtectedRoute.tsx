
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// Define permissions for each role
const rolePermissions = {
  super_admin: {
    // Super admin can access everything
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/products',
      '/admin/sales',
      '/admin/customers',
      '/admin/analytics',
      '/admin/discounts',
      '/admin/settings',
    ],
    canEdit: true,
    canDelete: true,
  },
  manager: {
    // Manager can access most things but not settings
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/products',
      '/admin/sales',
      '/admin/customers',
      '/admin/analytics',
      '/admin/discounts',
    ],
    canEdit: true,
    canDelete: false,
  },
  support: {
    // Support can only view customers, sales, and dashboard
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/sales',
      '/admin/customers',
    ],
    canEdit: false,
    canDelete: false,
  },
};

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  
  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  useEffect(() => {
    // Check if user is authenticated but doesn't have permission for this route
    if (user && user.isAuthenticated && user.role) {
      const permissions = rolePermissions[user.role as keyof typeof rolePermissions];
      
      if (permissions && !permissions.allowedRoutes.includes(location.pathname)) {
        toast({
          title: "Access Denied",
          description: `You don't have permission to access ${location.pathname}`,
          variant: "destructive",
        });
      }
    }
  }, [location.pathname, user]);
  
  // If user is not authenticated, redirect to login
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Check if user has permission to access this route
  if (user.role) {
    const permissions = rolePermissions[user.role as keyof typeof rolePermissions];
    
    if (permissions && !permissions.allowedRoutes.includes(location.pathname)) {
      // Redirect to dashboard if user doesn't have permission
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  
  // If authenticated and has permission, render the outlet
  return <Outlet />;
};

// Export permissions for use in other components
export { rolePermissions };
export default ProtectedRoute;

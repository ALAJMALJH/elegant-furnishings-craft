
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define permissions for each role
// These roles are used for frontend permission checks
const rolePermissions = {
  ceo: {
    // CEO can access everything
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
    canManageUsers: true,
    canAccessFinancials: true,
    canManageProducts: true,
    canManageOrders: true,
    databaseRole: 'admin', // Maps to 'admin' in the database
  },
  cto: {
    // CTO can access most things with technical focus
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/products',
      '/admin/analytics',
      '/admin/settings',
    ],
    canEdit: true,
    canDelete: true,
    canManageUsers: false,
    canAccessFinancials: false,
    canManageProducts: true,
    canManageOrders: false,
    databaseRole: 'admin', // Maps to 'admin' in the database
  },
  manager: {
    // Manager can access inventory, orders, and customer data
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/products',
      '/admin/sales',
      '/admin/customers',
    ],
    canEdit: true,
    canDelete: false,
    canManageUsers: false,
    canAccessFinancials: false,
    canManageProducts: true,
    canManageOrders: true,
    databaseRole: 'moderator', // Maps to 'moderator' in the database
  },
  sales: {
    // Sales can access customer and order data
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/sales',
      '/admin/customers',
    ],
    canEdit: true,
    canDelete: false,
    canManageUsers: false,
    canAccessFinancials: false,
    canManageProducts: false,
    canManageOrders: true,
    databaseRole: 'user', // Maps to 'user' in the database
  },
  support: {
    // Support can only view customer data and orders
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/sales',
      '/admin/customers',
    ],
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canAccessFinancials: false,
    canManageProducts: false,
    canManageOrders: false,
    databaseRole: 'user', // Maps to 'user' in the database
  },
  hr: {
    // HR can access dashboard and employee-related settings
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/settings',
    ],
    canEdit: true,
    canDelete: false,
    canManageUsers: true,
    canAccessFinancials: false,
    canManageProducts: false,
    canManageOrders: false,
    databaseRole: 'moderator', // Maps to 'moderator' in the database
  },
  marketing: {
    // Marketing can manage products and promotions
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/products',
      '/admin/discounts',
    ],
    canEdit: true,
    canDelete: false,
    canManageUsers: false,
    canAccessFinancials: false,
    canManageProducts: true,
    canManageOrders: false,
    databaseRole: 'moderator', // Maps to 'moderator' in the database
  },
  finance: {
    // Finance can access financial data and reports
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/sales',
      '/admin/analytics',
    ],
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canAccessFinancials: true,
    canManageProducts: false,
    canManageOrders: false,
    databaseRole: 'moderator', // Maps to 'moderator' in the database
  },
  operations: {
    // Operations can manage inventory and shipping
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/products',
      '/admin/sales',
    ],
    canEdit: true,
    canDelete: false,
    canManageUsers: false,
    canAccessFinancials: false,
    canManageProducts: true,
    canManageOrders: true,
    databaseRole: 'moderator', // Maps to 'moderator' in the database
  },
  admin: {
    // Admin can manage users and system settings
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/products',
      '/admin/settings',
    ],
    canEdit: true,
    canDelete: true,
    canManageUsers: true,
    canAccessFinancials: false,
    canManageProducts: true,
    canManageOrders: false,
    databaseRole: 'admin', // Maps to 'admin' in the database
  },
};

// Helper function to get role from email
const getRoleFromEmail = (email: string): string => {
  if (!email) return 'support'; // Default role
  
  const emailParts = email.split('@');
  if (emailParts.length !== 2) return 'support';
  
  const username = emailParts[0].toLowerCase();
  
  // Check for specific roles
  if (Object.keys(rolePermissions).includes(username)) {
    return username;
  }
  
  // Default fallback
  return 'support';
};

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  
  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  useEffect(() => {
    // Fetch and update user session on component mount
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser && (!user || !user.isAuthenticated)) {
          // If authenticated in Supabase but not in localStorage, update localStorage
          const userRole = getRoleFromEmail(authUser.email || '');
          localStorage.setItem('user', JSON.stringify({
            id: authUser.id,
            email: authUser.email,
            role: userRole,
            isAuthenticated: true
          }));
          
          console.log('Updated user session from Supabase:', userRole);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };
    
    getUser();
  }, []);
  
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

// Export helper function and permissions for use in other components
export { rolePermissions, getRoleFromEmail };
export default ProtectedRoute;

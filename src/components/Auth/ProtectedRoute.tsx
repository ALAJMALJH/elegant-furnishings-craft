
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase, getUserRoleFromEmail } from '@/integrations/supabase/client';

// Define permissions for each role
// These roles are used for frontend permission checks
interface RolePermission {
  allowedRoutes: string[];
  canEdit: boolean;
  canDelete: boolean;
  description: string;
}

// Enhanced role permissions with expanded roles
export const rolePermissions: Record<string, RolePermission> = {
  ceo: {
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
    description: 'Full access to all system features',
  },
  cto: {
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/products',
      '/admin/sales',
      '/admin/analytics',
      '/admin/settings',
    ],
    canEdit: true,
    canDelete: false,
    description: 'Technical and infrastructure management',
  },
  admin: {
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
    description: 'Administration of users and system settings',
  },
  manager: {
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
    description: 'Management of inventory, orders, and customers',
  },
  sales: {
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/sales',
      '/admin/customers',
    ],
    canEdit: true,
    canDelete: false,
    description: 'Sales data and customer management',
  },
  support: {
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/sales',
      '/admin/customers',
    ],
    canEdit: false,
    canDelete: false,
    description: 'Customer support and issue tracking',
  },
  hr: {
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/settings',
    ],
    canEdit: false,
    canDelete: false,
    description: 'Employee management and HR processes',
  },
  marketing: {
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/products',
      '/admin/discounts',
    ],
    canEdit: true,
    canDelete: false,
    description: 'Promotions, campaigns, and product visibility',
  },
  finance: {
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/sales',
      '/admin/analytics',
    ],
    canEdit: false,
    canDelete: false,
    description: 'Financial reporting and billing management',
  },
  operations: {
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/products',
      '/admin/sales',
    ],
    canEdit: true,
    canDelete: false,
    description: 'Logistics, shipping, and inventory management',
  },
  // Legacy roles kept for backward compatibility
  super_admin: {
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
    description: 'Legacy admin role with full access',
  },
};

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // First check localStorage for cached role
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        
        // If we have a role cached and user is authenticated, use that initially
        if (user && user.isAuthenticated && user.role) {
          setUserRole(user.role);
        }
        
        // Always verify with the server for the most up-to-date role
        const role = await getUserRoleFromEmail();
        
        if (role !== 'guest') {
          // Update localStorage with the latest role
          const updatedUser = {
            ...user,
            isAuthenticated: true,
            role: role
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserRole();
  }, [location.pathname]);
  
  useEffect(() => {
    // Check if user is authenticated but doesn't have permission for this route
    if (userRole && rolePermissions[userRole]) {
      const permissions = rolePermissions[userRole];
      
      if (!permissions.allowedRoutes.includes(location.pathname)) {
        toast({
          title: "Access Denied",
          description: `You don't have permission to access ${location.pathname}`,
          variant: "destructive",
        });
      }
    }
  }, [location.pathname, userRole]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!userRole) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Check if user has permission to access this route
  const permissions = rolePermissions[userRole];
  
  if (!permissions || !permissions.allowedRoutes.includes(location.pathname)) {
    // Redirect to dashboard if user doesn't have permission
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // If authenticated and has permission, render the outlet
  return <Outlet />;
};

export default ProtectedRoute;

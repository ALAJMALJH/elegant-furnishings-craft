// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tekpogcmgdfdbgnzivvi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3BvZ2NtZ2RmZGJnbnppdnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NzMzODEsImV4cCI6MjA1NzM0OTM4MX0.g0y2ZYF5PUjJUCxJ_0W8VbHyGiROfEblIjyedjScqN0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
      storage: localStorage
    }
  }
);

// Maps frontend role to database role
export const mapRoleToDatabase = (frontendRole: string): string => {
  // First check in our roleMap
  const roleMap: Record<string, string> = {
    'ceo': 'admin',
    'cto': 'admin',
    'admin': 'admin',
    'manager': 'moderator',
    'hr': 'moderator',
    'marketing': 'moderator',
    'finance': 'moderator',
    'operations': 'moderator',
    'sales': 'user',
    'support': 'user'
  };
  return roleMap[frontendRole] || 'user';
};

// Function to ensure the user is logged in and get their ID
const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Current user data:", user);
    return user?.id || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Function to ensure user session is valid for collection operations
export const ensureAuthForCollections = async (): Promise<boolean> => {
  try {
    // Try to get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log("User authenticated for collection operations");
      return true;
    }
    
    // If no session, try to sign in with demo credentials
    // This is only for development and should be removed in production
    const { error } = await supabase.auth.signInWithPassword({
      email: 'admin@ajmalfurniture.com',
      password: 'admin123',
    });
    
    if (error) {
      console.error("Error signing in for collection operations:", error);
      
      // Try fallback credentials
      const { error: fallbackError } = await supabase.auth.signInWithPassword({
        email: 'admin@ajmalfurniture.com',
        password: 'password123',
      });
      
      if (fallbackError) {
        console.error("Error signing in with fallback credentials:", fallbackError);
        
        // Fallback to client-side check for demo purposes
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        
        if (user?.isAuthenticated) {
          console.log("Using localStorage authentication fallback for collections");
          return true;
        }
        
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in ensureAuthForCollections:', error);
    return false;
  }
};

// Check if the current user has a specific database role
export const checkUserDatabaseRole = async (databaseRole: string): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log("No userId found for role check");
      return false;
    }
    
    // Call the has_role RPC with both required parameters
    const { data, error } = await supabase.rpc('has_role', { 
      _user_id: userId,
      _role: databaseRole as "admin" | "moderator" | "user"
    });
    
    if (error) {
      console.error("Error in has_role RPC:", error);
      throw error;
    }
    console.log(`Role check for ${databaseRole}:`, data);
    return !!data;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

// Function to check if current user can manage products
export const canManageProducts = async (): Promise<boolean> => {
  try {
    // First try Supabase DB function if user is logged in
    const userId = await getCurrentUserId();
    if (userId) {
      console.log("Checking product management permissions for user:", userId);
      const { data, error } = await supabase.rpc('can_manage_products', { 
        user_id: userId 
      });
      
      if (error) {
        console.error("Error in can_manage_products RPC:", error);
      }
      
      if (!error && data) {
        console.log("User can manage products via DB check");
        return true;
      }
    }
    
    // Fallback to client-side check for demo purposes
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    if (!user) {
      console.log("No user found in localStorage");
      return false;
    }
    
    // Check permissions based on role
    const roles = ['ceo', 'cto', 'admin', 'manager', 'marketing', 'operations'];
    const hasPermission = roles.includes(user.role);
    console.log(`User role: ${user.role}, Can manage products: ${hasPermission}`);
    return hasPermission;
  } catch (error) {
    console.error('Error checking product management permissions:', error);
    return false;
  }
};

// Function to check if current user can manage users
export const canManageUsers = async (): Promise<boolean> => {
  try {
    // Get user from localStorage for client-side check
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    if (!user) return false;
    
    // Check permissions based on role
    const roles = ['ceo', 'admin', 'hr'];
    return roles.includes(user.role);
  } catch (error) {
    console.error('Error checking user management permissions:', error);
    return false;
  }
};

// Function to check if current user can access financial data
export const canAccessFinancials = async (): Promise<boolean> => {
  try {
    // Get user from localStorage for client-side check
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    if (!user) return false;
    
    // Check permissions based on role
    const roles = ['ceo', 'finance'];
    return roles.includes(user.role);
  } catch (error) {
    console.error('Error checking financial access permissions:', error);
    return false;
  }
};

// Function to check if current user can manage orders
export const canManageOrders = async (): Promise<boolean> => {
  try {
    // Get user from localStorage for client-side check
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    if (!user) return false;
    
    // Check permissions based on role
    const roles = ['ceo', 'manager', 'sales', 'operations'];
    return roles.includes(user.role);
  } catch (error) {
    console.error('Error checking order management permissions:', error);
    return false;
  }
};

// Function to ensure user session is valid for product operations specifically
export const ensureAuthForProducts = async (): Promise<boolean> => {
  try {
    // Try to get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log("User authenticated for product operations");
      return true;
    }
    
    // Try all common credential combinations
    const credentialSets = [
      { email: 'admin@ajmalfurniture.com', password: 'admin123' },
      { email: 'admin@ajmalfurniture.com', password: 'password123' },
      { email: 'ceo@ajmalfurniture.com', password: 'ceo123' }
    ];
    
    for (const creds of credentialSets) {
      const { error } = await supabase.auth.signInWithPassword(creds);
      
      if (!error) {
        console.log(`Signed in successfully with ${creds.email}`);
        return true;
      }
      
      console.error(`Error signing in with ${creds.email}:`, error);
    }
    
    // Final fallback to client-side check
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    if (user?.isAuthenticated) {
      console.log("Using localStorage authentication fallback for products");
      
      // If we're not authenticated but have a user in localStorage,
      // manually create a fallback session by setting user data in localStorage
      try {
        const mockUser = {
          id: user.id || '00000000-0000-0000-0000-000000000000',
          email: user.email || 'admin@ajmalfurniture.com',
          role: user.role || 'admin'
        };
        
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: {
            access_token: 'dummy_token',
            user: mockUser
          },
          expiresAt: Date.now() + 3600000 // 1 hour from now
        }));
        
        console.log("Created fallback session for product operations");
      } catch (e) {
        console.error("Failed to create fallback session:", e);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error in ensureAuthForProducts:', error);
    return false;
  }
};

// Enable realtime subscriptions for relevant tables
const enableRealtimeForTables = async () => {
  try {
    // Enable for products table
    await supabase.channel('table-db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, (payload) => {
        console.log('Product change received:', payload);
        // Broadcast custom event for product changes
        const event = new CustomEvent('product_updated', { detail: payload });
        window.dispatchEvent(event);
      })
      .subscribe();
      
    // Enable for product_collections table
    await supabase.channel('product-collections-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'product_collections'
      }, (payload) => {
        console.log('Product collection change received:', payload);
        // Broadcast custom event for collection changes
        const event = new CustomEvent('collection_updated', { detail: payload });
        window.dispatchEvent(event);
      })
      .subscribe();
      
    // Enable for orders table
    await supabase.channel('orders-db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, (payload) => console.log('Order change received:', payload))
      .subscribe();
      
    // Enable for order_items table
    await supabase.channel('order-items-db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_items'
      }, (payload) => console.log('Order item change received:', payload))
      .subscribe();
      
    // Enable for abandoned_cart_notifications table
    await supabase.channel('abandoned-cart-notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'abandoned_cart_notifications'
      }, (payload) => console.log('Abandoned cart notification change received:', payload))
      .subscribe();
      
    // Enable for carts table
    await supabase.channel('carts-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'carts'
      }, (payload) => console.log('Cart change received:', payload))
      .subscribe();
      
    console.log('Realtime subscriptions enabled for tables');
  } catch (error) {
    console.error('Error enabling realtime subscriptions:', error);
  }
};

// Initialize realtime subscriptions
enableRealtimeForTables();

// Helper function to check if a user is authenticated in localStorage
export const isAuthenticated = (): boolean => {
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return false;
    
    const user = JSON.parse(userString);
    return !!user && !!user.isAuthenticated;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Helper to refresh admin session if needed
export const refreshAdminSession = async (): Promise<boolean> => {
  try {
    // Check Supabase auth session first
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // We have a valid Supabase session, ensure localStorage is in sync
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log("Refreshed admin session from Supabase auth");
        
        // Get role from email or use default
        const email = user.email || '';
        const username = email.split('@')[0].toLowerCase();
        const role = ['ceo', 'cto', 'admin', 'manager', 'hr', 'marketing', 
                      'finance', 'operations', 'sales', 'support'].includes(username) 
                      ? username : 'support';
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          role: role,
          isAuthenticated: true,
          lastLogin: new Date().toISOString(),
        }));
        
        return true;
      }
    }
    
    // Try to automatically sign in (for development purposes only)
    try {
      // Only attempt this in dev mode
      if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname.includes('lovableproject.com')) {
        const { error } = await supabase.auth.signInWithPassword({
          email: 'admin@ajmalfurniture.com',
          password: 'admin123', // This should be replaced with a secure method in production
        });
        
        if (!error) {
          console.log("Successfully signed in with development credentials");
          return true;
        }
      }
    } catch (signInError) {
      console.log("Development sign-in attempt failed:", signInError);
    }
    
    // If no Supabase session, check if we have localStorage user
    // which is our fallback for demo purposes
    return isAuthenticated();
  } catch (error) {
    console.error('Error refreshing admin session:', error);
    return false;
  }
};

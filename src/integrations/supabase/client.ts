
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
      autoRefreshToken: true
    }
  }
);

// Define comprehensive role mappings
export const mapRoleToDatabase = (frontendRole: string): string => {
  const roleMap: Record<string, string> = {
    'super_admin': 'admin',
    'ceo': 'admin',
    'cto': 'admin',
    'admin': 'admin',
    'manager': 'moderator',
    'marketing': 'moderator',
    'operations': 'moderator',
    'sales': 'user',
    'support': 'user',
    'hr': 'user',
    'finance': 'user'
  };
  return roleMap[frontendRole] || 'user';
};

// Check if the current user has a specific database role
export const checkUserDatabaseRole = async (databaseRole: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // Call the has_role RPC with both required parameters
    const { data, error } = await supabase.rpc('has_role', { 
      _user_id: user.id,
      _role: databaseRole as "admin" | "moderator" | "user"
    });
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

// Function to check if current user can manage products
export const canManageProducts = async (): Promise<boolean> => {
  try {
    // Check if user has admin or moderator role (which can manage products)
    const isAdmin = await checkUserDatabaseRole('admin');
    const isModerator = await checkUserDatabaseRole('moderator');
    
    return isAdmin || isModerator;
  } catch (error) {
    console.error('Error checking product management permissions:', error);
    return false;
  }
};

// Check if user can access financial data
export const canAccessFinancials = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return false;
    
    const financialAccessRoles = [
      'ceo@ajmalfurniture.com',
      'finance@ajmalfurniture.com'
    ];
    
    return financialAccessRoles.includes(user.email);
  } catch (error) {
    console.error('Error checking financial access permissions:', error);
    return false;
  }
};

// Check if user can manage users and roles
export const canManageUsers = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return false;
    
    const userManagementRoles = [
      'ceo@ajmalfurniture.com',
      'admin@ajmalfurniture.com'
    ];
    
    return userManagementRoles.includes(user.email);
  } catch (error) {
    console.error('Error checking user management permissions:', error);
    return false;
  }
};

// Check if user can manage inventory
export const canManageInventory = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return false;
    
    const inventoryManagementRoles = [
      'ceo@ajmalfurniture.com',
      'cto@ajmalfurniture.com',
      'manager@ajmalfurniture.com',
      'operations@ajmalfurniture.com'
    ];
    
    return inventoryManagementRoles.includes(user.email) || await canManageProducts();
  } catch (error) {
    console.error('Error checking inventory management permissions:', error);
    return false;
  }
};

// Check if user can access customer data
export const canAccessCustomerData = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return false;
    
    const customerDataAccessRoles = [
      'ceo@ajmalfurniture.com',
      'sales@ajmalfurniture.com',
      'support@ajmalfurniture.com',
      'manager@ajmalfurniture.com'
    ];
    
    return customerDataAccessRoles.includes(user.email) || await checkUserDatabaseRole('admin');
  } catch (error) {
    console.error('Error checking customer data access permissions:', error);
    return false;
  }
};

// Check if user can manage marketing and content
export const canManageMarketing = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return false;
    
    const marketingRoles = [
      'ceo@ajmalfurniture.com',
      'marketing@ajmalfurniture.com'
    ];
    
    return marketingRoles.includes(user.email) || await checkUserDatabaseRole('admin');
  } catch (error) {
    console.error('Error checking marketing permissions:', error);
    return false;
  }
};

// Function to get the specific user role based on email
export const getUserRoleFromEmail = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return 'guest';
    
    const email = user.email.toLowerCase();
    
    // Map email to role
    if (email === 'ceo@ajmalfurniture.com') return 'ceo';
    if (email === 'cto@ajmalfurniture.com') return 'cto';
    if (email === 'manager@ajmalfurniture.com') return 'manager';
    if (email === 'sales@ajmalfurniture.com') return 'sales';
    if (email === 'support@ajmalfurniture.com') return 'support';
    if (email === 'hr@ajmalfurniture.com') return 'hr';
    if (email === 'marketing@ajmalfurniture.com') return 'marketing';
    if (email === 'finance@ajmalfurniture.com') return 'finance';
    if (email === 'operations@ajmalfurniture.com') return 'operations';
    if (email === 'admin@ajmalfurniture.com') return 'admin';
    
    // Default to user role if not a special email
    const isAdmin = await checkUserDatabaseRole('admin');
    const isModerator = await checkUserDatabaseRole('moderator');
    
    if (isAdmin) return 'admin';
    if (isModerator) return 'moderator';
    return 'user';
  } catch (error) {
    console.error('Error getting user role from email:', error);
    return 'guest';
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
      }, (payload) => console.log('Product change received:', payload))
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
      
    // Enable for product_collections table
    await supabase.channel('product-collections-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'product_collections'
      }, (payload) => console.log('Product collection change received:', payload))
      .subscribe();
      
    console.log('Realtime subscriptions enabled for tables');
  } catch (error) {
    console.error('Error enabling realtime subscriptions:', error);
  }
};

// Initialize realtime subscriptions
enableRealtimeForTables();

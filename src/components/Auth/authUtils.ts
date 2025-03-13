
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getRoleFromEmail } from '@/components/Auth/ProtectedRoute';

// Function to handle admin login that properly manages different authentication methods
export const handleAdminLogin = async (email: string, password: string) => {
  try {
    // First try to authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authData.user) {
      console.log("Successfully authenticated with Supabase:", authData.user);
      
      // Get role from email
      const role = getRoleFromEmail(authData.user.email || '');
      
      // Format display name from email
      const displayName = getDisplayNameFromEmail(authData.user.email || '');
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: authData.user.id,
        email: authData.user.email,
        displayName,
        role,
        isAuthenticated: true,
        lastLogin: new Date().toISOString(),
        authProvider: 'supabase'
      }));
      
      // Log successful login
      try {
        await supabase
          .from('page_visits')
          .insert([{ 
            page_path: '/auth', 
            visitor_id: `admin_${authData.user.email}`,
            source: 'supabase_auth',
            user_agent: navigator.userAgent
          }]);
      } catch (logError) {
        console.error('Error logging visit:', logError);
      }
      
      return {
        success: true,
        user: authData.user,
        message: "Login successful via Supabase authentication"
      };
    }
    
    // If Supabase auth failed, try demo accounts
    if (authError) {
      console.log("Supabase auth failed, trying demo accounts:", authError.message);
      
      // Get demo admin accounts from the calling component
      const demoAdmins = getDemoAdminAccounts();
      
      const admin = demoAdmins.find(
        admin => admin.email === email && admin.password === password
      );
      
      if (!admin) {
        throw new Error(authError.message || 'Invalid email or password');
      }
      
      // Create a mock session that enables RLS bypass in development
      if (process.env.NODE_ENV === 'development' || 
          window.location.hostname === 'localhost' || 
          window.location.hostname.includes('lovableproject.com')) {
        
        // Create a mock auth session
        const mockSession = {
          access_token: 'DEMO_MODE_TOKEN',
          refresh_token: 'DEMO_MODE_REFRESH',
          user: {
            id: `demo-${admin.email}`,
            email: admin.email,
            app_metadata: { role: admin.role },
            user_metadata: { role: admin.role }
          },
          expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
        };
        
        // Set the mock session in localStorage
        const authStore = {
          currentSession: mockSession,
          expiresAt: Math.floor(Date.now() / 1000) + 3600
        };
        
        localStorage.setItem('supabase.auth.token', JSON.stringify(authStore));
        
        // Force refresh the session
        try {
          await supabase.auth.refreshSession();
        } catch (refreshError) {
          console.log("Error refreshing session, but proceeding with localStorage auth");
        }
      }
      
      // Log successful login
      try {
        await supabase
          .from('page_visits')
          .insert([{ 
            page_path: '/auth', 
            visitor_id: `admin_${admin.email}`,
            source: 'demo_auth',
            user_agent: navigator.userAgent
          }]);
      } catch (logError) {
        console.error('Error logging visit:', logError);
      }
      
      // Get role from email
      const role = getRoleFromEmail(admin.email);
      
      // Set user in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: `demo-${admin.email}`,
        email: admin.email,
        displayName: admin.displayName,
        role: role,
        isAuthenticated: true,
        lastLogin: new Date().toISOString(),
        authProvider: 'demo'
      }));
      
      return {
        success: true,
        user: { email: admin.email },
        message: "Login successful via demo account"
      };
    }
    
    throw new Error('Authentication failed');
  } catch (err: any) {
    console.error('Login error:', err);
    
    return {
      success: false,
      message: err.message || 'An unexpected error occurred during login'
    };
  }
};

// Helper functions

// Get displayName from email
export const getDisplayNameFromEmail = (email: string): string => {
  const demoAdmins = getDemoAdminAccounts();
  const admin = demoAdmins.find(a => a.email === email);
  if (admin) return admin.displayName;
  
  // Else generate a display name from the email
  const name = email.split('@')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// Return the demo admin accounts - to be imported from LoginForm
export const getDemoAdminAccounts = () => {
  return [
    { email: 'ceo@ajmalfurniture.com', password: 'ceo123', role: 'ceo', displayName: 'CEO' },
    { email: 'cto@ajmalfurniture.com', password: 'cto123', role: 'cto', displayName: 'CTO' },
    { email: 'manager@ajmalfurniture.com', password: 'manager123', role: 'manager', displayName: 'Store Manager' },
    { email: 'sales@ajmalfurniture.com', password: 'sales123', role: 'sales', displayName: 'Sales Team' },
    { email: 'support@ajmalfurniture.com', password: 'support123', role: 'support', displayName: 'Support Team' },
    { email: 'hr@ajmalfurniture.com', password: 'hr123', role: 'hr', displayName: 'HR Manager' },
    { email: 'marketing@ajmalfurniture.com', password: 'marketing123', role: 'marketing', displayName: 'Marketing Team' },
    { email: 'finance@ajmalfurniture.com', password: 'finance123', role: 'finance', displayName: 'Finance Department' },
    { email: 'operations@ajmalfurniture.com', password: 'operations123', role: 'operations', displayName: 'Operations Manager' },
    { email: 'admin@ajmalfurniture.com', password: 'admin123', role: 'admin', displayName: 'System Admin' },
  ];
};


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
        
        // Create a mock auth session with an access token that won't expire soon
        const mockSession = {
          access_token: 'DEMO_MODE_TOKEN_' + Date.now(),
          refresh_token: 'DEMO_MODE_REFRESH_' + Date.now(),
          user: {
            id: `demo-${admin.email}`,
            email: admin.email,
            app_metadata: { role: admin.role },
            user_metadata: { role: admin.role }
          },
          expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 // 24 hours from now
        };
        
        // Set the mock session directly in localStorage
        const authStore = {
          currentSession: mockSession,
          expiresAt: Math.floor(Date.now() / 1000) + 3600 * 24
        };
        
        localStorage.setItem('supabase.auth.token', JSON.stringify(authStore));
        
        // Also set up a public anonymous key in session
        try {
          await supabase.auth.setSession({
            access_token: mockSession.access_token,
            refresh_token: mockSession.refresh_token
          });
          console.log("Successfully set mock session");
        } catch (refreshError) {
          console.log("Error setting mock session, but proceeding with localStorage auth:", refreshError);
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

// Function to create and set up a development admin session
export const createDevAdminSession = async (role = 'admin', email = 'admin@ajmalfurniture.com') => {
  // Only attempt this in dev mode
  if (!(process.env.NODE_ENV === 'development' || 
      window.location.hostname === 'localhost' || 
      window.location.hostname.includes('lovableproject.com'))) {
    console.log("Not in development mode, skipping dev admin session creation");
    return false;
  }

  try {
    console.log("Creating development admin session for", email);
    
    // Create mock user 
    const mockUser = {
      id: 'dev-admin-' + Date.now(),
      email: email,
      role: role,
      displayName: getDisplayNameFromEmail(email),
      isAuthenticated: true,
      lastLogin: new Date().toISOString(),
      authProvider: 'demo'
    };
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Create a long-lived mock auth session
    const mockSession = {
      access_token: 'DEV_MODE_TOKEN_' + Date.now(),
      refresh_token: 'DEV_MODE_REFRESH_' + Date.now(),
      user: {
        id: mockUser.id,
        email: mockUser.email,
        app_metadata: { role: role },
        user_metadata: { role: role }
      },
      expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 // 24 hours
    };
    
    // Set the mock session in localStorage
    const authStore = {
      currentSession: mockSession,
      expiresAt: Math.floor(Date.now() / 1000) + 3600 * 24
    };
    
    localStorage.setItem('supabase.auth.token', JSON.stringify(authStore));
    
    // Try to apply the session to Supabase
    try {
      const { error } = await supabase.auth.setSession({
        access_token: mockSession.access_token,
        refresh_token: mockSession.refresh_token
      });
      
      if (error) {
        console.log("Error setting Supabase session:", error);
        // Fall back to manual session
        const manualSession = {
          data: {
            session: mockSession,
            user: mockSession.user
          },
          error: null
        };
        
        (supabase.auth as any)._session = manualSession;
        console.log("Manually set session object:", manualSession);
      } else {
        console.log("Successfully set development session in Supabase client");
      }
    } catch (sessionError) {
      console.error("Failed to set session:", sessionError);
    }
    
    return true;
  } catch (error) {
    console.error("Error creating dev admin session:", error);
    return false;
  }
};

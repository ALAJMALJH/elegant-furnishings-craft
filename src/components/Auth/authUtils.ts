import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getRoleFromEmail } from '@/components/Auth/ProtectedRoute';

export const handleAdminLogin = async (email: string, password: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authData.user) {
      console.log("Successfully authenticated with Supabase:", authData.user);
      
      const role = getRoleFromEmail(authData.user.email || '');
      const displayName = getDisplayNameFromEmail(authData.user.email || '');
      
      localStorage.setItem('user', JSON.stringify({
        id: authData.user.id,
        email: authData.user.email,
        displayName,
        role,
        isAuthenticated: true,
        lastLogin: new Date().toISOString(),
        authProvider: 'supabase'
      }));
      
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
    
    if (authError) {
      console.log("Supabase auth failed, trying demo accounts:", authError.message);
      
      const demoAdmins = getDemoAdminAccounts();
      
      const admin = demoAdmins.find(
        admin => admin.email === email && admin.password === password
      );
      
      if (!admin) {
        throw new Error(authError.message || 'Invalid email or password');
      }
      
      if (process.env.NODE_ENV === 'development' || 
          window.location.hostname === 'localhost' || 
          window.location.hostname.includes('lovableproject.com')) {
        
        try {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: admin.email,
            password: `demo-${Date.now()}`,
            options: {
              data: {
                role: admin.role
              }
            }
          });
          
          if (!signUpError && signUpData.user) {
            console.log("Created demo user for RLS bypass:", signUpData.user);
          }
        } catch (signUpError) {
          console.log("Could not create demo user, trying to sign in instead:", signUpError);
          
          try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: admin.email,
              password: 'admin123'
            });
            
            if (!signInError && signInData.user) {
              console.log("Signed in with existing demo account:", signInData.user);
            }
          } catch (signInError) {
            console.log("Sign in also failed, falling back to mock session:", signInError);
          }
        }
        
        const mockSession = {
          access_token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3BvZ2NtZ2RmZGJnbnppdnZpIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJzdWIiOiJkZW1vLSR7YWRtaW4uZW1haWx9IiwiZXhwIjoxOTk5OTk5OTk5fQ.DEMO_SIGNATURE_${Date.now()}`,
          refresh_token: `DEMO_MODE_REFRESH_${Date.now()}`,
          user: {
            id: `demo-${admin.email}-${Date.now()}`,
            email: admin.email,
            app_metadata: { role: admin.role },
            user_metadata: { role: admin.role }
          },
          expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 30
        };
        
        const authStore = {
          currentSession: mockSession,
          expiresAt: Math.floor(Date.now() / 1000) + 3600 * 24 * 30
        };
        
        localStorage.setItem('supabase.auth.token', JSON.stringify(authStore));
        
        try {
          const { error } = await supabase.auth.setSession({
            access_token: mockSession.access_token,
            refresh_token: mockSession.refresh_token
          });
          
          if (error) {
            console.log("Error setting Supabase session:", error);
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
            console.log("Successfully set mock session");
          }
        } catch (refreshError) {
          console.log("Error setting mock session, but proceeding with localStorage auth:", refreshError);
        }
      }
      
      const role = getRoleFromEmail(admin.email);
      
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

export const getDisplayNameFromEmail = (email: string): string => {
  const demoAdmins = getDemoAdminAccounts();
  const admin = demoAdmins.find(a => a.email === email);
  if (admin) return admin.displayName;
  
  const name = email.split('@')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
};

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

export const createDevAdminSession = async (role = 'admin', email = 'admin@ajmalfurniture.com') => {
  if (!(process.env.NODE_ENV === 'development' || 
      window.location.hostname === 'localhost' || 
      window.location.hostname.includes('lovableproject.com'))) {
    console.log("Not in development mode, skipping dev admin session creation");
    return false;
  }

  try {
    console.log("Creating development admin session for", email);
    
    const mockUser = {
      id: 'dev-admin-' + Date.now(),
      email: email,
      role: role,
      displayName: getDisplayNameFromEmail(email),
      isAuthenticated: true,
      lastLogin: new Date().toISOString(),
      authProvider: 'demo'
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3BvZ2NtZ2RmZGJnbnppdnZpIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJzdWIiOiJkZXYtYWRtaW4tJHtEYXRlLm5vdygpfSIsImV4cCI6MTk5OTk5OTk5OX0.dev_token_${Date.now()}`;
    const refreshToken = `dev_refresh_${Date.now()}`;
    
    const authStore = {
      currentSession: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          app_metadata: { role: role },
          user_metadata: { role: role }
        },
        expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 30
      },
      expiresAt: Math.floor(Date.now() / 1000) + 3600 * 24 * 30
    };
    
    localStorage.setItem('supabase.auth.token', JSON.stringify(authStore));
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log("Successfully set up development admin session");
    return true;
  } catch (error) {
    console.error("Error creating dev admin session:", error);
    return false;
  }
};

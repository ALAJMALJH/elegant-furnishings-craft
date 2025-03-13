
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lock, UserCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { getRoleFromEmail } from '@/components/Auth/ProtectedRoute';
import { handleAdminLogin, getDemoAdminAccounts } from '@/components/Auth/authUtils';

// Demo admin accounts for each role
const DEMO_ADMINS = getDemoAdminAccounts();

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // First check Supabase auth
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("User already authenticated with Supabase:", data.session);
          navigate('/admin/dashboard');
          return;
        }
        
        // Then check local storage as fallback
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        
        if (user && user.isAuthenticated) {
          console.log("User already authenticated via localStorage:", user);
          
          // Validate the stored user information
          if (user.email && user.role) {
            navigate('/admin/dashboard');
            return;
          }
        }
        
        setAuthChecked(true);
      } catch (err) {
        console.error("Error checking authentication:", err);
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await handleAdminLogin(formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: `Welcome back!`,
        });
        
        navigate('/admin/dashboard');
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex justify-center items-center py-10">
          <div className="animate-spin">
            <RefreshCw className="h-6 w-6 text-primary" />
          </div>
          <span className="ml-2">Checking authentication...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
        <CardDescription className="text-center">
          Sign in to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <UserCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-9"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
          <div className="grid gap-2">
            {DEMO_ADMINS.map((admin) => (
              <div key={admin.email} className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium">{admin.displayName}</span>
                  <span className="text-muted-foreground"> - {admin.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setFormData({
                      email: admin.email,
                      password: admin.password,
                    });
                  }}
                  className="h-6 text-xs"
                >
                  Use
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>©  AL AJMAL Furniture</p>
        <p>Admin v1.0</p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

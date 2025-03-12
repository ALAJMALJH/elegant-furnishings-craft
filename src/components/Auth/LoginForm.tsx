
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Lock, UserCircle2 } from 'lucide-react';

// Demo admin accounts with roles
const DEMO_ADMINS = [
  { username: 'admin', password: 'admin123', role: 'admin', displayName: 'Admin User', email: 'admin@ajmalfurniture.com' },
  { username: 'ceo', password: 'ceo123', role: 'ceo', displayName: 'CEO User', email: 'ceo@ajmalfurniture.com' },
  { username: 'manager', password: 'manager123', role: 'manager', displayName: 'Store Manager', email: 'manager@ajmalfurniture.com' },
  { username: 'support', password: 'support123', role: 'support', displayName: 'Support Team', email: 'support@ajmalfurniture.com' },
];

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      // In a real app, you would authenticate with Supabase Auth
      // For demo, we'll use local check against demo accounts
      const admin = DEMO_ADMINS.find(
        admin => admin.username === formData.username && admin.password === formData.password
      );
      
      if (!admin) {
        throw new Error('Invalid username or password');
      }
      
      // Log successful login attempt (in a real app, this would be tracked in a secure way)
      try {
        await supabase
          .from('page_visits')
          .insert([
            { 
              page_path: '/auth', 
              visitor_id: `admin_${admin.username}`,
              source: 'admin_login',
              user_agent: navigator.userAgent
            }
          ]);
      } catch (logError) {
        console.error('Error logging visit:', logError);
      }
      
      // Set user in localStorage 
      // In a real app, this would be handled by Supabase Auth tokens
      localStorage.setItem('user', JSON.stringify({
        id: `demo-${admin.username}`,
        username: admin.username,
        displayName: admin.displayName,
        email: admin.email,
        role: admin.role,
        isAuthenticated: true,
        lastLogin: new Date().toISOString(),
      }));
      
      // Show success toast
      toast({
        title: "Login successful",
        description: `Welcome back, ${admin.displayName}!`,
      });
      
      // Navigate to the previous location or dashboard
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
      
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
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <UserCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  className="pl-9"
                  value={formData.username}
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
              <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-muted-foreground mb-2">Demo Accounts:</p>
          <div className="grid gap-2">
            {DEMO_ADMINS.map((admin) => (
              <div key={admin.username} className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium">{admin.displayName}</span>
                  <span className="text-muted-foreground"> - {admin.username}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setFormData({
                      username: admin.username,
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

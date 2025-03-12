import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { ROLES } from './ProtectedRoute';

// Simulated admin users - in a real application, this would be in a secure database
const ADMIN_USERS = [
  { username: 'admin', password: 'admin123', role: ROLES.SUPER_ADMIN },
  { username: 'manager', password: 'manager123', role: ROLES.MANAGER },
  { username: 'support', password: 'support123', role: ROLES.SUPPORT },
  { username: 'ceo@ajmalfurniture.com', password: 'Ceoajmal11CE@', role: ROLES.SUPER_ADMIN },
  { username: 'cto@ajmalfurniture.com', password: 'Ctoajmal11CT@', role: ROLES.SUPER_ADMIN },
  { username: 'manager@ajmalfurniture.com', password: 'Managerajmal11MA@', role: ROLES.MANAGER },
  { username: 'sales@ajmalfurniture.com', password: 'Salesajmal11SA@', role: ROLES.MANAGER },
  { username: 'support@ajmalfurniture.com', password: 'Supportajmal11SU@', role: ROLES.SUPPORT },
  { username: 'hr@ajmalfurniture.com', password: 'Hrajmal11HR@', role: ROLES.MANAGER },
  { username: 'marketing@ajmalfurniture.com', password: 'Marketingajmal11MA@', role: ROLES.MANAGER },
  { username: 'finance@ajmalfurniture.com', password: 'Financeajmal11FI@', role: ROLES.MANAGER },
  { username: 'operations@ajmalfurniture.com', password: 'Operationsajmal11OP@', role: ROLES.MANAGER },
  { username: 'admin@ajmalfurniture.com', password: 'Adminajmal11AD@', role: ROLES.SUPER_ADMIN }
];

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Check if user exists and credentials match
      const user = ADMIN_USERS.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        // Store user info in localStorage (in a real app, use a more secure method with JWT)
        localStorage.setItem('user', JSON.stringify({
          username: user.username,
          role: user.role,
          isAuthenticated: true
        }));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.username}!`,
        });
        
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-furniture-dark">Admin Login</h1>
        <p className="mt-2 text-furniture-accent2">Enter your credentials to access the dashboard</p>
      </div>
      
      <Separator />
      
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-furniture-dark">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-furniture-dark">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full btn-primary" 
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;

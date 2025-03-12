
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  Users, 
  DollarSign, 
  Tag, 
  Settings, 
  LogOut, 
  Home 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

const navigationItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Sales', path: '/admin/sales', icon: DollarSign },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Discounts', path: '/admin/discounts', icon: Tag },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  isMobile: boolean;
  setMobileMenuOpen?: (isOpen: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isMobile, setMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current user
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/');
  };
  
  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r border-border",
      isMobile ? "w-full" : "w-64"
    )}>
      <div className="flex items-center h-16 px-4 border-b border-border">
        <h2 className="text-xl font-semibold text-furniture-dark">
          AL AJMAL Admin
        </h2>
      </div>
      
      <div className="px-4 py-3 border-b border-border">
        <div className="text-sm font-medium text-furniture-dark">
          {user?.username || 'Admin'}
        </div>
        <div className="text-xs text-muted-foreground">
          {user?.role || 'Administrator'}
        </div>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-furniture-accent text-furniture-dark" 
                  : "text-furniture-dark hover:bg-furniture-accent/20"
              )}
            >
              <Icon className="w-5 h-5 mr-3 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto">
        <Separator className="mb-4" />
        <Button 
          variant="outline" 
          className="w-full justify-start text-furniture-dark hover:text-furniture-dark hover:bg-red-100"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;

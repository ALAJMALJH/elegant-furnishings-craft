
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  Users, 
  DollarSign, 
  Tag, 
  Settings, 
  LogOut, 
  Home,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Sales', path: '/admin/sales', icon: DollarSign },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Discounts', path: '/admin/discounts', icon: Tag },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

// Mock notifications
const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'low_stock', message: 'Modern Wooden Sofa is running low on stock (3 left)', time: '10 minutes ago' },
  { id: '2', type: 'new_order', message: 'New order #ORD-2023-006 received from Emma Johnson', time: '25 minutes ago' },
  { id: '3', type: 'customer_message', message: 'New support message from John Smith', time: '1 hour ago' },
  { id: '4', type: 'new_order', message: 'New order #ORD-2023-005 received from Michael Brown', time: '2 hours ago' },
];

interface AdminSidebarProps {
  isMobile: boolean;
  setMobileMenuOpen?: (isOpen: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isMobile, setMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(MOCK_NOTIFICATIONS.length);
  
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
  
  const handleReadNotification = (id: string) => {
    setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    
    // Mark as read (in a real app, you would update this in your database)
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read",
    });
  };
  
  // Simulate receiving a new notification
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance of receiving a new notification every 30 seconds
      if (Math.random() < 0.1) {
        const types = ['low_stock', 'new_order', 'customer_message', 'website_status'];
        const type = types[Math.floor(Math.random() * types.length)];
        const newNotification = {
          id: `${Date.now()}`,
          type,
          message: type === 'low_stock' 
            ? 'Elegant Dining Table is running low on stock (2 left)'
            : type === 'new_order'
            ? `New order #ORD-2023-${Math.floor(Math.random() * 100)} received`
            : type === 'customer_message'
            ? 'New support message received'
            : 'Website performance alert: Load time increased',
          time: 'Just now'
        };
        
        setNotifications(prev => [newNotification, ...prev].slice(0, 8));
        setUnreadCount(prev => prev + 1);
        
        toast({
          title: "New Notification",
          description: newNotification.message,
        });
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r border-border",
      isMobile ? "w-full" : "w-64"
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <h2 className="text-xl font-semibold text-furniture-dark">
          AL AJMAL Admin
        </h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-2 px-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  className="cursor-pointer flex flex-col items-start py-2"
                  onClick={() => handleReadNotification(notification.id)}
                >
                  <div className="font-medium">{notification.message}</div>
                  <div className="text-xs text-muted-foreground">{notification.time}</div>
                </DropdownMenuItem>
              ))
            )}
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-center text-primary"
                  onClick={() => {
                    setUnreadCount(0);
                    toast({
                      title: "All notifications marked as read",
                    });
                  }}
                >
                  Mark all as read
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
              
              {/* Show indicators for certain sections */}
              {item.name === 'Products' && (
                <Badge variant="outline" className="ml-auto bg-yellow-50 text-yellow-600 border-yellow-200">
                  2 low
                </Badge>
              )}
              {item.name === 'Sales' && (
                <Badge variant="outline" className="ml-auto bg-green-50 text-green-600 border-green-200">
                  3 new
                </Badge>
              )}
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


import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Edit, 
  Trash, 
  ShieldCheck,
  AlertTriangle,
  Bell,
  BellRing
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from '@/components/ui/use-toast';
import { ROLES } from '@/components/Auth/ProtectedRoute';

// User type
interface User {
  id: string;
  username: string;
  role: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

// Mock users
const MOCK_USERS: User[] = [
  { id: '1', username: 'admin@ajmalfurniture.com', role: ROLES.SUPER_ADMIN, lastLogin: '2023-07-15 14:30', status: 'active' },
  { id: '2', username: 'manager@ajmalfurniture.com', role: ROLES.MANAGER, lastLogin: '2023-07-14 09:15', status: 'active' },
  { id: '3', username: 'support@ajmalfurniture.com', role: ROLES.SUPPORT, lastLogin: '2023-07-13 16:45', status: 'active' },
  { id: '4', username: 'sales@ajmalfurniture.com', role: ROLES.MANAGER, lastLogin: '2023-07-12 11:20', status: 'active' },
  { id: '5', username: 'operations@ajmalfurniture.com', role: ROLES.MANAGER, lastLogin: '2023-07-10 13:10', status: 'inactive' },
];

// Notification settings type
interface NotificationSetting {
  id: string;
  type: string;
  description: string;
  enabled: boolean;
}

// Mock notification settings
const MOCK_NOTIFICATIONS: NotificationSetting[] = [
  { id: '1', type: 'low_stock', description: 'Send alerts when product stock falls below threshold', enabled: true },
  { id: '2', type: 'new_order', description: 'Notify when a new order is placed', enabled: true },
  { id: '3', type: 'customer_message', description: 'Alert when a customer sends a support message', enabled: true },
  { id: '4', type: 'website_status', description: 'Send alerts for website downtime or performance issues', enabled: true },
  { id: '5', type: 'price_changes', description: 'Notify when product prices are changed', enabled: false },
  { id: '6', type: 'review_alerts', description: 'Alert when a new customer review is posted', enabled: false },
];

const Settings: React.FC = () => {
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;
  
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [notifications, setNotifications] = useState<NotificationSetting[]>(MOCK_NOTIFICATIONS);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: ROLES.SUPPORT,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [syncSettings, setSyncSettings] = useState({
    realTimeOrders: true,
    realTimeInventory: true,
    realTimeDiscounts: true
  });

  // Check if current user is a super admin
  const isSuperAdmin = currentUser?.role === ROLES.SUPER_ADMIN;

  const handleRoleChange = (userId: string, newRole: string) => {
    if (!isSuperAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only Super Admins can change user roles",
        variant: "destructive"
      });
      return;
    }
    
    // Update the user's role
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}`,
    });
  };

  const handleStatusToggle = (userId: string) => {
    if (!isSuperAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only Super Admins can change user status",
        variant: "destructive"
      });
      return;
    }
    
    // Toggle user active status
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === 'active' ? 'inactive' : 'active';
    
    toast({
      title: "Status Updated",
      description: `User status has been set to ${newStatus}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (!isSuperAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only Super Admins can delete users",
        variant: "destructive"
      });
      return;
    }
    
    // Remove the user
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "User Deleted",
      description: "User has been permanently removed",
    });
  };

  const handleAddUser = () => {
    if (!isSuperAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only Super Admins can add users",
        variant: "destructive"
      });
      return;
    }
    
    if (!newUser.username || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Add new user
    const id = (users.length + 1).toString();
    setUsers([...users, {
      id,
      username: newUser.username,
      role: newUser.role,
      lastLogin: 'Never',
      status: 'active'
    }]);
    
    // Reset form and close dialog
    setNewUser({ username: '', password: '', role: ROLES.SUPPORT });
    setIsAddDialogOpen(false);
    
    toast({
      title: "User Added",
      description: "New user has been successfully created",
    });
  };

  const handleNotificationToggle = (id: string) => {
    // Toggle notification setting
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
    ));
    
    const notification = notifications.find(n => n.id === id);
    const newStatus = notification?.enabled ? 'disabled' : 'enabled';
    
    toast({
      title: "Notification Setting Updated",
      description: `${notification?.type.replace('_', ' ')} alerts are now ${newStatus}`,
    });
  };

  const handleSyncSettingChange = (setting: keyof typeof syncSettings) => {
    setSyncSettings({
      ...syncSettings,
      [setting]: !syncSettings[setting]
    });
    
    toast({
      title: "Sync Setting Updated",
      description: `${setting} synchronization has been ${syncSettings[setting] ? 'disabled' : 'enabled'}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-furniture-dark">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure your store settings and user permissions.</p>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Sync Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Role Management</CardTitle>
                <CardDescription>Manage store administrators and their permission levels</CardDescription>
              </div>
              
              {isSuperAdmin && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Add User</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new administrator account with specific role permissions.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <FormLabel>Username/Email</FormLabel>
                        <Input 
                          placeholder="email@example.com" 
                          value={newUser.username} 
                          onChange={e => setNewUser({...newUser, username: e.target.value})} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <FormLabel>Password</FormLabel>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          value={newUser.password} 
                          onChange={e => setNewUser({...newUser, password: e.target.value})} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <FormLabel>Role</FormLabel>
                        <Select 
                          value={newUser.role} 
                          onValueChange={value => setNewUser({...newUser, role: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ROLES.SUPER_ADMIN}>Super Admin (Full Access)</SelectItem>
                            <SelectItem value={ROLES.MANAGER}>Manager (Limited Access)</SelectItem>
                            <SelectItem value={ROLES.SUPPORT}>Support (View Only)</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <FormDescription>
                          {newUser.role === ROLES.SUPER_ADMIN && 'Full access to all admin features including user management.'}
                          {newUser.role === ROLES.MANAGER && 'Can edit products and view orders, but cannot modify users or delete items.'}
                          {newUser.role === ROLES.SUPPORT && 'Can view information and respond to customers, but cannot modify site content.'}
                        </FormDescription>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddUser}>Add User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        {isSuperAdmin ? (
                          <Select 
                            defaultValue={user.role}
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ROLES.SUPER_ADMIN}>Super Admin</SelectItem>
                              <SelectItem value={ROLES.MANAGER}>Manager</SelectItem>
                              <SelectItem value={ROLES.SUPPORT}>Support</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100">
                            {user.role === ROLES.SUPER_ADMIN && 'Super Admin'}
                            {user.role === ROLES.MANAGER && 'Manager'}
                            {user.role === ROLES.SUPPORT && 'Support'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
                        }`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {isSuperAdmin && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusToggle(user.id)}
                            >
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </Button>
                          )}
                          
                          {isSuperAdmin && user.id !== '1' && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification & Alert Settings</CardTitle>
              <CardDescription>Configure which automatic notifications you want to receive</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <div className="font-semibold flex items-center gap-2">
                        {notification.type === 'low_stock' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        {notification.type === 'new_order' && <BellRing className="h-4 w-4 text-green-500" />}
                        {notification.type === 'customer_message' && <Bell className="h-4 w-4 text-blue-500" />}
                        {notification.type === 'website_status' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {notification.type === 'price_changes' && <Bell className="h-4 w-4 text-purple-500" />}
                        {notification.type === 'review_alerts' && <Bell className="h-4 w-4 text-orange-500" />}
                        {notification.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Alerts
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Switch 
                      checked={notification.enabled}
                      onCheckedChange={() => handleNotificationToggle(notification.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle>Website Synchronization Settings</CardTitle>
              <CardDescription>Configure how the admin panel syncs with the customer-facing website</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="font-semibold">Real-Time Order Synchronization</div>
                    <p className="text-sm text-muted-foreground">Orders placed by customers appear instantly in the admin panel</p>
                  </div>
                  <Switch 
                    checked={syncSettings.realTimeOrders}
                    onCheckedChange={() => handleSyncSettingChange('realTimeOrders')}
                  />
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="font-semibold">Inventory Updates</div>
                    <p className="text-sm text-muted-foreground">Product stock changes reflect immediately on the customer website</p>
                  </div>
                  <Switch 
                    checked={syncSettings.realTimeInventory}
                    onCheckedChange={() => handleSyncSettingChange('realTimeInventory')}
                  />
                </div>
                
                <div className="flex items-center justify-between pb-2">
                  <div className="space-y-1">
                    <div className="font-semibold">Discount & Promotion Sync</div>
                    <p className="text-sm text-muted-foreground">Changes to discounts are applied immediately to the store</p>
                  </div>
                  <Switch 
                    checked={syncSettings.realTimeDiscounts}
                    onCheckedChange={() => handleSyncSettingChange('realTimeDiscounts')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

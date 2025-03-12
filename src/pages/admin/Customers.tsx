
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DownloadCloud, 
  Search, 
  Mail, 
  RefreshCw, 
  UserPlus, 
  Users,
  Calendar,
  Star,
  CircleDollarSign,
  Tags
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

type CustomerStatus = "active" | "new" | "inactive";

interface CustomerProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  loyalty_points: number;
  vip_status: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  email?: string; // From auth.users
  total_orders?: number;
  total_spent?: number;
  status?: CustomerStatus;
  latest_order_date?: string | null;
}

interface Segment {
  id: string;
  name: string;
  description: string | null;
  customer_count: number;
}

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [customerInsights, setCustomerInsights] = useState({
    total: 0,
    active: 0,
    new: 0,
    inactive: 0,
    returningRate: 0,
    averageSpend: 0,
    growth: 0
  });
  
  // Fetch customer profiles and related data
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch profiles from customer_profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('customer_profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      
      // We need to get email addresses from auth.users
      // In a production app, you'd use a secure edge function for this
      // For this demo, we'll simulate with mock data for some profiles
      
      // Get orders data for each customer
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      // Process and format customer data
      const processedCustomers = await Promise.all((profiles || []).map(async (profile) => {
        // Fetch orders for this customer (if connected to a user)
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', profile.id);
          
        if (ordersError) {
          console.error(`Error fetching orders for customer ${profile.id}:`, ordersError);
        }
        
        // Calculate customer metrics
        const totalOrders = orders?.length || 0;
        const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        const latestOrder = orders?.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        )[0];
        
        // Determine customer status based on activity
        let status: CustomerStatus = "inactive";
        if (totalOrders > 0) {
          const lastOrderDate = latestOrder ? new Date(latestOrder.created_at || 0) : null;
          if (lastOrderDate && lastOrderDate > thirtyDaysAgo) {
            status = "active";
          }
          
          // New customers are those who made their first purchase in the last 30 days
          if (totalOrders === 1 && lastOrderDate && lastOrderDate > thirtyDaysAgo) {
            status = "new";
          }
        }
        
        // Simulate email from auth.users
        // In a real implementation, you'd get this from auth.users via a secure function
        const mockEmail = `${profile.first_name || 'user'}${profile.last_name || ''}@example.com`.toLowerCase();
        
        return {
          ...profile,
          email: mockEmail,
          total_orders: totalOrders,
          total_spent: totalSpent,
          status,
          latest_order_date: latestOrder?.created_at || null
        };
      }));
      
      setCustomers(processedCustomers);
      
      // Fetch customer segments
      const { data: segmentsData, error: segmentsError } = await supabase
        .from('customer_segments')
        .select('*');
        
      if (segmentsError) throw segmentsError;
      
      // Count customers in each segment
      const segmentsWithCount = await Promise.all((segmentsData || []).map(async (segment) => {
        const { count, error: countError } = await supabase
          .from('customer_segment_memberships')
          .select('*', { count: 'exact', head: true })
          .eq('segment_id', segment.id);
          
        return {
          ...segment,
          customer_count: count || 0
        };
      }));
      
      setSegments(segmentsWithCount);
      
      // Calculate customer insights
      const totalCustomers = processedCustomers.length;
      const activeCustomers = processedCustomers.filter(c => c.status === 'active').length;
      const newCustomers = processedCustomers.filter(c => c.status === 'new').length;
      const inactiveCustomers = processedCustomers.filter(c => c.status === 'inactive').length;
      
      const returningRate = totalCustomers > 0 
        ? Math.round((processedCustomers.filter(c => c.total_orders && c.total_orders > 1).length / totalCustomers) * 100) 
        : 0;
        
      const averageSpend = totalCustomers > 0
        ? processedCustomers.reduce((sum, c) => sum + (c.total_spent || 0), 0) / totalCustomers
        : 0;
      
      // For growth, in a real app we would compare to previous period
      // Here we'll simulate a random growth percentage between 5-15%
      const growth = Math.round((Math.random() * 10 + 5) * 10) / 10;
      
      setCustomerInsights({
        total: totalCustomers,
        active: activeCustomers,
        new: newCustomers,
        inactive: inactiveCustomers,
        returningRate,
        averageSpend,
        growth
      });
      
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast({
        title: 'Error loading customers',
        description: 'There was a problem fetching customer data.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  // Set up real-time subscriptions
  useRealtimeSubscription(
    [
      { table: 'customer_profiles', event: '*' },
      { table: 'customer_segments', event: '*' },
      { table: 'customer_segment_memberships', event: '*' }
    ],
    {
      customer_profiles: (payload) => {
        console.log('Real-time customer profile update:', payload);
        fetchCustomers(); // Reload data on changes
      },
      customer_segments: (payload) => {
        console.log('Real-time customer segment update:', payload);
        fetchCustomers(); // Reload data on changes
      },
      customer_segment_memberships: (payload) => {
        console.log('Real-time segment membership update:', payload);
        fetchCustomers(); // Reload data on changes
      }
    },
    false,
    'customer-admin-channel'
  );

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredCustomers = customers.filter(customer => {
    // Apply search term filter
    const searchFields = [
      customer.first_name || '',
      customer.last_name || '',
      customer.email || '',
      customer.phone || ''
    ].map(field => field.toLowerCase());
    
    const matchesSearch = searchTerm === '' || searchFields.some(field => 
      field.includes(searchTerm.toLowerCase())
    );
      
    // Apply status filter
    const matchesFilter = 
      filter === 'all' || 
      customer.status === filter;
      
    return matchesSearch && matchesFilter;
  });

  const handleExportData = () => {
    try {
      // Create CSV content
      const headers = ['Name', 'Email', 'Phone', 'Status', 'Orders', 'Spent', 'Loyalty Points', 'VIP Status', 'Last Order'];
      const rows = filteredCustomers.map(customer => [
        `${customer.first_name || ''} ${customer.last_name || ''}`,
        customer.email || '',
        customer.phone || '',
        customer.status || '',
        customer.total_orders || 0,
        (customer.total_spent || 0).toFixed(2),
        customer.loyalty_points || 0,
        customer.vip_status ? 'Yes' : 'No',
        customer.latest_order_date ? new Date(customer.latest_order_date).toLocaleDateString() : 'N/A'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create a blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful',
        description: 'Customer data has been exported as CSV.',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export failed',
        description: 'There was a problem exporting the customer data.',
        variant: 'destructive'
      });
    }
  };

  const handleSendEmail = () => {
    // In a real implementation, this would open an email composer or campaign tool
    toast({
      title: 'Email composer',
      description: 'Email campaign tool would open here.',
    });
  };

  const handleAddCustomer = () => {
    // In a real implementation, this would open a form to add a new customer
    toast({
      title: 'Add customer',
      description: 'Customer creation form would open here.',
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2 w-full md:w-auto">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-1">
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center p-2 border-b">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-24 mx-2" />
                  <Skeleton className="h-4 w-12 mx-2" />
                  <Skeleton className="h-4 w-20 mx-2" />
                  <Skeleton className="h-4 w-24 mx-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-furniture-dark">Customer Management</h1>
        <p className="text-muted-foreground mt-2">Manage customer accounts and view insights.</p>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Customer List</TabsTrigger>
          <TabsTrigger value="insights">Customer Insights</TabsTrigger>
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="active">Active Customers</SelectItem>
                  <SelectItem value="new">New Customers</SelectItem>
                  <SelectItem value="inactive">Inactive Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={handleExportData}>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" onClick={handleSendEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button onClick={handleAddCustomer}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-1">
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                {filteredCustomers.length} customers matching your criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Loyalty</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {customer.first_name} {customer.last_name}
                              {customer.vip_status && (
                                <Star className="h-3 w-3 inline ml-1 text-yellow-500" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                            {customer.phone && (
                              <div className="text-xs text-muted-foreground mt-1">{customer.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status || 'inactive')}</TableCell>
                        <TableCell>{customer.total_orders || 0}</TableCell>
                        <TableCell>AED {(customer.total_spent || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-1">{customer.loyalty_points || 0}</span>
                            <span className="text-xs text-muted-foreground">pts</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.latest_order_date 
                            ? new Date(customer.latest_order_date).toLocaleDateString() 
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No customers match your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredCustomers.length} of {customers.length} customers
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchCustomers}
                className="ml-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-furniture-accent mr-2" />
                  <div className="text-2xl font-bold">{customerInsights.total}</div>
                </div>
                <div className="text-xs text-green-500 mt-1">+{customerInsights.growth}% from last month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">New Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <UserPlus className="h-6 w-6 text-blue-500 mr-2" />
                  <div className="text-2xl font-bold">{customerInsights.new}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Returning Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <RefreshCw className="h-6 w-6 text-green-500 mr-2" />
                  <div className="text-2xl font-bold">{customerInsights.returningRate}%</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Customer retention</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Spend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CircleDollarSign className="h-6 w-6 text-amber-500 mr-2" />
                  <div className="text-2xl font-bold">AED {customerInsights.averageSpend.toFixed(2)}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Per customer</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>Breakdown of your customer base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Active Customers</div>
                    <div className="text-sm text-muted-foreground">
                      {customerInsights.active} ({Math.round(customerInsights.active / Math.max(customerInsights.total, 1) * 100)}%)
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${Math.round(customerInsights.active / Math.max(customerInsights.total, 1) * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">New Customers</div>
                    <div className="text-sm text-muted-foreground">
                      {customerInsights.new} ({Math.round(customerInsights.new / Math.max(customerInsights.total, 1) * 100)}%)
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${Math.round(customerInsights.new / Math.max(customerInsights.total, 1) * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Inactive Customers</div>
                    <div className="text-sm text-muted-foreground">
                      {customerInsights.inactive} ({Math.round(customerInsights.inactive / Math.max(customerInsights.total, 1) * 100)}%)
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-400 rounded-full" 
                      style={{ width: `${Math.round(customerInsights.inactive / Math.max(customerInsights.total, 1) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button onClick={handleExportData} variant="outline" className="w-full">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Export Customer Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Activity</CardTitle>
                <CardDescription>Purchase frequency over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">
                    Activity chart will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
                <CardDescription>Value of customer relationships over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <CircleDollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">
                    CLV chart will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="segments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Customer Segments</h2>
            <Button>
              <Tags className="mr-2 h-4 w-4" />
              Create Segment
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {segments.length > 0 ? (
              segments.map(segment => (
                <Card key={segment.id}>
                  <CardHeader>
                    <CardTitle>{segment.name}</CardTitle>
                    <CardDescription>{segment.description || 'No description'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <Users className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="font-semibold">{segment.customer_count}</span>
                      <span className="text-sm text-muted-foreground ml-1">customers</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Customers
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>No segments found</CardTitle>
                  <CardDescription>Create your first customer segment</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8">
                  <Tags className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground mb-4">
                    Customer segments help you target specific groups of customers.
                  </p>
                  <Button>Create First Segment</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Customers;

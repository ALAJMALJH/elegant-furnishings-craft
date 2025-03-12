
import React, { useState } from 'react';
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
  Users 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CustomerStatus = "active" | "new" | "inactive";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  status: CustomerStatus;
  lastOrder: string;
}

// Mock data for customer insights
const customerInsights = {
  total: 256,
  active: 173,
  new: 48,
  inactive: 35,
  returningRate: 68,
  averageSpend: 245.89,
  growth: 12.4
};

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  
  // Mock data for customers
  const customers: Customer[] = [
    { id: '1', name: 'James Wilson', email: 'james.wilson@example.com', phone: '+1 (555) 123-4567', orders: 5, totalSpent: 1250.50, status: "active", lastOrder: '2023-10-15' },
    { id: '2', name: 'Emily Carter', email: 'emily.carter@example.com', phone: '+1 (555) 234-5678', orders: 3, totalSpent: 780.25, status: "active", lastOrder: '2023-10-12' },
    { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com', phone: '+1 (555) 345-6789', orders: 1, totalSpent: 150.00, status: "new", lastOrder: '2023-10-09' },
    { id: '4', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', phone: '+1 (555) 456-7890', orders: 0, totalSpent: 0, status: "inactive", lastOrder: 'N/A' },
    { id: '5', name: 'David Lee', email: 'david.lee@example.com', phone: '+1 (555) 567-8901', orders: 7, totalSpent: 2340.75, status: "active", lastOrder: '2023-10-17' },
    { id: '6', name: 'Jessica Smith', email: 'jessica.smith@example.com', phone: '+1 (555) 678-9012', orders: 2, totalSpent: 420.30, status: "active", lastOrder: '2023-10-05' },
    { id: '7', name: 'Ryan Taylor', email: 'ryan.taylor@example.com', phone: '+1 (555) 789-0123', orders: 0, totalSpent: 0, status: "inactive", lastOrder: 'N/A' },
    { id: '8', name: 'Amanda Miller', email: 'amanda.miller@example.com', phone: '+1 (555) 890-1234', orders: 1, totalSpent: 89.99, status: "new", lastOrder: '2023-10-18' },
  ] as const;

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
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
      
    // Apply status filter
    const matchesFilter = 
      filter === 'all' || 
      customer.status === filter;
      
    return matchesSearch && matchesFilter;
  });

  const handleExportData = () => {
    // In a real implementation, this would generate a CSV or Excel file
    alert('Customer data export started. The file will be downloaded shortly.');
  };

  const handleSendEmail = () => {
    // In a real implementation, this would open an email composer
    alert('Email composer opened. You can now send a message to selected customers.');
  };

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
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-1">
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Manage your customer list and their information.
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
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>{customer.orders}</TableCell>
                        <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>{customer.lastOrder !== 'N/A' ? new Date(customer.lastOrder).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No customers match your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="text-sm text-muted-foreground">{customerInsights.active} ({Math.round(customerInsights.active / customerInsights.total * 100)}%)</div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${Math.round(customerInsights.active / customerInsights.total * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">New Customers</div>
                    <div className="text-sm text-muted-foreground">{customerInsights.new} ({Math.round(customerInsights.new / customerInsights.total * 100)}%)</div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${Math.round(customerInsights.new / customerInsights.total * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Inactive Customers</div>
                    <div className="text-sm text-muted-foreground">{customerInsights.inactive} ({Math.round(customerInsights.inactive / customerInsights.total * 100)}%)</div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-400 rounded-full" 
                      style={{ width: `${Math.round(customerInsights.inactive / customerInsights.total * 100)}%` }}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Customers;

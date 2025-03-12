
import React, { useState } from 'react';
import { Mail, Phone, User, MessageSquare, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

// Mock customer data (would be fetched from Supabase in a real implementation)
const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'Ahmed Al-Mansouri',
    email: 'ahmed@example.com',
    phone: '+971 50 123 4567',
    orders: 8,
    totalSpent: 12450,
    status: 'active',
    lastOrder: '2023-07-15T08:30:00Z',
  },
  {
    id: '2',
    name: 'Fatima Al-Hashimi',
    email: 'fatima@example.com',
    phone: '+971 55 987 6543',
    orders: 3,
    totalSpent: 4250,
    status: 'active',
    lastOrder: '2023-08-02T14:45:00Z',
  },
  {
    id: '3',
    name: 'Mohammed Al-Farsi',
    email: 'mohammed@example.com',
    phone: '+971 54 555 7890',
    orders: 1,
    totalSpent: 1850,
    status: 'new',
    lastOrder: '2023-08-10T11:20:00Z',
  },
  {
    id: '4',
    name: 'Sara Al-Zaabi',
    email: 'sara@example.com',
    phone: '+971 52 444 3210',
    orders: 5,
    totalSpent: 7320,
    status: 'active',
    lastOrder: '2023-07-28T09:15:00Z',
  },
  {
    id: '5',
    name: 'Khalid Al-Mazrouei',
    email: 'khalid@example.com',
    phone: '+971 56 222 1098',
    orders: 2,
    totalSpent: 3450,
    status: 'inactive',
    lastOrder: '2023-06-20T16:30:00Z',
  },
];

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'new';
  lastOrder: string;
}

const Customers: React.FC = () => {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    new: 'bg-blue-100 text-blue-800',
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-furniture-dark">Customer Management</h1>
      <p className="text-muted-foreground mt-2">View and manage your customer accounts.</p>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            Export
          </Button>
          <Button>
            Add Customer
          </Button>
        </div>
      </div>
      
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter(c => c.status === 'active').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Customers (30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter(c => c.status === 'new').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {Math.round(customers.reduce((acc, curr) => acc + curr.totalSpent, 0) / 
                             customers.reduce((acc, curr) => acc + curr.orders, 0))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Customer List</CardTitle>
            <CardDescription>
              {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3 w-3" /> {customer.email}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Phone className="h-3 w-3" /> {customer.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[customer.status]}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>AED {customer.totalSpent.toLocaleString()}</TableCell>
                      <TableCell>{formatDate(customer.lastOrder)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                            <span className="sr-only">Contact</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No customers found matching your search.</p>
                <Button onClick={() => setSearchQuery('')} variant="outline" className="mt-4">
                  Clear Search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Customers;

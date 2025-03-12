
import React, { useState, useEffect } from 'react';
import { Package, Phone, Calendar, Users, ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';
import WhatsAppOrderManagement from '@/components/Admin/WhatsAppOrderManagement';
import OrderTable, { Order, OrderItem } from '@/components/Admin/Sales/OrderTable';
import CustomerTable, { Customer } from '@/components/Admin/Sales/CustomerTable';
import AbandonedCartTable, { AbandonedCart } from '@/components/Admin/Sales/AbandonedCartTable';
import OrderSearch from '@/components/Admin/Sales/OrderSearch';
import { supabase } from '@/integrations/supabase/client';
import { useAdminRealtime } from '@/contexts/AdminRealtimeContext';

// Mock data - will be replaced with Supabase data
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2023-001',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    date: '2023-06-15',
    status: 'processing',
    total: 1299.99,
    items: [
      { id: '1', productName: 'Modern Wooden Sofa', quantity: 1, price: 899.99 },
      { id: '2', productName: 'Coffee Table', quantity: 1, price: 400.00 },
    ],
  },
  {
    id: '2',
    orderNumber: 'ORD-2023-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    date: '2023-06-14',
    status: 'shipped',
    total: 749.99,
    items: [
      { id: '3', productName: 'Elegant Dining Table', quantity: 1, price: 749.99 },
    ],
  },
  {
    id: '3',
    orderNumber: 'ORD-2023-003',
    customerName: 'Michael Brown',
    customerEmail: 'michael@example.com',
    date: '2023-06-10',
    status: 'delivered',
    total: 1599.97,
    items: [
      { id: '4', productName: 'Minimalist Office Chair', quantity: 3, price: 533.32 },
    ],
  },
  {
    id: '4',
    orderNumber: 'ORD-2023-004',
    customerName: 'Emily Davis',
    customerEmail: 'emily@example.com',
    date: '2023-06-05',
    status: 'cancelled',
    total: 999.99,
    items: [
      { id: '5', productName: 'Luxurious Bed Frame', quantity: 1, price: 999.99 },
    ],
  },
  {
    id: '5',
    orderNumber: 'ORD-2023-005',
    customerName: 'David Wilson',
    customerEmail: 'david@example.com',
    date: '2023-06-01',
    status: 'refunded',
    total: 449.98,
    items: [
      { id: '6', productName: 'Bedside Table', quantity: 2, price: 224.99 },
    ],
  },
];

// Mock data for customers
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    totalOrders: 3,
    totalSpent: 2499.97,
    lastOrderDate: '2023-06-15',
    isVip: true,
    loyaltyPoints: 250,
    segment: 'vip',
    orders: [MOCK_ORDERS[0]]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    totalOrders: 1,
    totalSpent: 749.99,
    lastOrderDate: '2023-06-14',
    isVip: false,
    loyaltyPoints: 75,
    segment: 'new',
    orders: [MOCK_ORDERS[1]]
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    totalOrders: 4,
    totalSpent: 3299.94,
    lastOrderDate: '2023-06-10',
    isVip: true,
    loyaltyPoints: 330,
    segment: 'returning',
    orders: [MOCK_ORDERS[2]]
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    totalOrders: 2,
    totalSpent: 999.99,
    lastOrderDate: '2023-06-05',
    isVip: false,
    loyaltyPoints: 100,
    segment: 'at-risk',
    orders: [MOCK_ORDERS[3]]
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@example.com',
    totalOrders: 1,
    totalSpent: 449.98,
    lastOrderDate: '2023-06-01',
    isVip: false,
    loyaltyPoints: 45,
    segment: 'at-risk',
    orders: [MOCK_ORDERS[4]]
  }
];

// Mock abandoned carts
const MOCK_ABANDONED_CARTS: AbandonedCart[] = [
  {
    id: '1',
    customerEmail: 'alex@example.com',
    lastActive: '2023-06-20T15:30:00Z',
    items: [
      { id: '7', name: 'Leather Armchair', price: 899.99, quantity: 1, image_url: '/placeholder.svg' },
      { id: '8', name: 'Floor Lamp', price: 149.99, quantity: 1, image_url: '/placeholder.svg' }
    ],
    total: 1049.98,
    notificationSent: false,
    recoveryLink: 'https://furniture-store.com/recover-cart?id=cart_123456'
  },
  {
    id: '2',
    customerEmail: 'rebecca@example.com',
    lastActive: '2023-06-19T12:45:00Z',
    items: [
      { id: '9', name: 'Dining Chair Set (4)', price: 599.99, quantity: 1, image_url: '/placeholder.svg' }
    ],
    total: 599.99,
    notificationSent: true,
    recoveryLink: 'https://furniture-store.com/recover-cart?id=cart_789012'
  },
  {
    id: '3',
    customerEmail: 'james@example.com',
    lastActive: '2023-06-18T09:15:00Z',
    items: [
      { id: '10', name: 'King Size Mattress', price: 1299.99, quantity: 1, image_url: '/placeholder.svg' },
      { id: '11', name: 'Bedside Tables (Pair)', price: 349.99, quantity: 1, image_url: '/placeholder.svg' },
      { id: '12', name: 'Bedroom Lamps (Set of 2)', price: 129.99, quantity: 1, image_url: '/placeholder.svg' }
    ],
    total: 1779.97,
    notificationSent: false,
    recoveryLink: 'https://furniture-store.com/recover-cart?id=cart_345678'
  }
];

const Sales: React.FC = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState('orders');
  
  // State for orders
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderDateRange, setOrderDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  
  // State for customers
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerSegmentFilter, setCustomerSegmentFilter] = useState<string>('all');
  
  // State for abandoned carts
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>(MOCK_ABANDONED_CARTS);

  // Use the admin realtime context
  const { realtimeEnabled, refreshData } = useAdminRealtime();
  
  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(orderSearchTerm.toLowerCase());
      
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    
    const matchesDate = !orderDateRange.from || (() => {
      const orderDate = new Date(order.date);
      const from = orderDateRange.from;
      const to = orderDateRange.to || orderDateRange.from;
      
      return orderDate >= from && orderDate <= to;
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase());
      
    const matchesSegment = customerSegmentFilter === 'all' || customer.segment === customerSegmentFilter;
    
    return matchesSearch && matchesSegment;
  });
  
  // Clear order filters
  const clearOrderFilters = () => {
    setOrderSearchTerm('');
    setOrderStatusFilter('all');
    setOrderDateRange({ from: undefined, to: undefined });
  };
  
  // Clear customer filters
  const clearCustomerFilters = () => {
    setCustomerSearchTerm('');
    setCustomerSegmentFilter('all');
  };
  
  // Fetch real data from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id, 
            order_number,
            customer_name,
            customer_email,
            created_at,
            status,
            total_amount,
            order_items (
              id,
              product_id,
              quantity,
              unit_price,
              products (name)
            )
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Format the data to match our Order type
          const formattedOrders = data.map(order => ({
            id: order.id,
            orderNumber: order.order_number,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            date: new Date(order.created_at).toISOString().split('T')[0],
            status: order.status as Order['status'],
            total: order.total_amount,
            items: order.order_items.map((item: any) => ({
              id: item.id,
              productName: item.products ? item.products.name : `Product ${item.product_id}`,
              quantity: item.quantity,
              price: item.unit_price
            }))
          }));
          
          // Use mock data for now, but later we'll use real data
          // setOrders(formattedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Failed to fetch orders',
          description: 'There was an error loading the order data.',
          variant: 'destructive',
        });
      }
    };
    
    // Only fetch if realtime is disabled, otherwise rely on the realtime updates
    if (!realtimeEnabled) {
      fetchOrders();
    }
  }, [realtimeEnabled]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-furniture-dark">Sales Management</h1>
        <p className="text-muted-foreground mt-2">Manage orders, customers, and transactions.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <TabsTrigger value="orders" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Customers</span>
          </TabsTrigger>
          <TabsTrigger value="abandoned" className="flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Abandoned Carts</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-6">
          <div className="mb-6">
            <OrderSearch 
              searchTerm={orderSearchTerm}
              setSearchTerm={setOrderSearchTerm}
              statusFilter={orderStatusFilter}
              setStatusFilter={setOrderStatusFilter}
              dateRange={orderDateRange}
              setDateRange={setOrderDateRange}
              clearFilters={clearOrderFilters}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable orders={filteredOrders} setOrders={setOrders} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customers Tab */}
        <TabsContent value="customers" className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search customers..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={customerSegmentFilter}
                onChange={(e) => setCustomerSegmentFilter(e.target.value)}
              >
                <option value="all">All Segments</option>
                <option value="new">New Customers</option>
                <option value="returning">Returning</option>
                <option value="vip">VIP</option>
                <option value="at-risk">At Risk</option>
              </select>
            </div>
            
            <Button variant="ghost" onClick={clearCustomerFilters}>
              Clear filters
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerTable customers={filteredCustomers} setCustomers={setCustomers} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Abandoned Carts Tab */}
        <TabsContent value="abandoned" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Abandoned Cart Recovery</CardTitle>
              <CardDescription>
                Manage and recover abandoned shopping carts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AbandonedCartTable carts={abandonedCarts} setCarts={setAbandonedCarts} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* WhatsApp Tab */}
        <TabsContent value="whatsapp" className="mt-6">
          <WhatsAppOrderManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;


import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowUpDown,
  Eye, 
  Edit, 
  Trash,
  CheckCircle,
  XCircle,
  TruckIcon,
  Phone 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';
import WhatsAppOrderManagement from '@/components/Admin/WhatsAppOrderManagement';

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: {
    id: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

// Mock data for demonstration
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

const Sales: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('regular');
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus } 
        : order
    ));
    
    toast({
      title: "Order status updated",
      description: `Order ${orders.find(o => o.id === orderId)?.orderNumber} status changed to ${newStatus}`,
    });
  };
  
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'processing': return 'text-blue-500 bg-blue-50';
      case 'shipped': return 'text-yellow-500 bg-yellow-50';
      case 'delivered': return 'text-green-500 bg-green-50';
      case 'cancelled': return 'text-red-500 bg-red-50';
      case 'refunded': return 'text-purple-500 bg-purple-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-furniture-dark">Sales Management</h1>
        <p className="text-muted-foreground mt-2">Manage orders and transactions.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="regular" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Regular Orders</span>
            <span className="sm:hidden">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp Orders</span>
            <span className="sm:hidden">WhatsApp</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="regular" className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">AED {order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setCurrentOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Order Details - {currentOrder?.orderNumber}</DialogTitle>
                              <DialogDescription>
                                View and manage order information
                              </DialogDescription>
                            </DialogHeader>
                            
                            {currentOrder && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer Information</h3>
                                    <p className="font-medium">{currentOrder.customerName}</p>
                                    <p className="text-sm">{currentOrder.customerEmail}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Information</h3>
                                    <p className="font-medium">Date: {currentOrder.date}</p>
                                    <p className="font-medium">Status: 
                                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(currentOrder.status)}`}>
                                        {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Order Items</h3>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {currentOrder.items.map((item) => (
                                        <TableRow key={item.id}>
                                          <TableCell className="font-medium">{item.productName}</TableCell>
                                          <TableCell className="text-center">{item.quantity}</TableCell>
                                          <TableCell className="text-right">AED {item.price.toFixed(2)}</TableCell>
                                          <TableCell className="text-right">AED {(item.price * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                                
                                <div className="flex justify-between items-center pt-4 border-t">
                                  <div className="text-lg font-bold">Total: AED {currentOrder.total.toFixed(2)}</div>
                                  <div>
                                    <Select 
                                      defaultValue={currentOrder.status}
                                      onValueChange={(value: OrderStatus) => handleStatusUpdate(currentOrder.id, value)}
                                    >
                                      <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Update status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter className="mt-6">
                              <DialogClose asChild>
                                <Button type="button" variant="outline">Close</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ArrowUpDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {order.status === 'processing' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'shipped')}>
                                <TruckIcon className="mr-2 h-4 w-4" />
                                Mark as Shipped
                              </DropdownMenuItem>
                            )}
                            {order.status === 'shipped' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'delivered')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Delivered
                              </DropdownMenuItem>
                            )}
                            {(order.status === 'processing' || order.status === 'shipped') && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'cancelled')}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}
                            {order.status !== 'refunded' && order.status !== 'processing' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'refunded')}>
                                <Trash className="mr-2 h-4 w-4" />
                                Process Refund
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="whatsapp" className="mt-6">
          <WhatsAppOrderManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;

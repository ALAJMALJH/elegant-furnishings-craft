import React, { useState, useEffect } from 'react';
import { 
  ArrowUpDown,
  Eye, 
  Check,
  X,
  Phone,
  DollarSign,
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
  CardFooter,
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
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { Json } from '@/integrations/supabase/types';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartData {
  items: CartItem[];
  total: number;
}

interface WhatsAppOrder {
  id: string;
  customer_phone: string;
  cart_data: CartData;
  status: 'pending' | 'approved' | 'rejected';
  final_price: number | null;
  created_at: string;
  updated_at: string;
}

interface RawWhatsAppOrderData {
  id: string;
  customer_phone: string | null;
  cart_data: Json;
  status: string;
  final_price: number | null;
  created_at: string | null;
  updated_at: string | null;
}

const WhatsAppOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<WhatsAppOrder[]>([]);
  const [currentOrder, setCurrentOrder] = useState<WhatsAppOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const transformedOrders: WhatsAppOrder[] = (data as RawWhatsAppOrderData[]).map(order => ({
        id: order.id,
        customer_phone: order.customer_phone || '',
        cart_data: order.cart_data as unknown as CartData,
        status: order.status as 'pending' | 'approved' | 'rejected',
        final_price: order.final_price,
        created_at: order.created_at || new Date().toISOString(),
        updated_at: order.updated_at || new Date().toISOString()
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching WhatsApp orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load WhatsApp orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  useRealtimeSubscription(
    [{ table: 'whatsapp_orders', event: '*' }],
    {
      whatsapp_orders: () => {
        fetchOrders();
      }
    },
    true
  );
  
  const updateOrderStatus = async (orderId: string, status: 'approved' | 'rejected', price?: number) => {
    try {
      const updates = { 
        status, 
        ...(status === 'approved' && price ? { final_price: price } : {})
      };
      
      const { error } = await supabase
        .from('whatsapp_orders')
        .update(updates)
        .eq('id', orderId);
        
      if (error) throw error;
      
      toast({
        title: `Order ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The order has been ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status, ...(status === 'approved' && price ? { final_price: price } : {}) } : order
      ));
      
      setFinalPrice('');
    } catch (error) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} order:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${status === 'approved' ? 'approve' : 'reject'} the order`,
        variant: 'destructive',
      });
    }
  };
  
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = order.customer_phone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const handleApprove = () => {
    if (!currentOrder) return;
    
    const price = parseFloat(finalPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return;
    }
    
    updateOrderStatus(currentOrder.id, 'approved', price);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-furniture-dark">WhatsApp Order Management</h2>
        <p className="text-muted-foreground mt-1">
          View and manage orders submitted via WhatsApp
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by phone number..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Orders</CardTitle>
          <CardDescription>
            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No WhatsApp orders found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Phone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Initial Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Final Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.customer_phone}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>{order.cart_data.items.length}</TableCell>
                    <TableCell>AED {order.cart_data.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {order.final_price ? `AED ${order.final_price.toFixed(2)}` : '-'}
                    </TableCell>
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
                          {currentOrder && (
                            <>
                              <DialogHeader>
                                <DialogTitle>WhatsApp Order Details</DialogTitle>
                                <DialogDescription>
                                  Order from {currentOrder.customer_phone} on {formatDate(currentOrder.created_at)}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-6 py-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentOrder.status)}`}>
                                      {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                                    </span>
                                  </div>
                                  
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                                    <p>{formatDate(currentOrder.created_at)}</p>
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
                                      {currentOrder.cart_data.items.map((item) => (
                                        <TableRow key={item.id}>
                                          <TableCell>
                                            <div className="flex items-center space-x-3">
                                              <img 
                                                src={item.image_url} 
                                                alt={item.name} 
                                                className="h-10 w-10 rounded object-cover"
                                              />
                                              <span className="font-medium">{item.name}</span>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-center">{item.quantity}</TableCell>
                                          <TableCell className="text-right">AED {item.price.toFixed(2)}</TableCell>
                                          <TableCell className="text-right">AED {(item.price * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                                
                                <div className="flex justify-between items-center pt-4 border-t">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Initial Total</p>
                                    <p className="text-lg font-bold">AED {currentOrder.cart_data.total.toFixed(2)}</p>
                                  </div>
                                  
                                  {currentOrder.status === 'approved' && currentOrder.final_price && (
                                    <div className="text-right">
                                      <p className="text-sm text-muted-foreground">Final Price</p>
                                      <p className="text-lg font-bold text-green-600">AED {currentOrder.final_price.toFixed(2)}</p>
                                    </div>
                                  )}
                                </div>
                                
                                {currentOrder.status === 'pending' && (
                                  <div className="space-y-4 pt-4 border-t">
                                    <h3 className="font-medium">Approve Order with Final Price</h3>
                                    <div className="flex items-center space-x-2">
                                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                                      <Input
                                        type="number"
                                        placeholder="Enter final price"
                                        value={finalPrice}
                                        onChange={(e) => setFinalPrice(e.target.value)}
                                      />
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                      <Button
                                        onClick={handleApprove}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        disabled={!finalPrice}
                                      >
                                        <Check className="mr-2 h-4 w-4" />
                                        Approve Order
                                      </Button>
                                      
                                      <Button
                                        onClick={() => updateOrderStatus(currentOrder.id, 'rejected')}
                                        variant="destructive"
                                        className="flex-1"
                                      >
                                        <X className="mr-2 h-4 w-4" />
                                        Reject Order
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <DialogFooter>
                                <a
                                  href={`https://wa.me/${currentOrder.customer_phone.replace(/\+/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mr-auto"
                                >
                                  <Button variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Chat with Customer
                                  </Button>
                                </a>
                                
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">Close</Button>
                                </DialogClose>
                              </DialogFooter>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {order.status === 'pending' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ArrowUpDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setCurrentOrder(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateOrderStatus(order.id, 'rejected')}
                              className="text-red-600"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppOrderManagement;


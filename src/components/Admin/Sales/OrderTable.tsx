
import React from 'react';
import { 
  Eye, 
  ArrowUpDown,
  CheckCircle,
  XCircle,
  TruckIcon,
  Trash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total: number;
  items: OrderItem[];
}

interface OrderTableProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, setOrders }) => {
  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
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
  
  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'processing': return 'text-blue-500 bg-blue-50';
      case 'shipped': return 'text-yellow-500 bg-yellow-50';
      case 'delivered': return 'text-green-500 bg-green-50';
      case 'cancelled': return 'text-red-500 bg-red-50';
      case 'refunded': return 'text-purple-500 bg-purple-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const [currentOrder, setCurrentOrder] = React.useState<Order | null>(null);

  return (
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
        {orders.map((order) => (
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
                            onValueChange={(value: Order['status']) => handleStatusUpdate(currentOrder.id, value)}
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
  );
};

export default OrderTable;

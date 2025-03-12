
import React from 'react';
import { format } from 'date-fns';
import { User, Eye, Badge, Clock } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge as UIBadge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from './OrderTable';

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  isVip: boolean;
  loyaltyPoints: number;
  segment: 'new' | 'returning' | 'vip' | 'at-risk';
  orders: Order[];
}

interface CustomerTableProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, setCustomers }) => {
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  
  const toggleVipStatus = (customerId: string) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === customerId 
        ? { ...customer, isVip: !customer.isVip } 
        : customer
    );
    
    setCustomers(updatedCustomers);
    
    const customer = customers.find(c => c.id === customerId);
    const newStatus = !customer?.isVip;
    
    toast({
      title: `${newStatus ? 'Added to' : 'Removed from'} VIP program`,
      description: `${customer?.name} has been ${newStatus ? 'added to' : 'removed from'} the VIP customer program.`,
    });
  };
  
  const getSegmentBadge = (segment: Customer['segment']) => {
    switch (segment) {
      case 'new':
        return <UIBadge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</UIBadge>;
      case 'returning':
        return <UIBadge variant="outline" className="bg-green-50 text-green-700 border-green-200">Returning</UIBadge>;
      case 'vip':
        return <UIBadge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">VIP</UIBadge>;
      case 'at-risk':
        return <UIBadge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">At Risk</UIBadge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Segment</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Last Order</TableHead>
            <TableHead>VIP Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-muted-foreground">{customer.email}</div>
              </TableCell>
              <TableCell>{getSegmentBadge(customer.segment)}</TableCell>
              <TableCell>{customer.totalOrders}</TableCell>
              <TableCell>AED {customer.totalSpent.toFixed(2)}</TableCell>
              <TableCell>
                {customer.lastOrderDate ? format(new Date(customer.lastOrderDate), 'dd MMM yyyy') : 'Never'}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id={`vip-${customer.id}`} 
                    checked={customer.isVip} 
                    onCheckedChange={() => toggleVipStatus(customer.id)} 
                  />
                  <Label htmlFor={`vip-${customer.id}`} className="text-sm">
                    {customer.isVip ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    {selectedCustomer && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Customer Profile</DialogTitle>
                          <DialogDescription>
                            Detailed information about {selectedCustomer.name}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center">
                                  <User className="h-4 w-4 mr-1" /> Customer
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <h3 className="text-lg font-bold">{selectedCustomer.name}</h3>
                                <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center">
                                  <Badge className="h-4 w-4 mr-1" /> Loyalty
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <h3 className="text-lg font-bold">{selectedCustomer.loyaltyPoints} points</h3>
                                <div className="flex items-center mt-1">
                                  <Switch 
                                    id="customer-detail-vip" 
                                    checked={selectedCustomer.isVip} 
                                    onCheckedChange={() => toggleVipStatus(selectedCustomer.id)} 
                                  />
                                  <Label htmlFor="customer-detail-vip" className="ml-2 text-sm">
                                    VIP Status
                                  </Label>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center">
                                  <Clock className="h-4 w-4 mr-1" /> Activity
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <h3 className="text-lg font-bold">{selectedCustomer.totalOrders} orders</h3>
                                <p className="text-sm text-muted-foreground">
                                  Last order: {selectedCustomer.lastOrderDate 
                                    ? format(new Date(selectedCustomer.lastOrderDate), 'dd MMM yyyy')
                                    : 'Never'}
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Order History</h3>
                            {selectedCustomer.orders.length > 0 ? (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Order #</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedCustomer.orders.map(order => (
                                    <TableRow key={order.id}>
                                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                      <TableCell>{order.date}</TableCell>
                                      <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          order.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                                          order.status === 'shipped' ? 'bg-yellow-50 text-yellow-700' :
                                          order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                                          order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                          'bg-purple-50 text-purple-700'
                                        }`}>
                                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-right">AED {order.total.toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <p className="text-muted-foreground">No order history available.</p>
                            )}
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                          <Button variant="default">Edit Profile</Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CustomerTable;

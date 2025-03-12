
import React from 'react';
import { format } from 'date-fns';
import { ShoppingCart, Send, Eye, ExternalLink } from 'lucide-react';
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
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '@/components/Cart/CartContext';

export interface AbandonedCart {
  id: string;
  customerEmail: string;
  lastActive: string;
  items: CartItem[];
  total: number;
  notificationSent: boolean;
  recoveryLink: string;
}

interface AbandonedCartTableProps {
  carts: AbandonedCart[];
  setCarts: React.Dispatch<React.SetStateAction<AbandonedCart[]>>;
}

const AbandonedCartTable: React.FC<AbandonedCartTableProps> = ({ carts, setCarts }) => {
  const [selectedCart, setSelectedCart] = React.useState<AbandonedCart | null>(null);
  
  const sendRecoveryEmail = (cartId: string) => {
    setCarts(carts.map(cart => 
      cart.id === cartId 
        ? { ...cart, notificationSent: true } 
        : cart
    ));
    
    toast({
      title: "Recovery email sent",
      description: "The customer has been notified about their abandoned cart.",
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carts.map((cart) => (
            <TableRow key={cart.id}>
              <TableCell className="font-medium">{cart.customerEmail}</TableCell>
              <TableCell>{format(new Date(cart.lastActive), 'dd MMM yyyy, HH:mm')}</TableCell>
              <TableCell>{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</TableCell>
              <TableCell>AED {cart.total.toFixed(2)}</TableCell>
              <TableCell>
                {cart.notificationSent ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Notified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedCart(cart)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      {selectedCart && (
                        <>
                          <DialogHeader>
                            <DialogTitle>Abandoned Cart Details</DialogTitle>
                            <DialogDescription>
                              {selectedCart.customerEmail}'s cart from {format(new Date(selectedCart.lastActive), 'dd MMM yyyy, HH:mm')}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="py-4">
                            <h3 className="font-medium mb-2">Cart Items</h3>
                            <div className="space-y-3">
                              {selectedCart.items.map(item => (
                                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                                  <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                                      <img 
                                        src={item.image_url} 
                                        alt={item.name} 
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {item.quantity} × AED {item.price.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="font-medium">
                                    AED {(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-between mt-4 pt-2 border-t">
                              <span className="font-bold">Total</span>
                              <span className="font-bold">AED {selectedCart.total.toFixed(2)}</span>
                            </div>
                            
                            <div className="mt-4 pt-2 border-t">
                              <h3 className="font-medium mb-2">Recovery Link</h3>
                              <div className="flex items-center justify-between bg-slate-50 p-2 rounded">
                                <span className="text-sm truncate mr-2">{selectedCart.recoveryLink}</span>
                                <Button size="sm" variant="ghost" onClick={() => {
                                  navigator.clipboard.writeText(selectedCart.recoveryLink);
                                  toast({
                                    title: "Link copied",
                                    description: "Recovery link copied to clipboard.",
                                  });
                                }}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                            <Button 
                              disabled={selectedCart.notificationSent}
                              onClick={() => {
                                sendRecoveryEmail(selectedCart.id);
                                setSelectedCart({...selectedCart, notificationSent: true});
                              }}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              {selectedCart.notificationSent ? 'Notification Sent' : 'Send Recovery Email'}
                            </Button>
                          </DialogFooter>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={cart.notificationSent}
                    onClick={() => sendRecoveryEmail(cart.id)}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AbandonedCartTable;

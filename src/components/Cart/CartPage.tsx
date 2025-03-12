
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  Phone
} from 'lucide-react';
import { useCart } from './CartContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/integrations/supabase/client';

const CartPage: React.FC = () => {
  const { state, removeFromCart, updateQuantity, generateWhatsAppLink, isLoading } = useCart();
  
  // Check real-time stock availability
  useEffect(() => {
    if (state.items.length > 0) {
      const checkStockAvailability = async () => {
        try {
          // Get product IDs from cart
          const productIds = state.items.map(item => item.id);
          
          // Fetch current stock information
          const { data, error } = await supabase
            .from('products')
            .select('id, name, stock_quantity')
            .in('id', productIds);
            
          if (error) throw error;
          
          // Check for low or out-of-stock items
          if (data) {
            data.forEach(product => {
              const cartItem = state.items.find(item => item.id === product.id);
              
              if (cartItem && product.stock_quantity < cartItem.quantity) {
                // Stock too low for requested quantity
                toast({
                  title: "Stock Alert",
                  description: `Only ${product.stock_quantity} units of ${product.name} are available.`,
                  variant: "destructive"
                });
                
                if (product.stock_quantity <= 0) {
                  // Remove item if out of stock
                  removeFromCart(product.id);
                } else {
                  // Update quantity to available stock
                  updateQuantity(product.id, product.stock_quantity);
                }
              }
            });
          }
        } catch (error) {
          console.error('Error checking stock availability:', error);
        }
      };
      
      checkStockAvailability();
    }
  }, [state.items]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 py-4 border-b">
                  <Skeleton className="h-24 w-24 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <div className="flex items-center space-x-2 mt-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Cart</CardTitle>
            <CardDescription>Your cart is empty</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
          <CardDescription>{state.items.length} items in your cart</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-4 border-b">
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="h-24 w-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    AED {item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    AED {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center pt-4">
              <div>
                <p className="text-lg font-medium">Total: AED {state.total.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  *Final price will be confirmed by our team
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cart ID: {state.id}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <Link to="/shop">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Phone className="mr-2 h-4 w-4" />
                    Place Order via WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartPage;
